import fs from "fs";
import path from "path";
import { toPascalCaseText } from "./generate-list-file";

function toPascalCase(str: string) {
  return str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function mapTypeToMUIFieldType(type: string, specificControl: string) {
  // Map DB type to Material UI input type & props
  type = type.toUpperCase();
  if (specificControl === "MultiCheckbox") {
    return { component: "MultiCheckbox", typeProp: "number", multiline: false };
  }
  if (specificControl === "Radio") {
    return { component: "Radio", typeProp: "number", multiline: false };
  }
  if (specificControl === "DropDown") {
    return { component: "DropDown", typeProp: "number", multiline: false };
  }
  if (specificControl === "NormalDropDown") {
    return {
      component: "NormalDropDown",
      typeProp: "number",
      multiline: false,
    };
  }
  if (specificControl === "CustomDate") {
    return { component: "CustomDate", typeProp: "string", multiline: false };
  }
  if (specificControl === "WeekWeekendComponent") {
    return {
      component: "WeekWeekendComponent",
      typeProp: "string",
      multiline: false,
    };
  }

  if (type.includes("TIME")) {
    return { component: "CustomTime", typeProp: "string", multiline: false };
  }
  if (specificControl === "File") {
    return { component: "File", typeProp: "string", multiline: false };
  }
  if (specificControl === "RichTextPicker") {
    return {
      component: "RichTextPicker",
      typeProp: "string",
      multiline: false,
    };
  }
  if (type.includes("INT") || type === "INTEGER" || type === "NUMBER") {
    return { component: "TextField", typeProp: "number", multiline: false };
  }
  if (type === "BOOLEAN") {
    return { component: "Checkbox", typeProp: "checkbox", multiline: false };
  }
  if (type.includes("TIMESTAMP") || type.includes("DATE")) {
    return {
      component: "CustomDate",
      typeProp: "datetime-local",
      multiline: false,
    };
  }
  if (type === "TEXT" || type.includes("CHAR") || type === "VARCHAR") {
    return { component: "TextField", typeProp: "text", multiline: false };
  }
  // default fallback
  return { component: "TextField", typeProp: "text", multiline: false };
}

interface Field {
  name: string;
  type: string;
  nullable?: boolean;
  primaryKey?: boolean;
  toShowOnLayout:boolean;
  specificControl:string;
}

export function generateMainComponentFile(
  moduleName: string,
  tableName: string,
  fields: Field[],
  isChildPage: boolean,
  mainTable: string
) {
  const folderPath = path.join(
    process.cwd(),
    "app",
    "components",
    moduleName.replaceAll("_", "-"),
    tableName.replaceAll("_", "-")
  );
  const filePath = path.join(folderPath, "main.tsx");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  if (fs.existsSync(filePath)) {
    console.log(
      `main.tsx already exists for ${moduleName}/${tableName}, skipping.`
    );
    return;
  }

  // const interfaceName = toPascalCase(tableName) + "Entity";

  // Generate form fields jsx based on fields
  // skip id field usually
  const formFields = fields
    .filter(
      (f) => f.name !== "id" && f.toShowOnLayout && f.name !== "is_active"
    )
    .map((f) => {
      const { component, typeProp, multiline } = mapTypeToMUIFieldType(
        f.type,
        f.specificControl
      );
      const label = f.name
        .split("_")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

if (component === "Checkbox") {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFCheckbox
            control={control}
            name="${f.name}"
            label="${label}"
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set ${f.name} ${label}"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "MultiCheckbox") {
  return `
    <div className="col-span-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RHFMultiCheckboxAutocomplete
            control={control}
            name="${f.name}"
            options={${f.name}.map((op) => {
              return {
                value: op.id,
                label: op.name,
              };
            })}
            label="Select ${label}"
            withSelectAll={true}
          />
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["${f.name}"]}
          onClick={() =>
            handleRefresh("${f.name}", handleDropDown)
          }
        />*/}
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "Radio") {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFRadioGroup
            control={control}
            name="${f.name}"
            options={[
              { value: 0, label: "${label} 1", color: "secondary" },
              { value: 1, label: "${label} 2", color: "secondary" },
            ]}
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "DropDown") {
  return `
    <div className="col-span-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RHFAutocomplete
            control={control}
            name="${f.name}"
            label="Select ${label}"
            placeholder="Select ${label}"
            options={${f.name}.map((op) => {
              return {
                ddlId: Number(op.id),
                label: op.name,
              };
            })}
          />
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["${f.name}"]}
          onClick={() =>
            handleRefresh("${f.name}", handleDropDown)
          }
        />*/}
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "NormalDropDown") {
  return `
    <div className="col-span-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RHFSelect
            name="${f.name}"
            label="${label}"
            control={control}
            errors={errors}
            options={${f.name}.map((op) => {
              return {
                value: Number(op.id),
                label: op.name,
              };
            })}
          />
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["${f.name}"]}
          onClick={() =>
            handleRefresh("${f.name}", handleDropDown)
          }
        />*/}
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "CustomDate") {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFDatePicker
            control={control}
            name="${f.name}"
            label="${label} Date"
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "RichTextPicker") {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFRichText
            control={control}
            name="${f.name}"
            label="${label}"
            placeholder="Enter ${label} here"
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "File") {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFFileUpload
            control={control}
            setValue={setValue}
            name="${f.name}"
            nameDisplay="${f.name}Logo"
            label="Upload ${label}"
            error={errors.${f.name}?.message}
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "CustomTime") {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFTimePicker
            control={control}
            name="${f.name}"
            label="${label}"
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else if (component === "WeekWeekendComponent") {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFWeekdaysCheckbox
            name="${f.name}"
            control={control}
            errors={errors}
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
} else {
  return `
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFTextField
            name="${f.name}"
            label="${label}"
            control={control}
            errors={errors}
          />
        </div>
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>`;
}
    })
    .join("\n");

  const dropdownFields = fields.filter(
    (f) =>
      f.specificControl === "MultiCheckbox" ||
      f.specificControl === "NormalDropDown" ||
      f.specificControl === "DropDown"
  );

  const stateReturn = dropdownFields.map((f) => `${f.name},`).join("\n ");

//   const content = `

// "use client";

// import React from "react";
// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   Stack,
//   TextField,
//   useTheme,
//   FormControlLabel,
//   Checkbox,
//   Typography,
//   FormControl,
//   RadioGroup,
//   Radio,
//   Autocomplete,
//   FormHelperText
// } from "@mui/material";
// import { Controller } from "react-hook-form";

// import ChildCard from "@/app/components/shared/ChildCard";
// import PageContainer from "@/app/components/container/PageContainer";
// import { useService } from "./use-service";
// import { Toaster } from "sonner";
// import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
// import List from "./list";
// import MultiCheckboxAutocomplete from "@/app/components/utils/MultipleCheckBox";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import CustomTextField from "../../forms/theme-elements/CustomTextField";
// import HtmlViewer from "@/app/components/shared/html-viewer/html-viewer";
// import dynamic from "next/dist/shared/lib/dynamic";
// import dayjs from "dayjs";
// import { TimePicker } from "@mui/x-date-pickers";
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
// import Link from "next/link";
// import LoadingButton from "@/app/components/loaders/ButtonLoader";
// import TableSkeletonLoader from "@/app/components/loaders/TableSkeletonLoader";
// import LabelWithTooltip from "@/app/components/utils/controls/tool-tip";
// import SpinningRefreshIcon from "@/app/components/mui-icons/drop-down-refresh-icon";

 

// const Main = ({ module }: { module: ModuleDetailsString }) => {
//   const theme = useTheme();
//   const borderColor = theme.palette.divider;

//   const {
//     state: {  register, list, editId, modal,setList, btnLoading, pageLoading,page, rowsPerPage, setPage, setRowsPerPage, totalRecordObj, sortBy, setSortBy, order, setOrder, dropDownloading,
//       setDropDownloading,${stateReturn}},
//     form: {handleSubmit, errors, onSubmit, control, setValue},
//     actions: {
//       handleDelete,
//       handleStatusChange,
//       handleClear,
//       handleEdit,
//       closeModal,
//       openModal,
//       handleView,
//       handleOnListToggle, 
//       handleRefresh,
//       handleDropDown,
//     },
//   } = useService(module);

//   // if (pageLoading && !module.isListView && !module.isNew) {
//   //   return <TableSkeletonLoader />;
//   // }

//   return (
//     <>
//       <Toaster richColors position="bottom-center" />
//  {!module.isListView && (
//       <Grid item xs={12} sm={3}>
//         <ChildCard title="Title for ${mainTable}">
//           <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <Stack direction="row" justifyContent="flex-end" spacing={2} mb={2}> 
//             <Link
//               href={${
//                 isChildPage
//                   ? `\`/apps/${moduleName
//                       .toLowerCase()
//                       .replaceAll("_", "-")}/${mainTable
//                       .toLowerCase()
//                       .replaceAll(
//                         "_",
//                         "-"
//                       )}/\${module.mainServiceId}/${tableName
//                       .toLowerCase()
//                       .replaceAll("_", "-")}/list\``
//                   : `\`/apps/${moduleName
//                       .toLowerCase()
//                       .replaceAll("_", "-")}/${tableName
//                       .toLowerCase()
//                       .replaceAll("_", "-")}/list\``
//               }}
//               passHref
//               legacyBehavior
//             >
//               <Button variant="outlined"
//                         color="inherit"
//                         component="a"
//                         sx={{ minWidth: 150 }}>
//                 Back to List
//               </Button>
//             </Link>
//           </Stack>

//             <Stack spacing={2}
//                 sx={{
//                   width: "100%",
//                   mr: "auto", 
//                 }} >
//               <PageContainer>
//                 <Paper
//                   sx={{ border: \`1px solid \${borderColor}\`, p: 2 }}
//                   variant="outlined"
//                 >
//                   <Box mt="-10px" mb={3}>
//                     <Grid container spacing={2}>
//                       ${formFields}
//                     </Grid>
//                   </Box>
//                 </Paper>
//               </PageContainer>

//               <Stack direction="row" justifyContent="flex-end" spacing={2}>
//                 <Box>
//                     <LoadingButton type="submit" loading={btnLoading} fullWidth>
//                       {editId ? "Save Changes" : "Create"}
//                     </LoadingButton>
//                   </Box>
//               </Stack>
//             </Stack>
//           </form>
//         </ChildCard>
//       </Grid>
//    )}
      
//     {module.isListView && (
//         <List
//           rows={list}
//           onDelete={handleDelete}
//           onStatus={handleStatusChange}
//           onView={handleView}
//           module={module}
//           onListToggle={handleOnListToggle}
//           setList={setList}
//           customPage={page}
//           customRowsPerPage={rowsPerPage}
//           customSetPage={setPage}
//           customSetRowsPerPage={setRowsPerPage}
//           customTotalRecordObj={totalRecordObj!}
//           customSortBy={sortBy}
//           customSetSortBy={setSortBy}
//           customOrder={order}
//           customSetOrder={setOrder}
//           pageLoading={pageLoading}
//         />
//       )}

//     </>
//   );
// };

// export default Main;

// `;

const content = `

"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button"; // ✅ ShadCN Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ✅ ShadCN Card

import ChildCard from "@/app/components/shared/ChildCard";
import PageContainer from "@/app/components/container/PageContainer";
import { useService } from "./use-service";
// import { Toaster } from "sonner";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import List from "./list";

import { RHFTimePicker } from "@/app/components/utils/controls/time-picker";
import RHFMultiCheckboxAutocomplete from "@/app/components/utils/controls/multiple-check-box";
import { RHFCheckbox } from "@/app/components/utils/controls/check-box";
import { RHFRadioGroup } from "../../utils/controls/radio-group";
import { RHFAutocomplete } from "@/app/components/utils/controls/auto-complete-drop-down";
import { RHFDatePicker } from "@/app/components/utils/controls/date-picker";
import { RHFRichText } from "@/app/components/utils/controls/rich-text";
import { RHFFileUpload } from "@/app/components/utils/controls/file-upload";
import { RHFTextField } from "@/app/components/utils/controls/text-field";
import { RHFSelect } from "@/app/components/utils/controls/select-normal";
import { ArrowLeft } from "lucide-react"
import Link from "next/link";
import TableSkeletonLoader from "@/app/components/loaders/TableSkeletonLoader";
import LabelWithTooltip from "@/app/components/utils/controls/tool-tip";
import SpinningRefreshIcon from "@/app/components/mui-icons/drop-down-refresh-icon";

const Main = ({ module }: { module: ModuleDetailsString }) => {

  const {
    state: { register, list, editId, modal, setList, btnLoading, pageLoading, page, rowsPerPage, setPage, setRowsPerPage, totalRecordObj, sortBy, setSortBy, order, setOrder, dropDownloading,
      setDropDownloading, ${stateReturn}},
    form: { handleSubmit, errors, onSubmit, control, setValue },
    actions: {
      handleDelete,
      handleStatusChange,
      handleClear,
      handleEdit,
      closeModal,
      openModal,
      handleView,
      handleOnListToggle,
      handleRefresh,
      handleDropDown,
    },
  } = useService(module);

    const dropOptions = [
  { value: 1, label: "Option 1" },
  { value: 2, label: "Option 2" },
  { value: 3, label: "Option 3" },
];

  return (
    <>

      {!module.isListView && (
        <div className="w-full">
<form
  onSubmit={handleSubmit(onSubmit)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.requestSubmit()
    }
  }}
  noValidate
>
              {/* ✅ Back Button Section (replaced Stack + Button + sx) */}
              <div className="flex justify-end mb-4">
                <Link
                  href={${
                    isChildPage
                      ? `\`/dashboard/${moduleName
                          .toLowerCase()
                          .replaceAll("_", "-")}/${mainTable
                          .toLowerCase()
                          .replaceAll("_", "-")}/\${module.mainServiceId}/${tableName
                          .toLowerCase()
                          .replaceAll("_", "-")}/list\``
                      : `\`/dashboard/${moduleName
                          .toLowerCase()
                          .replaceAll("_", "-")}/${tableName
                          .toLowerCase()
                          .replaceAll("_", "-")}/list\``
                  }}
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4"
                  >
                    <ArrowLeft size={16} />
                    Back to List
                  </Button>
                </Link>
              </div>

              <div className="space-y-6">

                <PageContainer>
                  {/* ✅ Replaced Paper with ShadCN Card */}
                     <CardContent className="p-6">

                      {/* ✅ Replaced Grid container with Tailwind grid */}
                      <div className="grid grid-cols-1 gap-4">
                        ${formFields}
                      </div>

                    </CardContent>
                </PageContainer>

                {/* ✅ Submit Button Section (replaced Stack + LoadingButton) */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={btnLoading}>
                    {editId ? "Save Changes" : "Create"}
                  </Button>
                </div>

              </div>
            </form>
         </div>
      )}

      {module.isListView && (
        <List
          rows={list}
          onDelete={handleDelete}
          onStatus={handleStatusChange}
          onView={handleView}
          module={module}
          onListToggle={handleOnListToggle}
          setList={setList}
          customPage={page}
          customRowsPerPage={rowsPerPage}
          customSetPage={setPage}
          customSetRowsPerPage={setRowsPerPage}
          customTotalRecordObj={totalRecordObj!}
          customSortBy={sortBy}
          customSetSortBy={setSortBy}
          customOrder={order}
          customSetOrder={setOrder}
          pageLoading={pageLoading}
        />
      )}
    </>
  );
};

export default Main;

`;

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim(), "utf8");
    console.log(`✅ Generated main.tsx for ${moduleName}/${tableName}`);
  } else {
    console.log(`⏭️ Skipped ${filePath} (already exists)`);
  }
}
