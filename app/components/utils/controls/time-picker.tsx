// "use client";

// import { Controller, Control } from "react-hook-form";
// import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import dayjs, { Dayjs } from "dayjs";
// import CustomTextField from "../../forms/theme-elements/CustomTextField";

// interface RHFTimePickerProps {
//   control: Control<any>;
//   name: string;
//   label: string;
// }

// export const RHFTimePicker: React.FC<RHFTimePickerProps> = ({
//   control,
//   name,
//   label,
// }) => {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Controller
//         name={name}
//         control={control}
//         render={({ field, fieldState }) => (
//           <TimePicker
//             value={field.value ? dayjs(`2000-01-01T${field.value}`) : null}
//             onChange={(newValue) => {
//               field.onChange(
//                 newValue ? dayjs(newValue).format("HH:mm:ss") : ""
//               );
//             }}
//             renderInput={(params) => (
//               <CustomTextField
//                 {...params}
//                 size="small"
//                 fullWidth
//                 label={label}
//                 error={!!fieldState.error}
//                 helperText={fieldState.error?.message || ""}
//                 sx={{
//                   "& .MuiSvgIcon-root": {
//                     width: "18px",
//                     height: "18px",
//                   },
//                   "& .MuiFormHelperText-root": {
//                     display: fieldState.error ? "block" : "none",
//                   },
//                 }}
//               />
//             )}
//           />
//         )}
//       />
//     </LocalizationProvider>
//   );
// };




"use client"

import { Controller, Control, get, FieldErrors } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RHFTimePickerProps {
  control: Control<any>
  name: string
  label: string
  errors?: FieldErrors<any>
}

export const RHFTimePicker: React.FC<RHFTimePickerProps> = ({
  control,
  name,
  label,
  errors
}) => {

  const error = errors ? (get(errors, name)?.message as string | undefined) : undefined

  return (
    <div className="space-y-2 w-full">

      <Label htmlFor={name}>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            type="datetime-local"
            value={field.value ? field.value.slice(0,16) : ""}
            onChange={(e) => {
              const val = e.target.value
              field.onChange(val || null)
            }}
          />
        )}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

    </div>
  )
}