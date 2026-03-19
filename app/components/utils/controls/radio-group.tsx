// "use client";

// import { Controller, Control } from "react-hook-form";
// import {
//   RadioGroup,
//   Radio,
//   FormControlLabel,
//   FormControl,
//   FormHelperText,
//   FormLabel,
// } from "@mui/material";

// interface RadioOption {
//   value: number;
//   label: string;
//   color?: "primary" | "secondary" | "error" | "default";
// }

// interface RHFRadioGroupProps {
//   control: Control<any>;
//   name: string;
//   label?: string;
//   options: RadioOption[];
//   row?: boolean;
//   defaultValue?: string;
// }

// export const RHFRadioGroup: React.FC<RHFRadioGroupProps> = ({
//   control,
//   name,
//   label,
//   options,
//   row = true,
//   defaultValue,
// }) => {
//   return (
//     <FormControl>
//       {label && <FormLabel sx={{ mb: 1, fontWeight: 600 }}>{label}</FormLabel>}

//       <Controller
//         name={name}
//         control={control}
//         defaultValue={defaultValue}
//         render={({ field, fieldState }) => (
//           <>
//             <RadioGroup
//               row={row}
//               {...field}
//               value={String(field.value)}
//               onChange={(e) => field.onChange(Number(e.target.value))}
//             >
//               {options.map((option) => (
//                 <FormControlLabel
//                   key={option.value}
//                   value={String(option.value)}
//                   control={
//                     <Radio
//                       sx={{
//                         color: `${option.color || "primary"}.main`,
//                         "&.Mui-checked": {
//                           color: `${option.color || "primary"}.main`,
//                         },
//                       }}
//                     />
//                   }
//                   label={option.label}
//                 />
//               ))}
//             </RadioGroup>

//             {fieldState.error && (
//               <FormHelperText error>{fieldState.error.message}</FormHelperText>
//             )}
//           </>
//         )}
//       />
//     </FormControl>
//   );
// };







"use client";

import { Controller, Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
value: number;
label: string;
color?: "primary" | "secondary" | "default";
}

interface RHFRadioGroupProps {
control: Control<any>;
name: string;
label?: string;
options: RadioOption[];
row?: boolean;
defaultValue?: number;
}

export const RHFRadioGroup: React.FC<RHFRadioGroupProps> = ({
control,
name,
label,
options,
row = true,
defaultValue,
}) => {
const getColorClass = (color?: string) => {
switch (color) {
case "primary":
return "text-blue-600";
case "secondary":
return "text-purple-600";
default:
return "text-gray-700";
}
};

return (
<Controller
name={name}
control={control}
defaultValue={defaultValue}
render={({ field, fieldState }) => ( <div className="flex flex-col gap-2">

      {label && (
        <Label className="font-semibold">
          {label}
        </Label>
      )}

      <RadioGroup
        value={String(field.value)}
        onValueChange={(val) => field.onChange(Number(val))}
        className={row ? "flex flex-row gap-4" : "flex flex-col gap-2"}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2"
          >
            <RadioGroupItem
              value={String(option.value)}
              id={`${name}-${option.value}`}
            />

            <Label
              htmlFor={`${name}-${option.value}`}
              className={getColorClass(option.color)}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

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
