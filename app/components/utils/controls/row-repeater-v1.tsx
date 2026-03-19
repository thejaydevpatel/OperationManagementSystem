// import { useEffect } from "react";
// import {
//   useFieldArray,
//   Control,
//   FieldErrors,
//   UseFormSetValue,
// } from "react-hook-form";
// import { Button, Grid } from "@mui/material";
// import { RHFTimePicker } from "@/app/components/utils/controls/time-picker";
// import RHFMultiCheckboxAutocomplete from "@/app/components/utils/controls/multiple-check-box";
// import { RHFCheckbox } from "@/app/components/utils/controls/check-box";
// import { RHFRadioGroup } from "../../utils/controls/radio-group";
// import { RHFAutocomplete } from "@/app/components/utils/controls/auto-complete-drop-down";
// import { RHFDatePicker } from "@/app/components/utils/controls/date-picker";
// import { RHFRichText } from "@/app/components/utils/controls/rich-text";
// import { RHFFileUpload } from "@/app/components/utils/controls/file-upload";
// import { RHFTextField } from "@/app/components/utils/controls/text-field";
// import { RHFSelect } from "@/app/components/utils/controls/select-normal";
// import RHFWeekdaysCheckbox from "@/app/components/utils/controls/weekdays-checkbox";
// import AddIcon from "@mui/icons-material/Add"; // import the icon

// // Generic option type
// interface FieldOption<T = any> {
//   value: T;
//   label: string;
//   [key: string]: any;
// }

// interface FieldConfig<T = any> {
//   name: string;
//   label: string;
//   type?:
//   | "text"
//   | "date"
//   | "checkbox"
//   | "muli-checkbox"
//   | "radio"
//   | "drop-down"
//   | "normal-drop-down"
//   | "custom-date"
//   | "file"
//   | "custom-time"
//   | "week-weekend-component"
//   | "rich-text-picker"
//   | "number";
//   options?: FieldOption<T>[]; // dynamic options
//   defaultValue?: T; // default value
// }

// interface RowData {
//   id?: string;
//   [key: string]: any;
// }

// interface SharedRepeaterProps {
//   control: Control<any>;
//   errors: FieldErrors<any>;
//   setValue: UseFormSetValue<any>;
//   name: string;
//   fieldsConfig: FieldConfig[];
//   defaultRow?: RowData;
//   addText?: string;
// }

// export default function SharedRepeater({
//   control,
//   errors,
//   setValue,
//   name,
//   fieldsConfig,
//   defaultRow = {},
//   addText = "Add Row",
// }: SharedRepeaterProps) {
//   const { fields, append, remove } = useFieldArray<RowData>({
//     control,
//     name,
//   });

//   // Build default row dynamically from fieldsConfig
//   const buildDefaultRow = () =>
//     fieldsConfig.reduce(
//       (acc, cur) => ({
//         ...acc,
//         [cur.name]: cur.defaultValue ?? "",
//       }),
//       {}
//     );

//   useEffect(() => {
//     // Uncomment if you want to auto-append first row
//     // if (fields.length === 0) {
//     //   append(buildDefaultRow());
//     // }
//   }, [append, fields.length]);

//   return (
//     <Grid container spacing={2} paddingTop={5}>
//       {fields.map((field, index) => (
//         <Grid container item spacing={2} key={field.id} alignItems="center">
//           {fieldsConfig.map((f) => (
//             <Grid item xs={3} key={f.name}>
//               {(() => {
//                 switch (f.type) {
//                   case "checkbox":
//                     return (
//                       <RHFCheckbox
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                       />
//                     );
//                   case "muli-checkbox":
//                     return (
//                       <RHFMultiCheckboxAutocomplete
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         options={f.options ?? []}
//                         label={f.label}
//                         withSelectAll
//                       />
//                     );
//                   case "radio":
//                     return (
//                       <RHFRadioGroup
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         options={f.options ?? []}
//                       />
//                     );
//                   case "drop-down":
//                     return (
//                       <RHFAutocomplete
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                         placeholder="Select option"
//                         options={
//                           f.options?.map((opt: any) => ({
//                             ddlId: opt.ddlId ?? opt.value,
//                             label: opt.label,
//                           })) ?? []
//                         }
//                       // defaultValue={f.defaultValue}
//                       />
//                     );
//                   case "normal-drop-down":
//                     return (
//                       <RHFSelect
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                         control={control}
//                         errors={errors}
//                         options={f.options ?? []}
//                       // defaultValue={f.defaultValue}
//                       />
//                     );
//                   case "date":
//                     return (
//                       <RHFDatePicker
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                       />
//                     );
//                   case "rich-text-picker":
//                     return (
//                       <RHFRichText
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                         placeholder="Enter Rich Text Picker here"
//                       />
//                     );
//                   case "file":
//                     return (
//                       <RHFFileUpload
//                         control={control}
//                         setValue={setValue}
//                         name={`${name}.${index}.${f.name}`}
//                         nameDisplay="logoLogo"
//                         label={f.label}
//                       />
//                     );
//                   case "custom-time":
//                     return (
//                       <RHFTimePicker
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                       />
//                     );
//                   case "week-weekend-component":
//                     return (
//                       <RHFWeekdaysCheckbox
//                         name={`${name}.${index}.${f.name}`}
//                         control={control}
//                         errors={errors}
//                       />
//                     );
//                   default:
//                     return (
//                       <RHFTextField
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                         errors={errors}
//                         type={f.type}
//                       />
//                     );
//                 }
//               })()}
//             </Grid>
//           ))}

//           <Grid item>
//             <Button color="error" onClick={() => remove(index)}>
//               Remove
//             </Button>

//             {fields.length === index + 1 && (
//               <Button
//                 color="secondary"
//                 variant="contained"
//                 sx={{ ml: 1 }}
//                 onClick={() => append(buildDefaultRow())}
//                 startIcon={<AddIcon />}
//               >
//                 {addText}
//               </Button>
//             )}
//           </Grid>
//         </Grid>
//       ))}

//       {fields.length === 0 && (
//         <Button
//           color="secondary"
//           variant="contained"
//           sx={{ ml: 1 }}
//           onClick={() => append(buildDefaultRow())}
//           startIcon={<AddIcon />}
//         >
//           {addText}
//         </Button>
//       )}
//     </Grid>
//   );
// }







"use client"

import { useEffect } from "react"
import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { RHFTimePicker } from "@/app/components/utils/controls/time-picker"
import RHFMultiCheckboxAutocomplete from "@/app/components/utils/controls/multiple-check-box"
import { RHFCheckbox } from "@/app/components/utils/controls/check-box"
import { RHFRadioGroup } from "../../utils/controls/radio-group"
import { RHFAutocomplete } from "@/app/components/utils/controls/auto-complete-drop-down"
import { RHFDatePicker } from "@/app/components/utils/controls/date-picker"
import { RHFRichText } from "@/app/components/utils/controls/rich-text"
import { RHFFileUpload } from "@/app/components/utils/controls/file-upload"
import { RHFTextField } from "@/app/components/utils/controls/text-field"
import { RHFSelect } from "@/app/components/utils/controls/select-normal"
import RHFWeekdaysCheckbox from "@/app/components/utils/controls/weekdays-checkbox"

interface FieldOption<T = any> {
  value: T
  label: string
  [key: string]: any
}

interface FieldConfig<T = any> {
  name: string
  label: string
  type?:
    | "text"
    | "date"
    | "checkbox"
    | "muli-checkbox"
    | "radio"
    | "drop-down"
    | "normal-drop-down"
    | "custom-date"
    | "file"
    | "custom-time"
    | "week-weekend-component"
    | "rich-text-picker"
    | "number"
  options?: FieldOption<T>[]
  defaultValue?: T
}

interface RowData {
  id?: string
  [key: string]: any
}

interface SharedRepeaterProps {
  control: Control<any>
  errors: FieldErrors<any>
  setValue: UseFormSetValue<any>
  name: string
  fieldsConfig: FieldConfig[]
  defaultRow?: RowData
  addText?: string
}

export default function SharedRepeater({
  control,
  errors,
  setValue,
  name,
  fieldsConfig,
  defaultRow = {},
  addText = "Add Row",
}: SharedRepeaterProps) {

  const { fields, append, remove } = useFieldArray<RowData>({
    control,
    name,
  })

  const buildDefaultRow = () =>
    fieldsConfig.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.name]: cur.defaultValue ?? "",
      }),
      {}
    )

  useEffect(() => {
    // optional auto append
  }, [append, fields.length])

  return (
    <div className="space-y-4 pt-5">

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-12 gap-4 items-center"
        >

          {fieldsConfig.map((f) => (
            <div key={f.name} className="col-span-3">

              {(() => {
                switch (f.type) {

                  case "checkbox":
                    return (
                      <RHFCheckbox
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                      />
                    )

                  case "muli-checkbox":
                    return (
                      <RHFMultiCheckboxAutocomplete
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        options={f.options ?? []}
                        label={f.label}
                        withSelectAll
                      />
                    )

                  case "radio":
                    return (
                      <RHFRadioGroup
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        options={f.options ?? []}
                      />
                    )

                  case "drop-down":
                    return (
                      <RHFAutocomplete
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                        placeholder="Select option"
                        options={
                          f.options?.map((opt: any) => ({
                            ddlId: opt.ddlId ?? opt.value,
                            label: opt.label,
                          })) ?? []
                        }
                      />
                    )

                  case "normal-drop-down":
                    return (
                      <RHFSelect
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                        control={control}
                        errors={errors}
                        options={f.options ?? []}
                      />
                    )

                  case "date":
                    return (
                      <RHFDatePicker
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                      />
                    )

                  case "rich-text-picker":
                    return (
                      <RHFRichText
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                        placeholder="Enter Rich Text Picker here"
                      />
                    )

                  case "file":
                    return (
                      <RHFFileUpload
                        control={control}
                        setValue={setValue}
                        name={`${name}.${index}.${f.name}`}
                        nameDisplay="logoLogo"
                        label={f.label}
                      />
                    )

                  case "custom-time":
                    return (
                      <RHFTimePicker
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                      />
                    )

                  case "week-weekend-component":
                    return (
                      <RHFWeekdaysCheckbox
                        name={`${name}.${index}.${f.name}`}
                        control={control}
                        errors={errors}
                      />
                    )

                  default:
                    return (
                      <RHFTextField
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                        errors={errors}
                        type={f.type}
                      />
                    )
                }
              })()}

            </div>
          ))}

          <div className="flex gap-2 col-span-12 md:col-span-3">

            <Button
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remove
            </Button>

            {fields.length === index + 1 && (
              <Button
                onClick={() => append(buildDefaultRow())}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                {addText}
              </Button>
            )}

          </div>

        </div>
      ))}

      {fields.length === 0 && (
        <Button
          onClick={() => append(buildDefaultRow())}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          {addText}
        </Button>
      )}

    </div>
  )
}