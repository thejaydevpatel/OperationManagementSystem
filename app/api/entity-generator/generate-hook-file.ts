import fs from "fs";
import path from "path";

export interface EntityField {
  name: string;
  type: string;
  nullable: boolean;
  toShowOnLayout?: boolean;
  specificControl: string;
  size?: string;
  refTable?: string;
}

const typeMap: Record<string, string> = {
  VARCHAR: "z.string()",
  TEXT: "z.string()",
  UUID: "z.string()",
  TIMESTAMP: "z.string()",
  DATE: "z.string()",
  BOOLEAN: "z.boolean()",
  INT: "z.number()",
  INTEGER: "z.number()",
  BIGINT: "z.number()",
};

function generateZodSchema(fields: EntityField[]): string {
  const schemaLines: string[] = [];
  const fileFields: string[] = [];

  fields
    .filter((f) => f.toShowOnLayout)
    .forEach((field) => {
      let zodType = typeMap[field.type] || "z.string()";

      if (field.specificControl === "File") {
        zodType = "z.any()";
        fileFields.push(field.name);
      }

      if (field.specificControl === "CustomDate") {
        zodType = `customDateField()`;
      }

      if (field.specificControl === "RichTextPicker") {
        zodType = `richTextField()`;
      }

      if (field.specificControl === "MultiCheckbox") {
        zodType = `multiCheckboxField()`;
      }

      if (field.type === "INTEGER") {
        zodType = `integerField()`;
      }

      if (!field.nullable && field.name !== "id" && zodType === "z.string()") {
        if (field.size) {
          zodType = `textField("${field.name}", ${field.size},true)`;
        } else {
          zodType = `textField("${field.name}", 0,true)`;
        }
      }

      if (field.nullable || !field.toShowOnLayout) {
        zodType += `.optional()`;
      }

      schemaLines.push(`  ${field.name}: ${zodType},`);
    });

  // --- superRefine block for files ---
  let superRefineBlock = "";
  if (fileFields.length > 0) {
    superRefineBlock = `
    .superRefine((data, ctx) => {
      ${fileFields
        .map(
          (fileName) => `
       
       validateFileField(data, ctx, "${fileName}", isEdit);
             
      `
        )
        .join("\n")}
    })`;
  }

  return `const getSchema = (isEdit: boolean) => 
  z.object({
${schemaLines.join("\n")}
  })${superRefineBlock};`;
}

function getDefaultValueByType(type: string, nullable: boolean) {
  switch (type.toLowerCase()) {
    case "string":
    case "varchar":
    case "nvarchar":
      return "";
    case "integer":
    case "bigint":
    case "decimal":
    case "float":
    case "number":
      return 0;
    case "boolean":
    case "bit":
      return false;
    case "timestamp with time zone not need":
    case "datetime":
    case "timestamp":
      return new Date().toISOString();
    default:
      return undefined;
  }
}

export function buildDefaultValues(entityFields: EntityField[]) {
  const defaultValues: Record<string, any> = {};

  for (const field of entityFields) {
    if (field.toShowOnLayout && field.specificControl != "NormalDropDown")
      defaultValues[field.name] = getDefaultValueByType(
        field.type,
        field.nullable
      );
  }

  return { defaultValues };
}
/**
 * Generates a React custom hook file (`use-service.tsx`) for the given entity
 */
export function generateUseServiceFile(
  moduleName: string,
  tableName: string,
  fields: EntityField[],
  isChildPage: boolean,
  mainTable: string
): void {
  const dirPath = path.join(
    process.cwd(),
    "src",
    "app",
    "components",
    moduleName.replaceAll("_", "-"),
    tableName.replaceAll("_", "-")
  );

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "use-service.tsx");

  if (fs.existsSync(filePath)) {
    console.log(
      `⚠️ use-service.tsx already exists for ${moduleName}/${tableName}, skipping.`
    );
    return;
  }

  const interfaceName =
    tableName
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("") + "Entity";

  const schema = generateZodSchema(fields);

  const defaultValues = buildDefaultValues(fields);

  const dropdownFields = fields.filter(
    (f) =>
      f.specificControl === "MultiCheckbox" ||
      f.specificControl === "NormalDropDown" ||
      f.specificControl === "DropDown"
  );

  const dropdownStates = dropdownFields
    .map(
      (f) =>
        ` const [${f.name}, set${
          f.name.charAt(0).toUpperCase() + f.name.slice(1)
        }] = useState<any[]>([]);`
    )
    .join("\n");

  //   const dropdownHandlers = dropdownFields
  //     .map(
  //       (f) => ` if (key === "${f.name}") {
  // set${
  //         f.name.charAt(0).toUpperCase() + f.name.slice(1)
  //       }([]); // update with fetched data
  // }`
  //     )
  //     .join("\n\n");

  const dropdownHandlers = dropdownFields
    .map((f) => {
      if (!f.refTable) {
        return `if (key === "${f.name}") {
        // ⚠️ No refTable defined for ${f.name}, skipping API call
        // set${f.name.charAt(0).toUpperCase() + f.name.slice(1)}([]);
      }`;
      }

      // const parts = f.refTable.split("_");
      // const firstPart = parts.slice(0, 2).join("-");
      // const secondPart = parts.slice(2).join("-");
      // const endpoint = `/${firstPart}/${secondPart}?pageSize=9999`;  //  //"${endpoint}";

      return `if (key === "${f.name}") {
      const endPoint =dropdownEndpoints[key]; 
      if (endPoint) {
      const result = await handleRefreshAPIs(endPoint);
      set${f.name.charAt(0).toUpperCase() + f.name.slice(1)}(result.data);
    }
    }`;
    })
    .join("\n\n");

  const stateReturn = dropdownFields.map((f) => `${f.name},`).join("\n ");

  const content = `import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler,Resolver } from "react-hook-form";
import { toast } from "sonner"; 

${
  isChildPage
    ? `import { ${interfaceName} } from "@/app/api/${moduleName.replaceAll(
        "_",
        "-"
      )}/${mainTable.replaceAll("_", "-")}/[id]/${tableName.replaceAll(
        "_",
        "-"
      )}/interface/${tableName.replaceAll("_", "-")}"`
    : `import { ${interfaceName} } from "@/app/api/${moduleName.replaceAll(
        "_",
        "-"
      )}/${tableName.replaceAll("_", "-")}/interface/${tableName.replaceAll(
        "_",
        "-"
      )}"`
}
  

import { get${interfaceName}Api } from "./service";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import { HttpStatus, HttpStatusText } from "@/app/api/utils/http-status";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { Pagination, ServiceOrder } from "@/app/api/utils/send-response";
import { validateFileField } from "@/app/components/utils/validations/file-validation";
import { customDateField } from "@/app/components/utils/validations/custom-date-field";
import { integerField } from "@/app/components/utils/validations/integer-field";
import { multiCheckboxField } from "@/app/components/utils/validations/multi-checkbox-field ";
import { richTextField } from "@/app/components/utils/validations/rich-text-field";
import { textField } from "@/app/components/utils/validations/text-validation";
import { emailField } from "@/app/components/utils/validations/email-field";
import { phoneNumberField } from "@/app/components/utils/validations/phone-number-field";
import { useUnsavedChangesWarning } from "@/app/hooks/use-unsaved-changes-warning";

${schema}

export const useService = (module: ModuleDetailsString) => {
const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [btnLoading, setBtnLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); 
   const [dropDownloading, setDropDownloading] = useState<{
      [key: string]: boolean;
    }>({});
  
    const [page, setPage] = useState(Number(searchParams.get("page")) || 0);
    const [rowsPerPage, setRowsPerPage] = useState(
      Number(searchParams.get("pageSize")) || 5
    );
  
    const [sortBy, setSortBy] = useState<keyof ${interfaceName}>(
      (searchParams.get("sort") as keyof ${interfaceName}) || "id"
    );
  
    const [order, setOrder] = useState<ServiceOrder>(
      (searchParams.get("order") as ServiceOrder) || "desc"
    );
  
    const [totalRecordObj, setTotalRecordObj] = useState<Pagination>();
   
     
  const [list, setList] = useState<${interfaceName}[]>([]);
  const [editId, setEditId] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  ${dropdownStates ? "\n" + dropdownStates + "\n" : ""}

const dropdownEndpoints: Record<string, string | null> = {
  ${dropdownFields
    .map((f) => {
      if (!f.refTable) return `${f.name}: null,`;
      const parts = f.refTable.split("_");
      const firstPart = parts.slice(0, 2).join("-");
      const secondPart = parts.slice(2).join("-");
      const endpoint = `\`${"${process.env.NEXT_PUBLIC_REACT_APP_API_URL}"}/${firstPart}/${secondPart}?pageSize=9999\``;
      return `${f.name}: ${endpoint},`;
    })
    .join("\n  ")}
};


  const api = get${interfaceName}Api(module);

 
  const customResolver: Resolver<${interfaceName}> = async (
      values,
      _context,
      options
    ) => {
      const isEdit = !!editId;
      const schema = getSchema(isEdit); // <- dynamic!
      return zodResolver(schema)(values, undefined, options);
    };


  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<${interfaceName}>({
    resolver: customResolver,
      defaultValues:${JSON.stringify(defaultValues.defaultValues)}
  });

   useUnsavedChangesWarning(isDirty);

  const fetchDataFromAPI = useCallback(async (): Promise<void> => {
      try {
        const endpoints: string[] = [];
         // include dropdown endpoints
    Object.values(dropdownEndpoints)
      .filter((url): url is string => !!url)
      .forEach((url) => endpoints.push(url));

  
        if (module.serviceId && module.serviceId !== "0") {
          endpoints.push(\`\${module.subDirectoryEndPoint}/\${module.serviceId}\`);
        }
  
        const responses = await Promise.all(
          endpoints.map((url) =>
            fetch(url).then((res) => {
              if (!res.ok) throw new Error(\`Failed to fetch \${url}\`);
              return res.json();
            })
          )
        );

        let responseIndex = 0;
      for (const [field, endpoint] of Object.entries(dropdownEndpoints)) {
        if (!endpoint) continue;
        const setter = eval(
          \`set$\{field.charAt(0).toUpperCase() + field.slice(1)}\`
        );
        setter(responses[responseIndex].data);
        responseIndex++;
      }
        
  
        const listById = responses[endpoints.length-1] ?? null;
  
       
        if (module.serviceId !== "0" && module.serviceId !== "") {
          await handleEdit(listById, Number(module.serviceId));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, []);

  // Keep URL in sync with state
  const updateUrl = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.push(\`?\${params.toString()}\`);
  };

  const fetchDataFromAPIList = useCallback(async (): Promise<void> => {
      try { 

        const params = new URLSearchParams({
        page: (page + 1).toString(), 
        pageSize: rowsPerPage.toString(),
        sortBy: sortBy,
        order: order,
      });

      const query = params.toString();
      await new Promise((resolve) => setTimeout(resolve, 250));

      const response = await api.fetchAll(query);
      setList(response.data);
      setTotalRecordObj(response.pagination);

      updateUrl({ page, pageSize: rowsPerPage, sortBy: sortBy, order });
      setPage(response.pagination.page - 1);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, [page, rowsPerPage, sortBy, order]);

      const nevigateListOrEdit = async (
    newInsert: boolean = false
  ): Promise<void> => {
    if (newInsert) {
      //router.push(String(pathname).replace("/new", "/list"));
      const parts = String(pathname).split("/").filter(Boolean);
      parts.pop();
      parts.push("list");
      router.push("/" + parts.join("/"));
    }
       else {
     if (module.isListView) {
        await fetchDataFromAPIList();
      } else {
        await fetchDataFromAPI();
      }
}
     setPageLoading(false);
  };

  useEffect(() => {
    nevigateListOrEdit();
    }, [page, rowsPerPage, sortBy, order]);

   
  const onSubmit: SubmitHandler<${interfaceName}> = async (values) => {
   setBtnLoading(true);
    const data = { ...values };
    let response;
    if (editId) {
      response = await api.update(editId, data);
    } else {
      response = await api.create(data);
    }
     
    if (
      response.status == HttpStatusText[HttpStatus.CREATED] ||
      response.status == HttpStatusText[HttpStatus.OK]
    ) {
      toast.success(response.message);
      await handleImageUploads(values, editId > 0 ? editId : response.data);
      await nevigateListOrEdit(true);
    } else {
      toast.error(response.message);
     setBtnLoading(false);
    }
  };

  const handleImageUploads = async (
      values: ${interfaceName},
      id: number
    ): Promise<void> => {
      const formData = new FormData();
      formData.append("id", id.toString());
  
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        }
      });
      
   if (true) {
      const response = await fetch(\`\${module.endPoint}/\${id}/upload\`, {
        method: "PATCH",
        body: formData,
      });
  
        await response.json();
       }
    };

  const handleEdit = async (response: any, Id: number): Promise<void> => { 
    if (response.data.length > 0) {
      const record = response.data[0] as ${interfaceName};
      const remapped: Record<string, unknown> = { ...record };
      (Object.keys(record) as (keyof ${interfaceName})[]).forEach((key) => {
        remapped[key as string] = record[key];
        //if (key.startsWith("file_")) {
          remapped[\`\${key}Logo\`] = record[key];
       //}
      });
      reset(remapped);
      setEditId(Id);
    } else {
      toast.error(response.message);
    }
  };

  const handleDelete = async (Id: number): Promise<void> => {
    const response = await api.delete(Id);
    if (response.status == HttpStatusText[HttpStatus.OK]) {
      toast.success(response.message);
      nevigateListOrEdit();
    } else {
      toast.error(response.message + "" + JSON.stringify(response.data));
    }
  };

  const handleStatusChange = async (Id: number): Promise<void> => { 
      const response = await api.changeStatus(Id);
      if (response.status == HttpStatusText[HttpStatus.OK]) {
        toast.success(response.message);
        nevigateListOrEdit();
      } else {
        toast.error(response.message);
      }
    };

  const handleClear = (): void => {
    reset({} as ${interfaceName});
    setEditId(0);
  };

  const handleView = (): void => {
      reset({} as ${interfaceName});
      setEditId(0);
    };
  
    const handleOnListToggle = (): void => {
      reset({} as ${interfaceName});
      setEditId(0);
    };

  const closeModal = (): void => setModal(false);
  const openModal = (): void => { handleClear(); setModal(true); };

  const handleRefresh = async (
    key: string,
    fetchFn: (key: string) => Promise<any>
  ) => {
    
    setDropDownloading((prev) => ({ ...prev, [key]: true }));

    await fetchFn(key);

    setDropDownloading((prev) => ({ ...prev, [key]: false }));
  };

   const handleRefreshAPIs = async (endPoint: string) => {
    const response = await fetch(
      \`\${endPoint}\`,
      {
        method: "GET",
      }
    );

    return await response.json();
  };


  
  const handleDropDown = async (key: string) => {
     

    await new Promise((resolve) => setTimeout(resolve, 500));
      ${dropdownHandlers}
  };

  return {
    state: { register, list, editId, modal, setList,btnLoading, pageLoading, page,
      rowsPerPage,
      setPage,
      setRowsPerPage,
      totalRecordObj,
      sortBy,
      setSortBy,
      order,
      setOrder,   dropDownloading,
      setDropDownloading,${stateReturn} },
    form: { handleSubmit, errors, onSubmit, control,setValue },
    actions: { handleStatusChange, handleDelete, handleClear, handleEdit, closeModal, openModal,  handleView, handleOnListToggle,  handleRefresh,
      handleDropDown,  },
  };
};
`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Generated use-service.tsx for ${moduleName}/${tableName}`);
  } else {
    console.log(`⏭️ Skipped ${filePath} (already exists)`);
  }
}
