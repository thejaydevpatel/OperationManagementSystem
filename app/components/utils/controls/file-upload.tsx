// "use client";

// import { Controller, Control, UseFormSetValue } from "react-hook-form";
// import { Button, Stack } from "@mui/material";
// import CustomTextField from "../../forms/theme-elements/CustomTextField";

// interface RHFFileUploadProps {
//   control: Control<any>;
//   setValue: UseFormSetValue<any>;
//   name: string; // field for file object
//   nameDisplay: string; // field for file name display
//   label?: string;
//   accept?: string;
//   error?: string;
// }

// export const RHFFileUpload: React.FC<RHFFileUploadProps> = ({
//   control,
//   setValue,
//   name,
//   nameDisplay,
//   label = "Upload",
//   accept = "image/*",
//   error,
// }) => {
//   return (
//     <Stack direction="row" gap={1} alignItems="center">
//       <Button
//         color="primary"
//         variant="contained"
//         component="label"
//         sx={{ height: "45px", width: "35%" }}
//       >
//         {label}
//         <input
//           hidden
//           type="file"
//           accept={accept}
//           onChange={(event) => {
//             const file = event.target.files?.[0];

//             if (file) {
//               // set file + filename when selected
//               setValue(name, file, { shouldValidate: true, shouldDirty: true });
//               setValue(nameDisplay, file.name);
//             } else {
//               // clear value when no file chosen (important for "required" validation)
//               setValue(name, null, { shouldValidate: true, shouldDirty: true });
//               setValue(nameDisplay, "");
//             }
//           }}
//         />
//       </Button>

//       <Controller
//         name={nameDisplay}
//         control={control}
//         defaultValue=""
//         render={({ field }) => (
//           <CustomTextField
//             fullWidth
//             label="Selected File"
//             {...field}
//             disabled
//             error={!!error}
//             helperText={error}
//           />
//         )}
//       />
//     </Stack>
//   );
// };





"use client";

import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RHFFileUploadProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  name: string;
  nameDisplay: string;
  label?: string;
  accept?: string;
  error?: string;
}

export const RHFFileUpload: React.FC<RHFFileUploadProps> = ({
  control,
  setValue,
  name,
  nameDisplay,
  label = "Upload",
  accept = "image/*",
  error,
}) => {
  return (
    <div className="flex items-center gap-2 w-full">

      {/* Upload Button */}
      <Button
        type="button"
        className="h-[45px] w-[35%]"
        asChild
      >
        <label>
          {label}
          <input
            hidden
            type="file"
            accept={accept}
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                setValue(name, file, {
                  shouldValidate: true,
                  shouldDirty: true,
                });

                setValue(nameDisplay, file.name);
              } else {
                setValue(name, null, {
                  shouldValidate: true,
                  shouldDirty: true,
                });

                setValue(nameDisplay, "");
              }
            }}
          />
        </label>
      </Button>

      {/* File Name Display */}
      <Controller
        name={nameDisplay}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div className="w-full">
            <Input
              {...field}
              disabled
              placeholder="Selected File"
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>
        )}
      />

    </div>
  );
};