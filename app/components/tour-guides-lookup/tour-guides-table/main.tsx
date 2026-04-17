"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button"; // ✅ ShadCN Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ✅ ShadCN Card
import { useFieldArray } from "react-hook-form";
import { useEffect } from "react";
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
      setDropDownloading, language_id,
 supplier_id,
 guide_status_id,},
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

  type FormValues = {
  name: string;
  phone: string;
  supplier_id?: number;
  guide_status_id: number;
  notes?: string;

  languages: {
    language_id: number;
    name: string;
    price: number;
  }[];
};

type LanguageField = {
  language_id: number;
  name: string;
  price: number;
};

const { fields, replace } = useFieldArray<FormValues, "languages">({
  control,
  name: "languages",
});

    const dropOptions = [
  { value: 1, label: "Option 1" },
  { value: 2, label: "Option 2" },
  { value: 3, label: "Option 3" },
];

useEffect(() => {
  if (language_id.length === 0) return;

  const existing = (control._formValues?.languages || []) as any[];

  const formatted = language_id.map((lang) => {
    const found = existing.find(
      (l) => l.language_id === lang.id
    );

    return {
      language_id: lang.id,
      name: lang.name,
      price: found?.price || 0,
    };
  });

  replace(formatted);
}, [language_id, editId]);

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
                  href={`/dashboard/tour-guides-lookup/tour-guides-table/list`}
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
                        
    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFTextField
            name="name"
            label="Name"
            control={control}
            errors={errors}
          />
        </div> 
      </div>
    </div>

    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFTextField
            name="phone"
            label="Phone"
            control={control}
            errors={errors}
          />
        </div> 
      </div>
    </div>
 

    <div className="col-span-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RHFSelect
            name="supplier_id"
            label="Supplier Id"
            control={control}
            errors={errors}
            options={supplier_id.map((op) => {
              return {
                value: Number(op.id),
                label: op.name,
              };
            })}
          />
        </div> 
      </div>
    </div>

    <div className="col-span-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RHFSelect
            name="guide_status_id"
            label="Guide Status Id"
            control={control}
            errors={errors}
            options={guide_status_id.map((op) => {
              return {
                value: Number(op.id),
                label: op.name,
              };
            })}
          />
        </div> 
      </div>
    </div>

    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFTextField
            name="notes"
            label="Notes"
            control={control}
            errors={errors}
          />
        </div> 
      </div>
    </div>
                      </div>

                    </CardContent>
                </PageContainer>
<div className="mt-6">
  <Card>
    <CardHeader>
      <CardTitle>Guide Languages & Prices</CardTitle>
    </CardHeader>

    <CardContent>
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Language</th>
            <th className="text-left p-2">Price</th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field, index) => (
<tr key={field.id} className="border-b">
  <td className="p-2">{field.name}</td>

  <td className="p-2">
    <input
      type="number"
      {...register(`languages.${index}.price`)}
      defaultValue={field.price || 0}
      className="border px-2 py-1 w-32"
    />
  </td>
</tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
</div>
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