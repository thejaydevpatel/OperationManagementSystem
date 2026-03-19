// "use client";

// import { Controller, Control } from "react-hook-form";
// import "react-quill/dist/quill.snow.css";
// import { Typography } from "@mui/material";
// import dynamic from "next/dynamic";

// interface RHFRichTextProps {
//   control: Control<any>;
//   name: string;
//   placeholder?: string;
//   label?: string;
// }
// const ReactQuill: any = dynamic(
//   async () => {
//     const { default: RQ } = await import("react-quill");
//     // eslint-disable-next-line react/display-name
//     return ({ ...props }) => <RQ {...props} />;
//   },
//   {
//     ssr: false,
//   }
// );

// export const RHFRichText: React.FC<RHFRichTextProps> = ({
//   control,
//   name,
//   placeholder = "Enter text here...",
//   label,
// }) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <div>
//           {label && (
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               {label}
//             </Typography>
//           )}

//           <ReactQuill
//             theme="snow"
//             value={field.value || ""}
//             onChange={field.onChange}
//             onBlur={field.onBlur}
//             placeholder={placeholder}
//             style={{ minHeight: "200px" }}
//             className="custom-quill"
//           />

//           {fieldState.error && (
//             <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//               {fieldState.error.message}
//             </Typography>
//           )}
//         </div>
//       )}
//     />
//   );
// };
"use client";

import { Controller, Control } from "react-hook-form";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface RHFRichTextProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  label?: string;
}

const ReactQuill: any = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

export const RHFRichText: React.FC<RHFRichTextProps> = ({
  control,
  name,
  placeholder = "Enter text here...",
  label,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          {label && (
            <p className="text-sm font-medium">
              {label}
            </p>
          )}

          <ReactQuill
            theme="snow"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            className="min-h-[200px]"
          />

          {fieldState.error && (
            <p className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};