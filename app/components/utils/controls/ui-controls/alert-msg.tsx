// import { Alert } from "@mui/material";
// import React from "react";

// type AlertMessageProps = {
//   msg: string;
//   severity: "error" | "warning" | "info" | "success";
// };

// const AlertMessage: React.FC<AlertMessageProps> = ({ msg, severity }) => {
//   return (
//     <>
//       {" "}
//       <Alert severity={severity} sx={{ mb: 2 }}>
//         {msg}
//       </Alert>
//     </>
//   );
// };

// export default AlertMessage;




"use client"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type AlertMessageProps = {
  msg: string
  severity: "error" | "warning" | "info" | "success"
}

const severityStyles = {
  success: "border-green-500 text-green-700",
  error: "border-red-500 text-red-700",
  warning: "border-yellow-500 text-yellow-700",
  info: "border-blue-500 text-blue-700",
}

export default function AlertMessage({ msg, severity }: AlertMessageProps) {
  return (
    <Alert className={`mb-2 ${severityStyles[severity]}`}>
      <AlertTitle className="capitalize">{severity}</AlertTitle>
      <AlertDescription>{msg}</AlertDescription>
    </Alert>
  )
}