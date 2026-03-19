// import axios, { AxiosInstance, AxiosResponse } from "axios";

// const HttpService = (baseURL: string) => {
//   const instance: AxiosInstance = axios.create({ baseURL });

//   return {
//     get: <T = unknown>(url: string = ""): Promise<AxiosResponse<T>> =>
//       instance.get<T>(url),

//     getById: <T = unknown>(id: number | string): Promise<AxiosResponse<T>> =>
//       instance.get<T>(`/${id}`),

//     create: <T = unknown>(
//       data: unknown
//     ): Promise<AxiosResponse<T>> =>
//       instance.post<T>("", data),

//     update: <T = unknown>(
//       id: number | string,
//       data: unknown
//     ): Promise<AxiosResponse<T>> =>
//       instance.put<T>(`/${id}`, data),

//     delete: <T = unknown>(
//       id: number | string
//     ): Promise<AxiosResponse<T>> =>
//       instance.delete<T>(`/${id}`),

//     changeStatus: <T = unknown>(
//       id: number | string
//     ): Promise<AxiosResponse<T>> =>
//       instance.patch<T>(`/${id}/status`, {}),
//   };
// };

// export default HttpService;


import axios, { AxiosResponse, AxiosError } from "axios";

const HttpService = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
  });

  // 🔹 Common request handler
  const handleRequest = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
    try {
      const res = await request;
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          status: "error",
          message: error.response?.data?.message || "Server error",
          data: null,
          pagination: null,
        } as T;
      }

      return {
        status: "error",
        message: "Unexpected error occurred",
        data: null,
        pagination: null,
      } as T;
    }
  };

  return {
    get: async <T>(query: string = ""): Promise<T> => {
      return handleRequest(instance.get(query));
    },

    getById: async <T>(id: number | string): Promise<T> => {
      return handleRequest(instance.get(`/${id}`));
    },

    create: async <T>(data: unknown): Promise<T> => {
      return handleRequest(instance.post("", data));
    },

    update: async <T>(id: number | string, data: unknown): Promise<T> => {
      return handleRequest(instance.put(`/${id}`, data));
    },

    delete: async <T>(id: number | string): Promise<T> => {
      return handleRequest(instance.delete(`/${id}`));
    },

    changeStatus: async <T>(id: number | string): Promise<T> => {
      return handleRequest(instance.patch(`/${id}`));
    },
  };
};

export default HttpService;