"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Combobox from "@/components/ui/combobox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, FileDown, FileSpreadsheet } from "lucide-react";

export default function DutyFilters({
  filters,
  setFilters,
  handleSearch,
  handleRefresh,
  locations,
  drivers,
  suppliers,
  downloadPDF,
  downloadExcel,
  data,
}: any) {
  return (
<Card className="mb-4  print:hidden">
  <CardHeader>
    <CardTitle>Filters</CardTitle>
  </CardHeader>

  <CardContent>

    <div className="flex flex-wrap gap-4 items-end">

      <div className="flex flex-col gap-1">
        <label className="text-sm">File No</label>
        <Input
          className="w-60"
          value={filters.fileNo}
          onChange={(e) =>
            setFilters({ ...filters, fileNo: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm">From</label>
        <Input
          type="date"
          className="w-60"
           value={filters.from}
          onChange={(e) =>
            setFilters({ ...filters, from: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm">To</label>
        <Input
          type="date"
          className="w-60"
           value={filters.to}
          onChange={(e) =>
            setFilters({ ...filters, to: e.target.value })
          }
        />
      </div>

<div className="flex flex-col gap-1">
  <label className="text-sm">Location Type</label>
  <Select
    value={filters.locationType}
    onValueChange={(value) =>
      setFilters({ ...filters, locationType: value })
    } 
  >
    <SelectTrigger className="w-60">
      <SelectValue placeholder="All" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Pickup">Pickup</SelectItem>
      <SelectItem value="DropOff">DropOff</SelectItem>
    </SelectContent>
  </Select>
</div>

<div className="flex flex-col gap-1">
  <label className="text-sm">Location</label>
    <Combobox
      options={locations.map((l) => ({
        label: l.name,
        value: String(l.id),
      }))}
      value={filters.location}
      onChange={(val) => setFilters({ ...filters, location: val })}
      placeholder="All"
      searchPlaceholder="Search location..."
    />
</div>

<div className="flex flex-col gap-1">
  <label className="text-sm">Driver Type</label>

  <Select
    onValueChange={(value) =>
      setFilters({ ...filters, driverType: value })
    }
  >
    <SelectTrigger className="w-60">
      <SelectValue placeholder="All" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">All</SelectItem>
      <SelectItem value="inhouse">Inhouse</SelectItem>
      <SelectItem value="outsource">Outsource</SelectItem>
    </SelectContent>
  </Select>
</div>

<div className="flex flex-col gap-1">
  <label className="text-sm">Drivers</label>

  <Combobox
    options={drivers.map((d) => ({
      label: d.name,
      value: String(d.id),
    }))}
    value={filters.driver}
    onChange={(val) => setFilters({ ...filters, driver: val })}
    placeholder="All"
    searchPlaceholder="Search driver..."
  />
</div>

<div className="flex flex-col gap-1">
  <label className="text-sm">Suppliers</label>
<Combobox
  options={suppliers.map((s) => ({
    label: s.name,
    value: String(s.id),
  }))}
  value={filters.supplier}
  onChange={(val) => setFilters({ ...filters, supplier: val })}
  placeholder="All"
  searchPlaceholder="Search Supplier..."
/>
</div>

<div className="flex flex-col gap-1">
  <label className="text-sm">Allocation</label>
  <Select
    onValueChange={(value) =>
      setFilters({ ...filters, allocationType: value })
    }
  >
    <SelectTrigger className="w-60">
      <SelectValue placeholder="All" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Allocate">Allocate</SelectItem>
      <SelectItem value="Modify">Modify</SelectItem>
    </SelectContent>
  </Select>
</div>

    </div>

    <div className="flex flex-wrap items-center justify-between gap-2 mt-5 w-full">
    <div className="flex flex-wrap gap-2 mt-5">
      <Button onClick={handleSearch}>Search</Button>
      <Button onClick={() => window.print()}>Print</Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 cursor-pointer"
              onClick={handleRefresh}
            >
              <RefreshCw className="size-4 mr-2 "/>
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            Refresh
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

<div className="flex flex-wrap gap-2 mt-5 justify-end">

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        className="p-2 cursor-pointer"
        onClick={() => downloadPDF(data)}
      >
        <FileDown className="text-red-600 size-xl" />
      </Button>
    </TooltipTrigger>

    <TooltipContent>
      Download as PDF
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        className="p-2 cursor-pointer"
        onClick={() => downloadExcel(data)}
      >
        <FileSpreadsheet className="text-green-600 size-xl" />
      </Button>
    </TooltipTrigger>

    <TooltipContent>
      Download as EXCEL
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

</div>
    </div>

  </CardContent>
</Card>
  );
}