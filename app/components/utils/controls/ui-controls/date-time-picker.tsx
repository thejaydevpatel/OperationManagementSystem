// // RHFDateTimePicker.tsx
// "use client";

// import React from "react";
// import { Control, Controller, useFormContext } from "react-hook-form";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import TextField from "@mui/material/TextField";
// import FormControl from "@mui/material/FormControl";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// interface Props {
//   control: Control<any>;
//   name: string;
//   label?: string;
//   disabled?: boolean;
// }

// export default function RHFDateTimePicker({
//   control,
//   name,
//   label,
//   disabled,
// }: Props) {
//   // const { control } = useFormContext();

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Controller
//         name={name}
//         control={control}
//         render={({ field, fieldState: { error } }) => {
//           const value = field.value ?? null;
//           return (
//             <FormControl fullWidth>
//               <DateTimePicker
//                 label={label}
//                 value={value as Date | null}
//                 onChange={(val) => {
//                   field.onChange(val as Date | null);
//                 }}
//                 disabled={disabled}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     error={!!error}
//                     helperText={error?.message}
//                     fullWidth
//                   />
//                 )}
//               />
//             </FormControl>
//           );
//         }}
//       />
//     </LocalizationProvider>
//   );
// }






"use client";

import * as React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";

interface Props {
  control: Control<FieldValues>;
  name: string;
  label?: string;
  disabled?: boolean;
}

export default function RHFDateTimePicker({
  control,
  name,
  label,
  disabled,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value: Date | null = field.value ?? null;

        const handleDateChange = (date: Date | undefined) => {
          if (!date) return;

          const newDate = value ? new Date(value) : new Date();

          newDate.setFullYear(date.getFullYear());
          newDate.setMonth(date.getMonth());
          newDate.setDate(date.getDate());

          field.onChange(newDate);
        };

        const handleTimeChange = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number);

          const newDate = value ? new Date(value) : new Date();
          newDate.setHours(hours);
          newDate.setMinutes(minutes);

          field.onChange(newDate);
        };

        return (
          <div className="flex flex-col gap-2 w-full">
            {label && (
              <label className="text-sm font-medium">
                {label}
              </label>
            )}

            <div className="flex gap-2">
              
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className="w-[200px] justify-start text-left"
                  >
                    {value
                      ? format(value, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={handleDateChange}
                  />
                </PopoverContent>
              </Popover>

              {/* Time Picker */}
              <Input
                type="time"
                disabled={disabled}
                value={
                  value
                    ? format(value, "HH:mm")
                    : ""
                }
                onChange={(e) =>
                  handleTimeChange(e.target.value)
                }
                className="w-[120px]"
              />

            </div>

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
}