"use client";
import { useState, useEffect } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard,ClipboardList } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import Combobox from "@/components/ui/combobox";
import { useRef } from "react";

import { ChevronsUpDown, Check } from "lucide-react";
  
import {
  FileDown,
  FileSpreadsheet,
  Mail,
  Printer,
} from "lucide-react";

// ShadCN Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
 
// ShadCN Select (Radix)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Duty = {
  srNo?: number;

  bookingId: string;
  date: string;

  pax?: string;
  client?: string;
  agent?: string;
  remark?: string;
  address?: string;
  guideName?: string;
  noOfGuide?: number;

  activity?: string;
  service_type?: string;
  vehicleType?: string;
  noOfVehicle?: number;
 
  dutySlipNo?: string;
  driverName: string | null;
  vehicle: string | null;
  registrationNumber?: string;
  pickupTime?: string;
  reportingTime?: string;
  pickupLocation: string | null;
  dropLocation: string | null;

  status: string;
};

export default function DutyChart() {
  const [data, setData] = useState<Duty[]>([]);
  const [loading, setLoading] = useState(true);
const [open, setOpen] = useState(false);
const [value, setValue] = useState("");
const [openDriver, setOpenDriver] = useState(false);
const [driverValue, setDriverValue] = useState("");

const [drivers, setDrivers] = useState<any[]>([]);
const [locations, setLocations] = useState<any[]>([]);
const [suppliers, setSuppliers] = useState<any[]>([]);
const printRef = useRef(null);

const [filters, setFilters] = useState({
  fileNo: "",
  from: "",
  to: "",
  driver: "",
  location: "",
  supplier: "",
    locationType: "",
    allocationType: "",
    driverType: "",
});

useEffect(() => {
  // Duties
  fetch("/api/duties")
    .then((res) => res.json())
    .then((res) => {
      setData(res || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));

  // Drivers
  fetch("/api/drivers-lookup/drivers-table?dropdown=true")
    .then((res) => res.json())
    .then((res) => setDrivers(res.data));

  // Locations
  fetch("/api/location-master-lookup/location-master-table?dropdown=true")
    .then((res) => res.json())
    .then((res) => setLocations(res.data));

  // Suppliers
  fetch("/api/supplier-master-lookup/supplier-master-table?dropdown=true")
    .then((res) => res.json())
    .then((res) => setSuppliers(res.data));

}, []);

const handleSearch = async () => {
  setLoading(true);
// console.log(filters);
 const cleanedFilters = Object.fromEntries(
  Object.entries(filters).filter(([_, v]) => v !== "")
);

const query = new URLSearchParams(cleanedFilters).toString();

  const res = await fetch(`/api/duties?${query}`);
  const result = await res.json();

  setData(result || []);
  setLoading(false);
};

const handleRefresh = async () => {
  setLoading(true);

  // 1. Reset all filters
  const defaultFilters = {
    fileNo: "",
    from: "",
    to: "",
    driver: "",
    location: "",
    supplier: "",
    locationType: "",
    allocationType: "",
    driverType: "",
  };

  setFilters(defaultFilters);

  // 2. Reload original data (no filters)
  const res = await fetch("/api/duties");
  const result = await res.json();

  setData(result || []);
  setLoading(false);
};
 

  return (
<div className="p-6 min-h-screen bg-background text-foreground">

      {/* HEADER */}
        <h1 className="text-2xl font-bold text-blue-700">
          Driver Operation
        </h1>

<div className="flex items-center gap-3 my-5">

  <Link href="/Reports/duty-chart">
    <Button variant="outline" className="flex items-center gap-2">
      <ClipboardList size={16} />
      Operation
    </Button>
  </Link>

  <Link href="/dashboard">
    <Button variant="outline" className="flex items-center gap-2">
      <LayoutDashboard size={16} />
      Dashboard
    </Button>
  </Link>

</div>
 
      {/* FILTER CARD */}
 {/* FILTER CARD */}
<Card className="mb-4  print:hidden">
  <CardHeader>
    <CardTitle>Filters</CardTitle>
  </CardHeader>

  <CardContent>

    {/* FILTER ROW */}
    <div className="flex flex-wrap gap-4 items-end">

      {/* File No */}
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

      {/* From */}
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

      {/* To */}
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

{/* Location Type */}
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

{/* Location */}
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

{/* Driver Type */}
{/* Driver Type */}
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

{/* Driver */}
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

{/* Supplier */}
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

{/* Allocation */}
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

    {/* BUTTON ROW */}
    <div className="flex flex-wrap items-center justify-between gap-2 mt-5 w-full">
    <div className="flex flex-wrap gap-2 mt-5">
      <Button onClick={handleSearch}>Search</Button>
      <Button onClick={handleRefresh} >Refresh</Button>
      <Button onClick={() => window.print()}>Print</Button>
    </div>
<div className="flex flex-wrap gap-2 mt-5 justify-end">
  <Button variant="ghost" className="p-2">
    <FileDown className="text-blue-600 size-xl" />
  </Button>

  <Button variant="ghost" className="p-2">
    <FileSpreadsheet className="text-green-600 size-xl" />
  </Button>

  <Button variant="ghost" className="p-2">
    <Mail className="text-orange-500 size-xl" />
  </Button>

  <Button variant="ghost" className="p-2">
    <Printer className="text-purple-600 size-xl" />
  </Button>
</div>
    </div>


  </CardContent>
</Card>

      {/* TABLE CARD */}
<div  id="print-section">
<Card>
  <CardHeader>
    <CardTitle>Duty Chart Details</CardTitle>
  </CardHeader>

  <CardContent>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <Table>

        {/* HEADER */}
        <TableHeader>
          <TableRow className=" mt-20 bg-muted border-b border-border">
            <TableHead>Sr No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>File Details</TableHead>
            <TableHead>Service Details</TableHead>
            <TableHead>Vehicle Driver Details</TableHead>
            <TableHead>Pickup / Reporting</TableHead>
            <TableHead>Drop</TableHead>
            <TableHead>Print</TableHead>
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <TableRow key={i} className="hover:bg-muted/50">

                {/* 1 */}
                <TableCell>{i + 1}</TableCell>

                {/* 2 */}
                <TableCell>{row.date || "-"}</TableCell>

                {/* 3 */}
                <TableCell className="text-left">
                  <div><b>Booking:</b> {row.bookingId || "-"}</div>
                  <div><b>PAX:</b> {row.pax || "-"}</div>
                  <div><b>Client Name:</b> {row.client || "-"}</div>
                  <div><b>Agent Name:</b> {row.agent || "-"}</div>
                  <div><b>Remark:</b> {row.remark || "-"}</div>
                  <div><b>Address Details:</b> {row.address || "-"}</div>
                  <div><b>Guide:</b> {row.noOfGuide || "-"}</div>
                </TableCell>

                {/* 4 */}
                <TableCell className="text-left">
                  <div><b>Date:</b> {row.date || "-"}</div>
                  <div><b>Activity:</b> {row.service_type || "-"}</div>
                  <div><b>VH Type:</b> {row.vehicleType || "-"}</div>
                  <div><b>No.Of Vehicles:</b> {row.noOfVehicle || "1"}</div>
                </TableCell>

                {/* 5 */}
                <TableCell className="text-left">
                  <div><b>Duty Slip No.:</b> {row.dutySlipNo || "-"}</div>
                  <div><b>Registration Number:</b> {row.registrationNumber || "-"}</div>
                  <div><b>Driver Name:</b> {row.driverName || "Not Assigned"}</div>
                  <div><b>Guide Name:</b> {row.guideName || "-"}</div>

                  <div className="mt-2">
                    {!row.driverName && !row.guideName ? (
                      <div className="flex items-center gap-2">
                        <span className="text-destructive text-sm font-medium">
                          Not Allocated
                        </span>

                        <Link href={`/Reports/duty-chart/allocate/${row.bookingId}`}>
                          <Button size="sm" variant="outline">
                            Allocate
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm font-medium">
                          Allocated
                        </span>

                        <Link href={`/Reports/duty-chart/allocate/${row.bookingId}`}>
                          <Button size="sm" variant="outline">
                            Modify
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* 6 */}
                <TableCell className="text-left">
                  <div><b>Location:</b> {row.pickupLocation || "-"}</div>
                  <div><b>Report:</b> {row.reportingTime || "-"}</div>
                  <div><b>Pickup:</b> {row.pickupTime || "-"}</div>
                </TableCell>

                {/* 7 */}
                <TableCell>
                  {row.dropLocation || "-"}
                </TableCell>

                {/* 8 */}
                <TableCell>
                    <Button variant="ghost" className="p-2">
                      <Printer className="text-red-600 size-xl" />
                    </Button>
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
    )}
  </CardContent>
</Card>
</div>
    </div>
  );
}