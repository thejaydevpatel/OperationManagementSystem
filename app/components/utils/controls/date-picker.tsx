// "use client";

// import { Controller, Control } from "react-hook-form";
// import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
// import { TextField } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// interface RHFDatePickerProps {
//   control: Control<any>;
//   name: string;
//   label: string;
//   disabled?: boolean;
//   size?: "small" | "medium";
//   width?: string | number;
// }

// export const RHFDatePicker: React.FC<RHFDatePickerProps> = ({
//   control,
//   name,
//   label,
//   disabled = false,
//   size = "small",
//   width = "100%",
// }) => {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Controller
//         name={name}
//         control={control}
//         render={({ field: { value, onChange }, fieldState }) => (
//           <DatePicker
//             value={value || null}
//             onChange={(newValue) => onChange(newValue)}
//             inputFormat="dd/MM/yyyy"
//             disabled={disabled}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label={label}
//                 size={size}
//                 sx={{ width }}
//                 error={!!fieldState.error}
//                 helperText={fieldState.error?.message || ""}
//               />
//             )}
//           />
//         )}
//       />
//     </LocalizationProvider>
//   );
// };







"use client";

import * as React from "react";
import { Controller, Control } from "react-hook-form";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RHFDatePickerProps {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
  width?: string | number;
}

export const RHFDatePicker: React.FC<RHFDatePickerProps> = ({
  control,
  name,
  label,
  disabled = false,
  width = "100%",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value: Date | null = field.value ?? null;

        return (
          <div className="flex flex-col gap-2" style={{ width }}>
            <label className="text-sm font-medium">{label}</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className="justify-start text-left font-normal"
                >
                  {value ? format(value, "dd/MM/yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ?? undefined}
                  onSelect={(date) => field.onChange(date)}
                />
              </PopoverContent>
            </Popover>

            {fieldState.error && (
              <p className="text-sm text-red-500">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};