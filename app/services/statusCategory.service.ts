import { httpClient } from "@/lib/httpClient";

export interface StatusCategory {
  id: number;
  name: string;
  description?: string;
  isactive: boolean;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    totalCount: number;
  };
}

export const statusCategoryService = {
  getAll: (page: number, limit: number) =>
    httpClient.get<PaginatedResponse<StatusCategory>>(
      `/status-category?page=${page}&limit=${limit}`
    ),

  create: (data: Omit<StatusCategory, "id">) =>
    httpClient.post<StatusCategory, Omit<StatusCategory, "id">>(
      "/status-category",
      data
    ),

  update: (id: number, data: Partial<StatusCategory>) =>
    httpClient.put<StatusCategory, Partial<StatusCategory>>(
      `/status-category/${id}`,
      data
    ),

  delete: (id: number) =>
    httpClient.delete<void>(`/status-category/${id}`),
};
