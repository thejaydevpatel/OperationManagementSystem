"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { LayoutDashboard,File } from "lucide-react"
import { Label } from "@/components/ui/label";
import FreeDriversPage from "../free-drivers/page";

export default function DriverReportPage() {

  const [rows,setRows] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);

  const [date, setDate] = useState(() => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // yyyy-mm-dd
});

  const [driver,setDriver] = useState("");
  const [driverType,setDriverType] = useState("");

  const [drivers,setDrivers] = useState<any[]>([]);
  const [driverTypes,setDriverTypes] = useState<string[]>([]);

  // ========= FETCH =========

  const fetchDuties = async () => {

    setLoading(true);

    const params = new URLSearchParams();

    if(date){
      params.append("from",date);
      params.append("to",date);
    }

    if(driver){
      params.append("driver",driver);
    }

    const res = await fetch(`/api/duties?${params.toString()}`);
    const data = await res.json();

    setRows(data);

    // ===== BUILD DRIVER DROPDOWN =====

    const uniqueDrivers = Array.from(
      new Map(
        data
          .filter((r:any)=>r.driverId)
          .map((r:any)=>[r.driverId,{ id:r.driverId , name:r.driverName }])
      ).values()
    );

    setDrivers(uniqueDrivers);

    // ===== BUILD DRIVER TYPE DROPDOWN =====
    // here I assume vehicleType = driverType in your report

// ✅ NEW (Supplier-based Driver Type)
const types = Array.from(
  new Map(
    data
      .filter((r: any) => r.supplierId)
      .map((r: any) => [
        r.supplierId,
        { id: r.supplierId, name: r.supplierName } // adjust if needed
      ])
  ).values()
);

setDriverTypes(types);
 

    setLoading(false);
  };

  useEffect(()=>{
    fetchDuties();
  },[]);

  // ========= SEARCH CLICK =========

  const search = () => {
    fetchDuties();
  };

  // ========= FILTERED TABLE =========


const filteredRows = useMemo(() => {
  return rows
    .filter((r: any) => r.driverName && r.driverName.trim() !== "")
    .filter((r: any) => {
     if (driverType && r.supplierId !== driverType) return false;
      return true;
    })
    .sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}, [rows, driverType]);


const filteredDrivers = drivers.filter((d: any) => {
  if (!driverType) return true; // show all if no supplier selected
  return d.supplierId === driverType;
});


  return (
    <div className="p-6 mt-10 space-y-6">

     <h2 className="text-center text-2xl font-bold"><b>Drivers Report </b></h2>
 
      {/* ========= SEARCH CARD ========= */}

      <Card>
        <CardContent className="p-5">

          <div className="grid md:grid-cols-5 gap-4 items-end">

            {/* DATE */}

            <div>
              <label className="text-sm font-medium">For Date</label>
              <input
                type="date"
                className="border h-10 rounded w-full px-2"
                value={date}
                onChange={(e)=>setDate(e.target.value)}
              />
            </div>

            {/* DRIVER TYPE */}

            <div>
              <label className="text-sm font-medium">Driver Type</label>
              <select
                className="border h-10 rounded w-full px-2"
                value={driverType}
                onChange={(e)=>setDriverType(e.target.value)}
              >
                <option value="">All</option>

               {driverTypes.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}

              </select>
            </div>

            {/* DRIVER */}

            <div>
              <label className="text-sm font-medium">Drivers</label>
              <select
                className="border h-10 rounded w-full px-2"
                value={driver}
                onChange={(e)=>setDriver(e.target.value)}
              >
                <option value="">All Drivers</option>

                {drivers.map((d:any)=>(
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}

              </select>
            </div>
<div>

            <Button
              className="bg-green-600 hover:bg-green-700 ml-5 mr-5"
              onClick={search}
            >
              Search
            </Button>

            <Button variant="outline">
              Print
            </Button>
</div>

          </div>

        </CardContent>
      </Card>

      {/* ========= TABLE ========= */}

      <Card>
        <CardContent className="p-0 overflow-auto">

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin"/>
            </div>
          ) : (

          <table className="w-full text-sm">

<thead className="bg-blue-600 text-white">
  <tr>
    <th className="p-3">Sr No</th>
    <th className="p-3">Driver</th>
    <th className="p-3 text-left">Date</th>
    <th className="p-3">Program</th>
    <th className="p-3">Client</th>
    <th className="p-3">Pickup</th>
    <th className="p-3">Drop</th>
    <th className="p-3">Time</th>
    <th className="p-3">Vehicle</th>
    <th className="p-3">Duty Slip</th>
    <th className="p-3">Booking</th>
  </tr>
</thead>

<tbody>
  {filteredRows.length === 0 ? (
    <tr>
      <td colSpan={11} className="text-center py-10 text-gray-500">
        No data found
      </td>
    </tr>
  ) : (
    filteredRows.map((r: any, index: number) => (
      <tr key={r.id} className="border-b hover:bg-muted/40">
        
        <td className="p-3">{index + 1}</td>
        <td className="p-3">{r.driverName}</td>
        <td className="p-3">{r.date}</td>
        <td className="p-3">{r.service_type}</td>
        <td className="p-3">{r.client}</td>
        <td className="p-3">{r.pickupLocation}</td>
        <td className="p-3">{r.dropLocation}</td>
        <td className="p-3">{r.pickupTime}</td>
        <td className="p-3">{r.registrationNumber}</td>
        <td className="p-3">{r.dutySlipNo}</td>
        <td className="p-3">{r.bookingId}</td>

      </tr>
    ))
  )}
</tbody>

          </table>

          )}

        </CardContent>
      </Card>


    </div>
  );
}