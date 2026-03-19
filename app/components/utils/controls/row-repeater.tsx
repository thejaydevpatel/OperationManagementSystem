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

// interface FieldConfig {
//   name: string;
//   label: string;
//   type?:
//     | "text"
//     | "date"
//     | "checkbox"
//     | "muli-checkbox"
//     | "radio"
//     | "drop-down"
//     | "normal-drop-down"
//     | "custom-date"
//     | "file"
//     | "custom-time"
//     | "week-weekend-component"
//     | "rich-text-picker"
//     | "number";
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
// }

// export default function SharedRepeater({
//   control,
//   errors,
//   setValue,
//   name,
//   fieldsConfig,
//   defaultRow = {},
// }: SharedRepeaterProps) {
//   const { fields, append, remove } = useFieldArray<RowData>({
//     control,
//     name,
//   });

//   useEffect(() => {
//     // debugger;
//     // if (fields.length === 0) {
//     //   append(defaultRow);
//     // }
//   }, [append, fields.length, defaultRow]);

//   return (
//     <Grid container spacing={2} paddingTop={5}>
//       {fields.map((field, index) => (
//         <Grid container item spacing={2} key={field.id} alignItems="center">
//           {fieldsConfig.map((f) => (
//             <Grid item xs={f.type === "date" ? 3 : 3} key={f.name}>
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
//                         options={[
//                           { value: 1, label: "Sample Multi Check Box" },
//                           { value: 2, label: "Sample 2 Multi Check Box" },
//                         ]}
//                         label={f.label}
//                         withSelectAll={true}
//                       />
//                     );
//                   case "radio":
//                     return (
//                       <RHFRadioGroup
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         options={[
//                           {
//                             value: 0,
//                             label: "None",
//                             color: "primary",
//                           },
//                           {
//                             value: 1,
//                             label: "Radio 1",
//                             color: "primary",
//                           },
//                           {
//                             value: 2,
//                             label: "Radio 2",
//                             color: "secondary",
//                           },
//                         ]}
//                       />
//                     );
//                   case "drop-down":
//                     return (
//                       <RHFAutocomplete
//                         control={control}
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                         placeholder="Select Auto Complete Drop Down"
//                         options={[
//                           { ddlId: 1, label: "1 Option" },
//                           { ddlId: 2, label: "2 Option" },
//                         ]}
//                       />
//                     );
//                   case "normal-drop-down":
//                     return (
//                       <RHFSelect
//                         name={`${name}.${index}.${f.name}`}
//                         label={f.label}
//                         control={control}
//                         errors={errors}
//                         options={[
//                           { value: 2020, label: "2020" },
//                           { value: 2021, label: "2021" },
//                           { value: 2022, label: "2022" },
//                         ]}
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
//                         // error={errors.logo?.message}
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
//                 variant="contained"
//                 sx={{ ml: 1 }} // spacing between buttons
//                 onClick={() => append(defaultRow)}
//               >
//                 Add Row
//               </Button>
//             )}
//           </Grid>
//         </Grid>
//       ))}

//       {fields.length === 0 && (
//         <Button
//           variant="contained"
//           sx={{ ml: 1 }} // spacing between buttons
//           onClick={() => append(defaultRow)}
//         >
//           Add Row
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

interface FieldConfig {
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
}

export default function SharedRepeater({
  control,
  errors,
  setValue,
  name,
  fieldsConfig,
  defaultRow = {},
}: SharedRepeaterProps) {

  const { fields, append, remove } = useFieldArray<RowData>({
    control,
    name,
  })

  useEffect(() => {
    // optional initial row
  }, [append, fields.length, defaultRow])

  return (
    <div className="space-y-4 pt-5">

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-12 gap-4 items-center"
        >

          {fieldsConfig.map((f) => (
            <div key={f.name} className="col-span-12 md:col-span-3">

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
                        options={[
                          { value: 1, label: "Sample Multi Check Box" },
                          { value: 2, label: "Sample 2 Multi Check Box" },
                        ]}
                        label={f.label}
                        withSelectAll
                      />
                    )

                  case "radio":
                    return (
                      <RHFRadioGroup
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        options={[
                          { value: 0, label: "None", color: "primary" },
                          { value: 1, label: "Radio 1", color: "primary" },
                          { value: 2, label: "Radio 2", color: "secondary" },
                        ]}
                      />
                    )

                  case "drop-down":
                    return (
                      <RHFAutocomplete
                        control={control}
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                        placeholder="Select Auto Complete Drop Down"
                        options={[
                          { ddlId: 1, label: "1 Option" },
                          { ddlId: 2, label: "2 Option" },
                        ]}
                      />
                    )

                  case "normal-drop-down":
                    return (
                      <RHFSelect
                        name={`${name}.${index}.${f.name}`}
                        label={f.label}
                        control={control}
                        errors={errors}
                        options={[
                          { value: 2020, label: "2020" },
                          { value: 2021, label: "2021" },
                          { value: 2022, label: "2022" },
                        ]}
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
                onClick={() => append(defaultRow)}
              >
                Add Row
              </Button>
            )}

          </div>

        </div>
      ))}

      {fields.length === 0 && (
        <Button
          onClick={() => append(defaultRow)}
        >
          Add Row
        </Button>
      )}

    </div>
  )
}