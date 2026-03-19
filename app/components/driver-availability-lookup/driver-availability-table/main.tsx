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
      setDropDownloading, driver_id,
 current_location_id,
 current_job_id,},
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
                  href={`/dashboard/driver-availability-lookup/driver-availability-table/list`}
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
            name="driver_id"
            label="Driver Id"
            control={control}
            errors={errors}
            options={driver_id.map((op) => {
              return {
                value: Number(op.id),
                label: op.name,
              };
            })}
          />
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["driver_id"]}
          onClick={() =>
            handleRefresh("driver_id", handleDropDown)
          }
        />*/}
        {/*<LabelWithTooltip
          text=""
          tooltip="Set display order (lower numbers appear first)"
          href="/admin/docs/order-rules"
        />*/}
      </div>
    </div>

    {/* <div className="col-span-1">
      <div className="flex items-center">
        <div className="flex-1">
          <RHFCheckbox
            control={control}
            name="is_available"
            label="Is Available"
          />
        </div>
        <LabelWithTooltip
          text=""
          tooltip="Set is_available Is Available"
          href="/admin/docs/order-rules"
        />
      </div>
    </div> */}

    <div className="col-span-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <RHFSelect
            name="current_location_id"
            label="Current Location Id"
            control={control}
            errors={errors}
            options={current_location_id.map((op) => {
              return {
                value: Number(op.id),
                label: op.name,
              };
            })}
          />
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["current_location_id"]}
          onClick={() =>
            handleRefresh("current_location_id", handleDropDown)
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
            name="current_job_id"
            label="Current Job Id"
            control={control}
            errors={errors}
            options={current_job_id.map((op) => {
              return {
                value: Number(op.id),
                label: op.external_booking_id,
              };
            })}
          />
        </div>
        {/*<SpinningRefreshIcon
          spinning={dropDownloading["current_job_id"]}
          onClick={() =>
            handleRefresh("current_job_id", handleDropDown)
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
          <RHFTimePicker
            control={control}
            name="next_free_time"
            label="Next Free Time"
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