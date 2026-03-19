
import { Pagination } from "@/app/api/utils/send-response";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import HttpService from "@/app/services/http-service";
import { ATableEntity } from "@/app/api/a-lookup/a-table/interface/a-table";

/**
 * Generic API Response Wrapper
 * Adjust "status" type if your backend returns number instead of string
 */
export interface ApiResponse<T> {
  status: string; // change to number if backend returns number
  message: string;
  data: T;
  pagination: Pagination;
}

export const getATableEntityApi = (module: ModuleDetailsString) => {
  const api = HttpService(module.endPoint);

   return {
      // LIST
      fetchAll: async (
        query: string = ""
      ): Promise<ApiResponse<ATableEntity[]>> => {
        return await api.get<ApiResponse<ATableEntity[]>>(query);
      },
  
      // GET BY ID
      fetchById: async (
        id: number | string
      ): Promise<ApiResponse<ATableEntity>> => {
        return await api.getById<ApiResponse<ATableEntity>>(id);
      },
  
      // CREATE
      create: async (
        data: ATableEntity
      ): Promise<ApiResponse<number>> => {
        return await api.create<ApiResponse<number>>(data);
      },
  
      // UPDATE
      update: async (
        id: number | string,
        data: ATableEntity
      ): Promise<ApiResponse<void>> => {
        return await api.update<ApiResponse<void>>(id, data);
      },
  
      // DELETE
      delete: async (
        id: number | string
      ): Promise<ApiResponse<void>> => {
        return await api.delete<ApiResponse<void>>(id);
      },
  
      // CHANGE STATUS
      changeStatus: async (
        id: number | string
      ): Promise<ApiResponse<void>> => {
        return await api.changeStatus<ApiResponse<void>>(id);
      },
  
      // LIST FLAG (same as changeStatus)
      onListFlag: async (
        id: number | string
      ): Promise<ApiResponse<void>> => {
        return await api.changeStatus<ApiResponse<void>>(id);
      },
    };
};
