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
      setDropDownloading, guide_id,
 language_id,},
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

const [selectedLanguages, setSelectedLanguages] = React.useState<number[]>([]);

  return (
    <>

      {!module.isListView && (
        <div className="w-full">
<form
onSubmit={handleSubmit((data) => {
  // 🚨 ADD THIS CHECK
  if (!data.guide_id) {
    alert("Guide is required");
    return;
  }

  if (!data.language_id) {
    alert("Language is required");
    return;
  }

  if (!data.price) {
    alert("Price is required");
    return;
  }

  setSelectedLanguages((prev) =>
    prev.includes(data.language_id)
      ? prev
      : [...prev, data.language_id]
  );

  onSubmit(data);
})}
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
                  href={`/dashboard/lookup/guide-language-price/list`}
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
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RHFSelect
            name="guide_id"
            label="Guide Id"
            control={control}
            errors={errors}
            options={guide_id.map((op) => {
              return {
                value: Number(op.id),
                label: op.name,
              };
            })}
          />
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["guide_id"]}
          onClick={() =>
            handleRefresh("guide_id", handleDropDown)
          }
        />*/}
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>

    <div className="col-span-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
<RHFSelect
  name="language_id"
  label="Language"
  control={control}
  errors={errors}
  options={language_id.map((lang) => ({
    value: Number(lang.id),
    label: lang.name,
    disabled: selectedLanguages.includes(Number(lang.id)), // ✅ DONE
  }))}
/>
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["language_id"]}
          onClick={() =>
            handleRefresh("language_id", handleDropDown)
          }
        />*/}
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>

    <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFTextField
            name="price"
            label="Price"
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
    </div>
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