// "use client";

// import React from "react";
// import { Controller, Control } from "react-hook-form";
// import {
//   Checkbox,
//   FormControlLabel,
//   Typography,
//   FormGroup,
//   FormHelperText,
// } from "@mui/material";

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface RHFCheckboxProps {
//   control: Control<any>;
//   name: string;
//   label: string;
//   options?: (string | Option)[]; // support both string[] or object[]
//   defaultValue?: boolean | (string | number)[];
// }

// export const RHFCheckboxValueDefault: React.FC<RHFCheckboxProps> = ({
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
//             <FormGroup>
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                 {label}
//               </Typography>

//               {options!.map((opt) => {
//                 const option =
//                   typeof opt === "string" ? { value: opt, label: opt } : opt;

//                 const checked = Array.isArray(field.value)
//                   ? field.value.includes(option.value)
//                   : false;

//                 const handleChange = (
//                   event: React.ChangeEvent<HTMLInputElement>
//                 ) => {
//                   const value = option.value;
//                   let newValue = Array.isArray(field.value)
//                     ? [...field.value]
//                     : [];

//                   if (event.target.checked) {
//                     newValue.push(value);
//                   } else {
//                     newValue = newValue.filter((v) => v !== value);
//                   }

//                   field.onChange(newValue);
//                 };

//                 return (
//                   <FormControlLabel
//                     key={option.value}
//                     control={
//                       <Checkbox
//                         checked={checked}
//                         onChange={handleChange}
//                         value={option.value}
//                       />
//                     }
//                     label={option.label}
//                   />
//                 );
//               })}

//               {fieldState.error && (
//                 <FormHelperText error>
//                   {fieldState.error.message}
//                 </FormHelperText>
//               )}
//             </FormGroup>
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

interface Option {
  value: string | number;
  label: string;
}

interface RHFCheckboxProps {
  control: Control<FieldValues>;
  name: string;
  label: string;
  options?: (string | Option)[];
  defaultValue?: boolean | (string | number)[];
}

export const RHFCheckboxValueDefault: React.FC<RHFCheckboxProps> = ({
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

              <div className="space-y-2">
                {options!.map((opt) => {
                  const option =
                    typeof opt === "string" ? { value: opt, label: opt } : opt;

                  const checked = Array.isArray(field.value)
                    ? field.value.includes(option.value)
                    : false;

                  const handleChange = (checked: boolean) => {
                    const value = option.value;

                    let newValue = Array.isArray(field.value)
                      ? [...field.value]
                      : [];

                    if (checked) {
                      newValue.push(value);
                    } else {
                      newValue = newValue.filter((v) => v !== value);
                    }

                    field.onChange(newValue);
                  };

                  return (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={handleChange}
                      />
                      <Label>{option.label}</Label>
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