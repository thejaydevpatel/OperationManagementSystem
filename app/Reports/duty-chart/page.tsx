"use client";
import { useState, useEffect } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"

type Duty = {
  srNo?: number;

  bookingId: string;
  date: string;

  pax?: string;
  clientName?: string;
  agentName?: string;
  remark?: string;
  address?: string;
  guideName?: string;
  noOfGuide?: number;

  activity?: string;
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


const [drivers, setDrivers] = useState<any[]>([]);
const [locations, setLocations] = useState<any[]>([]);
const [suppliers, setSuppliers] = useState<any[]>([]);

const [filters, setFilters] = useState({
  fileNo: "",
  from: "",
  to: "",
  driver: "",
  location: "",
  supplier: "",
    locationType: "",
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* HEADER */}
        <h1 className="text-2xl font-bold text-blue-700">
          Driver Operation
        </h1>

        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2 my-5">
            <LayoutDashboard size={16} />
            Dashboard
          </Button>
        </Link>
 
      {/* FILTER CARD */}
<div className="bg-white p-4 rounded shadow mb-4">

  {/* FILTER ROW */}
  <div className="flex flex-wrap items-end gap-3">

    {/* File No */}
    <div className="flex items-center gap-2">
      <label className="text-sm whitespace-nowrap">File No</label>
<input
  type="text"
  className="border px-2 py-1 rounded text-sm w-36"
  onChange={(e) =>
    setFilters({ ...filters, fileNo: e.target.value })
  }
/>
    </div>

    {/* From */}
    <div className="flex items-center gap-2">
      <label className="text-sm">From</label>
<input
  type="date"
  className="border px-2 py-1 rounded text-sm w-36"
  onChange={(e) =>
    setFilters({ ...filters, from: e.target.value })
  }
/>
    </div>

    {/* To */}
    <div className="flex items-center gap-2">
      <label className="text-sm">To</label>
<input
  type="date"
  className="border px-2 py-1 rounded text-sm w-36"
  onChange={(e) =>
    setFilters({ ...filters, to: e.target.value })
  }
/>    </div>

    {/* Location Type */}
    <div className="flex items-center gap-2">
      <label className="text-sm whitespace-nowrap">Select Location Type</label>
<select
  className="border px-2 py-1 rounded text-sm w-40"
  onChange={(e) =>
    setFilters({ ...filters, locationType: e.target.value })
  }
>
  <option value="">All</option>
  <option value="Pickup">Pickup</option>
  <option value="DropOff">DropOff</option>
</select>
    </div>

    {/* Location */}
    <div className="flex items-center gap-2">
      <label className="text-sm">Select Location</label>
<select
  onChange={(e) =>
    setFilters({ ...filters, location: e.target.value })
  }
  className="border px-2 py-1 rounded text-sm w-36"
>
  <option value="">All</option>
  {locations.map((l) => (
    <option key={l.id} value={l.id}>
      {l.name}
    </option>
  ))}
</select>
    </div>

    {/* Driver Type */}
    <div className="flex items-center gap-2">
      <label className="text-sm whitespace-nowrap">Driver Type</label>
      <select className="border px-2 py-1 rounded text-sm w-36">
        <option>All</option>
      </select>
    </div>

    {/* Driver */}
    <div className="flex items-center gap-2">
      <label className="text-sm">Drivers</label>
      <select
  onChange={(e) =>
    setFilters({ ...filters, driver: e.target.value })
  }
  className="border px-2 py-1 rounded text-sm w-36"
>
  <option value="">All</option>
  {drivers.map((d) => (
    <option key={d.id} value={d.id}>
      {d.name}
    </option>
  ))}
</select>
    </div>

    {/* Supplier */}
    <div className="flex items-center gap-2">
      <label className="text-sm">Suppliers </label>
<select
  onChange={(e) =>
    setFilters({ ...filters, supplier: e.target.value })
  }
  className="border px-2 py-1 rounded text-sm w-40"
>
  <option value="">All</option>
  {suppliers.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</select>
    </div>

    {/* Allocation */}
    <div className="flex items-center gap-2">
      <label className="text-sm">Allocation Type</label>
      <select className="border px-2 py-1 rounded text-sm w-32">
        <option>All</option>
      </select>
    </div>

  </div>

  {/* BUTTON ROW */}
  <div className="flex flex-wrap gap-2 mt-3">

    <button
      onClick={handleSearch}
      className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded">
      Search
    </button>

    <button className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded">
      Print
    </button>

    <button className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded">
      Refresh
    </button>

    <button className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded">
      Download PDF
    </button>

    <button className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded">
      Export To Excel
    </button>

    <button className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded">
      Send Mail
    </button>

    <button className="bg-gray-600 text-white px-4 py-1.5 text-sm rounded">
      PrintDutySlipWise
    </button>

  </div>

</div>

      {/* TABLE CARD */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">Duty Chart Details</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-blue-700 ">
              <tr>
                <th className="p-2">Sr No.</th>
                <th className="p-2">Date</th>
                <th className="p-2">File Details</th>
                <th className="p-2">Service Details</th>
                <th className="p-2">Vehicle Driver Details</th>
                <th className="p-2">Pickup point / reporting time </th>
                <th className="p-2">Drop off place</th>
                <th className="p-2">print merged duty slip</th>
               </tr>
            </thead>

            {/* <tbody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className="border text-center hover:bg-gray-100">
                    <td className="p-2">{row.bookingId || "-"}</td>
                    <td className="p-2">{row.driver || "Not Assigned"}</td>
                    <td className="p-2">{row.vehicle || "-"}</td>
                    <td className="p-2">{row.pickup || "-"}</td>
                    <td className="p-2">{row.drop || "-"}</td>
                    <td className="p-2">{row.time || "-"}</td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          row.status === "Completed"
                            ? "bg-green-600"
                            : row.status === "Assigned"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody> */}
            <tbody>
  {data.length > 0 ? (
    data.map((row, i) => (
      <tr key={i} className="border text-center hover:bg-gray-100">

        {/* 1. Sr No */}
        <td className="p-2">{i + 1}</td>

        {/* 2. Date */}
        <td className="p-2">
          {row.date || "-"}
        </td>

        {/* 3. File Details */}
         <td className="p-2 text-left">
          <div><b>Booking:</b> {row.bookingId || "-"}</div>
          <div><b>PAX:</b> {row.pax || "-"}</div>
          <div><b>Client:</b> {row.clientName || "-"}</div>
          <div><b>Agent:</b> {row.agentName || "-"}</div>
          <div><b>Remark:</b> {row.remark || "-"}</div>
          <div><b>Address:</b> {row.address || "-"}</div>
          <div><b>Guide:</b> {row.noOfGuide || "-"}</div>
        </td>

        {/* 4. Service Details */}
        <td className="p-2 text-left">
          <div><b>Date:</b> {row.date || "-"}</div>
          <div><b>Activity:</b> {row.activity || "-"}</div>
          <div><b>Vehicle Type:</b> {row.vehicleType || "-"}</div>
          <div><b>No. of Vehicle:</b> {row.noOfVehicle || "1"}</div>
        </td>

        {/* 5. Vehicle Driver Details */}
        <td className="p-2 text-left">
          <div><b>Duty Slip No:</b> {row.dutySlipNo || "-"}</div>
          <div><b>Car Reg. No:</b> {row.registrationNumber || "-"}</div>
          <div><b>Driver:</b> {row.driverName || "Not Assigned"}</div>
          <div><b>Guide:</b> {row.guideName || "-"}</div>

          <div className="mt-2">

<span>
  {!row.driverName && !row.guideName ? (
    <>
     <span className="text-red-600 font-medium">
        Not Allocated - 
      </span>{" "}
      <Link href={`/Reports/duty-chart/allocate/${row.bookingId}`}>
        <span className="text-blue-600 cursor-pointer px-3 py-1 rounded-md bg-blue-200 transition">Allocate</span>
      </Link>
    </>
  ) : (
    <>
      <span className="text-green-600 font-medium">
        Allocated - 
      </span>{" "}
      <Link href={`/Reports/duty-chart/allocate/${row.bookingId}`}>
        <span className="text-orange-600 cursor-pointer bg-green-100   px-3 py-1 rounded-md bg-orange-200 transition">Modify</span>
      </Link>
    </>
  )}
</span>
{/* <Link href={`/Reports/duty-chart/allocate/${row.bookingId}`}>
  <button className="text-blue-600 underline">
    {row.driverName || row.guide ? "Modify" : "Allocate"}
  </button>
</Link> */}
{/* {row.driverName || row.guide ? (
  <Link href={`/dashboard/allocate/${row.bookingId}`}>
    <button className="text-orange-600 underline">
      Modify
    </button>
  </Link>
) : (
  <Link href={`/dashboard/allocate/${row.bookingId}`}>
    <button className="text-green-600 underline">
      Allocate
    </button>
  </Link>
)} */}

{/* <td>
  {row.driverName && row.guide ? (
    <Link href={`/dashboard/allocate/${row.bookingId}?jobId=${row.id}`}>
      <button className="text-orange-600 underline">
        Modify
      </button>
    </Link>
  ) : (
    <Link href={`/dashboard/allocate/${row.bookingId}?jobId=${row.id}`}>
      <button className="text-green-600 underline">
        Allocate
      </button>
    </Link>
  )}
</td> */}
          </div>  
        </td>

        {/* 6. Pickup Point / Reporting time */}
        <td className="p-2 text-left">
          <div><b>Location:</b> {row.pickupLocation || "-"}</div>
          <div><b>Reporting:</b> {row.reportingTime || "-"}</div>
          <div><b>Pickup:</b> {row.pickupTime  || "-"}</div>
        </td>

        {/* 7. Drop Off Place */}
        <td className="p-2">
          {row.dropLocation || "-"}
        </td>

        {/* 8. Print Merged Duty Slip */}
        <td className="p-2">
          <button className="bg-blue-600 text-white px-3 py-1 text-xs rounded">
            Print
          </button>
        </td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={8} className="p-4 text-center">
        No Data Found
      </td>
    </tr>
  )}
</tbody>
          </table>
        )}
      </div>
    </div>
  );
}