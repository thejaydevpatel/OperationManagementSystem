// "use client";

// import { Controller, Control } from "react-hook-form";
// import { Checkbox, FormControlLabel, Typography } from "@mui/material";

// interface RHFCheckboxProps {
//   control: Control<any>;
//   name: string;
//   label: string;
//   defaultValue?: boolean;
// }

// export const RHFCheckbox: React.FC<RHFCheckboxProps> = ({
//   control,
//   name,
//   label,
//   defaultValue = false,
// }) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       defaultValue={defaultValue}
//       render={({ field, fieldState }) => (
//         <>
//           <FormControlLabel
//             control={<Checkbox {...field} checked={!!field.value} />}
//             label={label}
//           />
//           {fieldState.error && (
//             <Typography color="error" variant="caption">
//               {fieldState.error.message}
//             </Typography>
//           )}
//         </>
//       )}
//     />
//   );
// };






"use client";

import { Controller, Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RHFCheckboxProps {
  control: Control<any>;
  name: string;
  label: string;
  defaultValue?: boolean;
}

export const RHFCheckbox: React.FC<RHFCheckboxProps> = ({
  control,
  name,
  label,
  defaultValue = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
            <Label>{label}</Label>
          </div>

          {fieldState.error && (
            <p className="text-sm text-red-500">
              {fieldState.error.message}
            </p>
          )}

        </div>
      )}
    />
  );
};