import { NextResponse } from "next/server";
import { HttpStatus, HttpStatusText } from "../utils/http-status";
import { statusMessages } from "./status-messages";

type SendFinalResponseArgs<T = any> = {
  message: string;
  statusCode: HttpStatus;
  data?: T;
  startTime?: number;
  pagination?: Pagination;
};

export interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  sortBy: string;
  order: string;
}

export type ServiceOrder = "asc" | "desc";

function sendFinalResponse<T>({
  message,
  statusCode,
  data,
  startTime,
  pagination,
}: SendFinalResponseArgs<T>) {
  const duration = startTime ? `${Date.now() - startTime}ms` : undefined;

  const response = {
    success: statusCode < 400,
    message,
    status: HttpStatusText[statusCode],
    data,
    duration,
    pagination: pagination,
  };

  return NextResponse.json(response, { status: statusCode });
}

export const ApiResponse = {
  created: <T>(data: T, startTime: number) =>
    sendFinalResponse({
      message: "Resource created successfully.",
      statusCode: HttpStatus.CREATED,
      data,
      startTime,
    }),

  updated: <T>(data: T, startTime: number) =>
    sendFinalResponse({
      message: "Resource updated successfully.",
      statusCode: HttpStatus.OK,
      data,
      startTime,
    }),

  deleted: (startTime: number) =>
    sendFinalResponse({
      message: "Resource deleted.",
      statusCode: HttpStatus.OK,
      data: 0,
      startTime,
    }),

  fetched: <T>(
    data: T,
    startTime: number,
    msg: string,
    pagination?: Pagination
  ) =>
    sendFinalResponse({
      message: msg || "Resource fetched successfully.",
      statusCode: HttpStatus.OK,
      data,
      startTime,
      pagination,
    }),

  notFound: (startTime: number) =>
    sendFinalResponse({
      message: "Resource not found.",
      statusCode: HttpStatus.NOT_FOUND,
      data: null,
      startTime,
    }),

  alreadyExists: (startTime: number) =>
    sendFinalResponse({
      message: "Resource already exists.",
      statusCode: HttpStatus.CONFLICT,
      data: null,
      startTime,
    }),

  notAllowed: (startTime: number) =>
    sendFinalResponse({
      message: "Action not allowed.",
      statusCode: HttpStatus.FORBIDDEN,
      data: null,
      startTime,
    }),

  badRequest: (msg: string, startTime: number) =>
    sendFinalResponse({
      message: msg || "Bad request.",
      statusCode: HttpStatus.BAD_REQUEST,
      data: null,
      startTime,
    }),

  failed: (msg: string, startTime: number) =>
    sendFinalResponse({
      message: msg || "Something went wrong.",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      startTime,
    }),

  suspended: (startTime: number) =>
    sendFinalResponse({
      message: "Resource suspended.",
      statusCode: HttpStatus.OK,
      data: null,
      startTime,
    }),

  activated: (startTime: number) =>
    sendFinalResponse({
      message: "Resource activated.",
      statusCode: HttpStatus.OK,
      data: null,
      startTime,
    }),

  deactivated: (startTime: number) =>
    sendFinalResponse({
      message: "Resource deactivated.",
      statusCode: HttpStatus.OK,
      data: null,
      startTime,
    }),

  unAuthorized: (msg: string, startTime: number) =>
    sendFinalResponse({
      message: msg || statusMessages.DATA_AUTH_ERROR,
      statusCode: HttpStatus.UNAUTHORIZED,
      data: null,
      startTime,
    }),

  referencedError: (msg: string, startTime: number, data: any) =>
    sendFinalResponse({
      message: "References Error.",
      statusCode: HttpStatus.BAD_REQUEST,
      data: data,
      startTime,
    }),
};
