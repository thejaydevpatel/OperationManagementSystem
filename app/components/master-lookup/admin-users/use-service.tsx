
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler,Resolver } from "react-hook-form";
import { toast } from "sonner"; 

import { AdminUsersEntity } from "@/app/api/master-lookup/admin-users/interface/admin-users"
   

import { getAdminUsersEntityApi } from "./service";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import { HttpStatus, HttpStatusText } from "@/app/api/utils/http-status";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { Pagination, ServiceOrder } from "@/app/api/utils/send-response";
import { validateFileField } from "@/app/components/utils/validations/file-validation";
import { customDateField } from "@/app/components/utils/validations/custom-date-field";
import { integerField } from "@/app/components/utils/validations/integer-field";
import { multiCheckboxField } from "../../utils/validations/multi-checkbox-field";
import { richTextField } from "@/app/components/utils/validations/rich-text-field";
import { textField } from "@/app/components/utils/validations/text-validation";
import { emailField } from "@/app/components/utils/validations/email-field";
import { phoneNumberField } from "@/app/components/utils/validations/phone-number-field";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

const getSchema = (isEdit: boolean) =>
  z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().min(1, "email is required"),
  password: z.string().min(1, "password is required"),
  role: z.number().int(),
  });


// type FormValues = z.infer<ReturnType<typeof getSchema>>;

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
  
    const [sortBy, setSortBy] = useState<keyof AdminUsersEntity>(
      (searchParams.get("sort") as keyof AdminUsersEntity) || "id"
    );
  
    const [order, setOrder] = useState<ServiceOrder>(
      (searchParams.get("order") as ServiceOrder) || "desc"
    );
  
    const [totalRecordObj, setTotalRecordObj] = useState<Pagination>();
   
     
  const [list, setList] = useState<AdminUsersEntity[]>([]);
  const [editId, setEditId] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  
 const [role, setRole] = useState<any[]>([]);


const dropdownEndpoints: Record<string, string | null> = {
  role: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/master-lookup/roles?pageSize=9999`,
};

  const api = getAdminUsersEntityApi(module);

 
  // const customResolver: Resolver<AdminUsersEntity> = async (
  //     values,
  //     _context,
  //     options
  //   ) => {
  //     const isEdit = !!editId;
  //     const schema = getSchema(isEdit); // <- dynamic!
  //     return zodResolver(schema)(values, undefined, options);
  //   };


  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminUsersEntity>({
 defaultValues: {
  name: "",
  email: "",
  password: "",
},  
    // resolver: zodResolver(getSchema(false)),
      // defaultValues:{"name":"","email":"","password":""}
  });

  //  useUnsavedChangesWarning(isDirty);

  const fetchDataFromAPI = useCallback(async (): Promise<void> => {
      try {
        const endpoints: string[] = [];
         // include dropdown endpoints
    Object.values(dropdownEndpoints)
      .filter((url): url is string => !!url)
      .forEach((url) => endpoints.push(url));

  
        if (module.serviceId && module.serviceId !== "0") {
          endpoints.push(`${module.subDirectoryEndPoint}/${module.serviceId}`);
        }
  
        const responses = await Promise.all(
          endpoints.map((url) =>
            fetch(url).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch ${url}`);
              return res.json();
            })
          )
        );

        let responseIndex = 0;
      for (const [field, endpoint] of Object.entries(dropdownEndpoints)) {
        if (!endpoint) continue;
        const setter = eval(
          `set${field.charAt(0).toUpperCase() + field.slice(1)}`
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
    router.push(`?${params.toString()}`);
  };

  const fetchDataFromAPIList = useCallback(async (): Promise<void> => {
      try { 

        const params = new URLSearchParams({
        page: (page + 1).toString(), 
        pageSize: rowsPerPage.toString(),
        sortBy: sortBy,
        order: order,
      });

      // const query = params.toString();
      const query = `?${params.toString()}`;
      await new Promise((resolve) => setTimeout(resolve, 250));

      const response = await api.fetchAll(query);
      setList(response.data);
      setTotalRecordObj(response.pagination);

      // updateUrl({ page, pageSize: rowsPerPage, sortBy: sortBy, order });
      // setPage(response.pagination.page - 1);


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
    }, [page, rowsPerPage, sortBy, order, module]);

   
  const onSubmit: SubmitHandler<AdminUsersEntity> = async (values) => {
    // ✅ Validation
  
  if (values.name === undefined || values.name === null) {
    toast.error("name is required");
    return;
  }

  if (values.email === undefined || values.email === null) {
    toast.error("email is required");
    return;
  }

  if (values.password === undefined || values.password === null) {
    toast.error("password is required");
    return;
  }

  if (values.role === undefined || values.role === null) {
    toast.error("role is required");
    return;
  }
  
   setBtnLoading(true);
    const data = { ...values };
    // let response;
    // if (editId) {
    //   response = await api.update(editId, data);
    // } else {
    //   response = await api.create(data);
    // }
     
    // if (
    //   response.status == HttpStatusText[HttpStatus.CREATED] ||
    //   response.status == HttpStatusText[HttpStatus.OK]
    // ) {
    //   toast.success(response.message);
    //   await handleImageUploads(values, editId > 0 ? editId : response.data);
    //   await nevigateListOrEdit(true);
    // } else {
    //   toast.error(response.message);
    //  setBtnLoading(false);
    // }
    let recordId: number;

if (editId) {
  const response = await api.update(editId, data);

  if (response.status === HttpStatusText[HttpStatus.OK]) {
    recordId = editId;
    toast.success(response.message);
  } else {
    toast.error(response.message);
    setBtnLoading(false);
    return;
  }
} else {
  const response = await api.create(data);

  if (response.status === HttpStatusText[HttpStatus.CREATED]) {
    recordId = response.data;
    toast.success(response.message);
  } else {
    toast.error(response.message);
    setBtnLoading(false);
    return;
  }
}

await handleImageUploads(values, recordId);
await nevigateListOrEdit(true);
  };

  const handleImageUploads = async (
      values: AdminUsersEntity,
      id: number
    ): Promise<void> => {
      const formData = new FormData();
      formData.append("id", id.toString());
  
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        }
      });
      
   if ([...formData.keys()].length > 1){
      const response = await fetch(`${module.endPoint}/${id}/upload`, {
        method: "PATCH",
        body: formData,
      });
  
        await response.json();
       }
    };

  const handleEdit = async (
  response: { data: AdminUsersEntity[]; message: string },
  Id: number
): Promise<void> => { 
    if (response.data.length > 0) {
      const record = response.data[0] as AdminUsersEntity;
      const remapped: Record<string, unknown> = { ...record };
      (Object.keys(record) as (keyof AdminUsersEntity)[]).forEach((key) => {
        remapped[key as string] = record[key];
        //if (key.startsWith("file_")) {
          remapped[`${key}Logo`] = record[key];
       //}
      });
      reset(remapped);
      setEditId(Id);
    } else {
      // toast.error(response.message);
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
    reset({} as AdminUsersEntity);
    setEditId(0);
  };

  const handleView = (): void => {
      reset({} as AdminUsersEntity);
      setEditId(0);
    };
  
    const handleOnListToggle = (): void => {
      reset({} as AdminUsersEntity);
      setEditId(0);
    };

  const closeModal = (): void => setModal(false);
  const openModal = (): void => { handleClear(); setModal(true); };

  const handleRefresh = async (
    key: string,
    fetchFn: (key: string) => Promise<unknown>
  ) => {
    
    setDropDownloading((prev) => ({ ...prev, [key]: true }));

    await fetchFn(key);

    setDropDownloading((prev) => ({ ...prev, [key]: false }));
  };

   const handleRefreshAPIs = async (endPoint: string) => {
    const response = await fetch(
      `${endPoint}`,
      {
        method: "GET",
      }
    );

    return await response.json();
  };


  
  const handleDropDown = async (key: string) => {
     

    await new Promise((resolve) => setTimeout(resolve, 500));
      if (key === "role") {
      const endPoint =dropdownEndpoints[key]; 
      if (endPoint) {
      const result = await handleRefreshAPIs(endPoint);
      setRole(result.data);
    }
    }
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
      setDropDownloading,role, },
    form: { handleSubmit, errors, onSubmit, control,setValue },
    actions: { handleStatusChange, handleDelete, handleClear, handleEdit, closeModal, openModal,  handleView, handleOnListToggle,  handleRefresh,
      handleDropDown,  },
  };
};
