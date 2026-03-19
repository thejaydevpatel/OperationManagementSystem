
import { Pagination } from "@/app/api/utils/send-response";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import HttpService from "@/app/services/http-service";
import { GuestReviewTableEntity } from "@/app/api/guest-review-lookup/guest-review-table/interface/guest-review-table";

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

export const getGuestReviewTableEntityApi = (module: ModuleDetailsString) => {
  const api = HttpService(module.endPoint);

   return {
      // LIST
      fetchAll: async (
        query: string = ""
      ): Promise<ApiResponse<GuestReviewTableEntity[]>> => {
        return await api.get<ApiResponse<GuestReviewTableEntity[]>>(query);
      },
  
      // GET BY ID
      fetchById: async (
        id: number | string
      ): Promise<ApiResponse<GuestReviewTableEntity>> => {
        return await api.getById<ApiResponse<GuestReviewTableEntity>>(id);
      },
  
      // CREATE
      create: async (
        data: GuestReviewTableEntity
      ): Promise<ApiResponse<number>> => {
        return await api.create<ApiResponse<number>>(data);
      },
  
      // UPDATE
      update: async (
        id: number | string,
        data: GuestReviewTableEntity
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
      // changeStatus: async (
      //   id: number | string
      // ): Promise<ApiResponse<void>> => {
      //   return await api.changeStatus<ApiResponse<void>>(id);
      // },
  changeStatus: async (id: number, field: string) => {
  return fetch(
    `/api/guest-review-lookup/guest-review-table/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field }),
    }
  ).then((res) => res.json());
},
      // LIST FLAG (same as changeStatus)
      onListFlag: async (
        id: number | string
      ): Promise<ApiResponse<void>> => {
        return await api.changeStatus<ApiResponse<void>>(id);
      },
    };
};
