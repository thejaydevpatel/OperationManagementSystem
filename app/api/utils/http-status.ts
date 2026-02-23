// utils/httpStatus.ts
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NO_CONTENT = 204,
  CONFLICT = 409,
}

export const HttpStatusText: Record<HttpStatus, string> = {
  [HttpStatus.OK]: "SUCCESSFUL",
  [HttpStatus.CREATED]: "RESOURCE CREATED",
  [HttpStatus.BAD_REQUEST]: "BAD REQUEST",
  [HttpStatus.UNAUTHORIZED]: "UNAUTHORIZED",
  [HttpStatus.FORBIDDEN]: "FORBIDDEN",
  [HttpStatus.NOT_FOUND]: "NOT FOUND",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "INTERNAL SERVER ERROR",
  [HttpStatus.NO_CONTENT]: "NO CONTENT",
  [HttpStatus.CONFLICT]: "CONFLICT",
};
