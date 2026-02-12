// utils/response.ts
import { NextResponse } from "next/server";

type ResponseOptions = {
  message?: string;
  data?: unknown; // can be any type safely
  status?: number;
};

// Generic success response
export function success({ message = "Success", data = null, status = 200 }: ResponseOptions) {
  return NextResponse.json({ success: true, message, data }, { status });
}

// Generic error response
export function error({ message = "Something went wrong", status = 500 }: ResponseOptions) {
  return NextResponse.json({ success: false, message, data: null }, { status });
}

// Already exists response
export function exists({ message = "Record already exists", status = 409 }: ResponseOptions) {
  return NextResponse.json({ success: false, message, data: null }, { status });
}

// Not found response
export function notFound({ message = "Record not found", status = 404 }: ResponseOptions) {
  return NextResponse.json({ success: false, message, data: null }, { status });
}
