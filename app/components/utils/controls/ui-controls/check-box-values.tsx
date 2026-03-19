// "use client";

// import React from "react";
// import { Controller, Control } from "react-hook-form";
// import {
//   Checkbox,
//   FormControlLabel,
//   Typography,
//   FormGroup,
//   FormHelperText,
//   Box,
// } from "@mui/material";

// interface RHFCheckboxProps {
//   control: Control<any>;
//   name: string;
//   label: string;
//   options?: string[];
//   defaultValue?: boolean | string[];
// }

// export const RHFCheckboxValue: React.FC<RHFCheckboxProps> = ({
//   control,
//   name,
//   label,
//   options,
//   defaultValue = false,
// }) => {
//   const isMulti = Array.isArray(options) && options.length > 0;

//   return (
//     <Controller
//       name={name}
//       control={control}
//       defaultValue={isMulti ? [] : defaultValue}
//       render={({ field, fieldState }) => (
//         <>
//           {isMulti ? (
//             <Box>
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                 {label}
//               </Typography>

//               {/* Horizontal Row */}
//               <FormGroup
//                 row
//                 sx={{
//                   display: "flex",
//                   flexDirection: "row",
//                   gap: 2,
//                   flexWrap: "wrap",
//                 }}
//               >
//                 {options!.map((option) => {
//                   const checked = Array.isArray(field.value)
//                     ? field.value.includes(option)
//                     : false;

//                   const handleChange = (
//                     event: React.ChangeEvent<HTMLInputElement>
//                   ) => {
//                     const value = event.target.value;
//                     let newValue = Array.isArray(field.value)
//                       ? [...field.value]
//                       : [];

//                     if (event.target.checked) {
//                       newValue.push(value);
//                     } else {
//                       newValue = newValue.filter((v) => v !== value);
//                     }

//                     field.onChange(newValue);
//                   };

//                   return (
//                     <FormControlLabel
//                       key={option}
//                       control={
//                         <Checkbox
//                           checked={checked}
//                           onChange={handleChange}
//                           value={option}
//                         />
//                       }
//                       label={option}
//                     />
//                   );
//                 })}
//               </FormGroup>

//               {fieldState.error && (
//                 <FormHelperText error>
//                   {fieldState.error.message}
//                 </FormHelperText>
//               )}
//             </Box>
//           ) : (
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   {...field}
//                   checked={!!field.value}
//                   onChange={(e) => field.onChange(e.target.checked)}
//                 />
//               }
//               label={label}
//             />
//           )}
//         </>
//       )}
//     />
//   );
// };






"use client";

import React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RHFCheckboxProps {
  control: Control<FieldValues>;
  name: string;
  label: string;
  options?: string[];
  defaultValue?: boolean | string[];
}

export const RHFCheckboxValue: React.FC<RHFCheckboxProps> = ({
  control,
  name,
  label,
  options,
  defaultValue = false,
}) => {
  const isMulti = Array.isArray(options) && options.length > 0;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={isMulti ? [] : defaultValue}
      render={({ field, fieldState }) => (
        <div className="space-y-2">

          {isMulti ? (
            <>
              <p className="text-sm font-medium">{label}</p>

              {/* Horizontal Row */}
              <div className="flex flex-row flex-wrap gap-4">
                {options!.map((option) => {
                  const checked = Array.isArray(field.value)
                    ? field.value.includes(option)
                    : false;

                  const handleChange = (checked: boolean) => {
                    let newValue = Array.isArray(field.value)
                      ? [...field.value]
                      : [];

                    if (checked) {
                      newValue.push(option);
                    } else {
                      newValue = newValue.filter((v) => v !== option);
                    }

                    field.onChange(newValue);
                  };

                  return (
                    <div
                      key={option}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={handleChange}
                      />
                      <Label>{option}</Label>
                    </div>
                  );
                })}
              </div>

              {fieldState.error && (
                <p className="text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
              <Label>{label}</Label>
            </div>
          )}

        </div>
      )}
    />
  );
};