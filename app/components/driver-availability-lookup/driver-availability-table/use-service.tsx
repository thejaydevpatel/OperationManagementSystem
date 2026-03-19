
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler,Resolver } from "react-hook-form";
import { toast } from "sonner"; 

import { DriverAvailabilityTableEntity } from "@/app/api/driver-availability-lookup/driver-availability-table/interface/driver-availability-table"
   

import { getDriverAvailabilityTableEntityApi } from "./service";
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
  driver_id: z.number().int(),
  is_available: z.boolean(),
  current_location_id: z.number().int().optional(),
  current_job_id: z.number().int().optional(),
  next_free_time: z.string().optional(),
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
  
    const [sortBy, setSortBy] = useState<keyof DriverAvailabilityTableEntity>(
      (searchParams.get("sort") as keyof DriverAvailabilityTableEntity) || "id"
    );
  
    const [order, setOrder] = useState<ServiceOrder>(
      (searchParams.get("order") as ServiceOrder) || "desc"
    );
  
    const [totalRecordObj, setTotalRecordObj] = useState<Pagination>();
   
     
  const [list, setList] = useState<DriverAvailabilityTableEntity[]>([]);
  const [editId, setEditId] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  
 const [driver_id, setDriver_id] = useState<any[]>([]);
 const [current_location_id, setCurrent_location_id] = useState<any[]>([]);
 const [current_job_id, setCurrent_job_id] = useState<any[]>([]);


const dropdownEndpoints: Record<string, string | null> = {
  driver_id: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/drivers-lookup/drivers-table?pageSize=9999`,
  current_location_id: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/location-master-lookup/location-master-table?pageSize=9999`,
  current_job_id: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/operation-jobs-lookup/operation-jobs-table?pageSize=9999`,
};

  const api = getDriverAvailabilityTableEntityApi(module);

 
  // const customResolver: Resolver<DriverAvailabilityTableEntity> = async (
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
  } = useForm<DriverAvailabilityTableEntity>({
 defaultValues: {
  is_available: false,
  next_free_time: "",
},  
    // resolver: zodResolver(getSchema(false)),
      // defaultValues:{"is_available":false}
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

   
  const onSubmit: SubmitHandler<DriverAvailabilityTableEntity> = async (values) => {
    // ✅ Validation
  
  if (values.driver_id === undefined || values.driver_id === null) {
    toast.error("driver_id is required");
    return;
  }

  if (values.is_available === undefined || values.is_available === null) {
    toast.error("is_available is required");
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
      values: DriverAvailabilityTableEntity,
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
  response: { data: DriverAvailabilityTableEntity[]; message: string },
  Id: number
): Promise<void> => { 
    if (response.data.length > 0) {
      const record = response.data[0] as DriverAvailabilityTableEntity;
      const remapped: Record<string, unknown> = { ...record };
      (Object.keys(record) as (keyof DriverAvailabilityTableEntity)[]).forEach((key) => {
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

  // const handleStatusChange = async (Id: number): Promise<void> => { 
  //     const response = await api.changeStatus(Id);
  //     if (response.status == HttpStatusText[HttpStatus.OK]) {
  //       toast.success(response.message);
  //       nevigateListOrEdit();
  //     } else {
  //       toast.error(response.message);
  //     }
  //   };
const handleStatusChange = async (
  id: number,
  field: string
): Promise<void> => {

  const response = await api.changeStatus(id, field);

  if (response.status === HttpStatusText[HttpStatus.OK]) {
    toast.success(response.message);
    nevigateListOrEdit();
  } else {
    toast.error(response.message);
  }
};
  const handleClear = (): void => {
    reset({} as DriverAvailabilityTableEntity);
    setEditId(0);
  };

  const handleView = (): void => {
      reset({} as DriverAvailabilityTableEntity);
      setEditId(0);
    };
  
    const handleOnListToggle = (): void => {
      reset({} as DriverAvailabilityTableEntity);
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
      if (key === "driver_id") {
      const endPoint =dropdownEndpoints[key]; 
      if (endPoint) {
      const result = await handleRefreshAPIs(endPoint);
      setDriver_id(result.data);
    }
    }

if (key === "current_location_id") {
      const endPoint =dropdownEndpoints[key]; 
      if (endPoint) {
      const result = await handleRefreshAPIs(endPoint);
      setCurrent_location_id(result.data);
    }
    }

if (key === "current_job_id") {
      const endPoint =dropdownEndpoints[key]; 
      if (endPoint) {
      const result = await handleRefreshAPIs(endPoint);
      setCurrent_job_id(result.data);
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
      setDropDownloading,driver_id,
 current_location_id,
 current_job_id, },
    form: { handleSubmit, errors, onSubmit, control,setValue },
    actions: { handleStatusChange, handleDelete, handleClear, handleEdit, closeModal, openModal,  handleView, handleOnListToggle,  handleRefresh,
      handleDropDown,  },
  };
};
