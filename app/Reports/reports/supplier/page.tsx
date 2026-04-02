"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
 import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { File } from "lucide-react"
import { Label } from "@/components/ui/label";

import Link from "next/link";

export default function SupplierReportPage() {

const [rows,setRows] = useState<any[]>([]);
const [suppliers,setSuppliers] = useState<any[]>([]);
const [loading,setLoading] = useState(false);

const [date,setDate] = useState("");

const [supplier,setSupplier] = useState("");          // applied filter
const [tempSupplier,setTempSupplier] = useState("");  // selected in dropdown

const [supplierSearch,setSupplierSearch] = useState("");
const [openSupplier,setOpenSupplier] = useState(false);

const dropdownRef = useRef<HTMLDivElement>(null);

// ================= LOAD ALL DATA ON PAGE LOAD =================

useEffect(()=>{
loadSuppliers();
loadReport();        // ⭐ table shows by default
},[]);

const loadSuppliers = async () => {
  try {
    const res = await fetch("/api/suppliers");
    const data = await res.json();

    console.log("SUPPLIER DATA:", data);

    setSuppliers(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error("SUPPLIER LOAD ERROR", e);
  }
};

const loadReport = async ()=>{
setLoading(true);
try{
const res = await fetch("/api/duties");
const data = await res.json();

console.log("DUTY ROW SAMPLE 👉", data?.[0]);   // ⭐ ADD THIS

setRows(Array.isArray(data)?data:[]);
}catch(e){
console.error("REPORT LOAD ERROR",e);
}
setLoading(false);
};

// ================= SEARCH CLICK =================

const search = async ()=>{


setLoading(true);

const params = new URLSearchParams();

if(date){
  params.append("from",date);
  params.append("to",date);
}

if(tempSupplier){
  params.append("supplier",tempSupplier);
}

const res = await fetch(`/api/duties?${params.toString()}`);
const data = await res.json();

setRows(Array.isArray(data)?data:[]);
setSupplier(tempSupplier);   // ⭐ apply filter
setLoading(false);


};

const print = ()=>window.print();

// ================= OUTSIDE CLICK =================

useEffect(()=>{
const handler = (e:any)=>{
if(!dropdownRef.current?.contains(e.target)){
setOpenSupplier(false);
}
};
document.addEventListener("mousedown",handler);
return ()=>document.removeEventListener("mousedown",handler);
},[]);

// ================= DROPDOWN SEARCH =================

const filteredSuppliers = useMemo(()=>{
return suppliers.filter((s:any)=>
(s.name || "")
.toLowerCase()
.includes(supplierSearch.toLowerCase())
);
},[suppliers,supplierSearch]);

// ================= TABLE FILTER =================

const tableRows = useMemo(()=>{


let temp = [...rows];

// ⭐ ONLY DUTY SLIP RECORDS
temp = temp.filter(
  (r:any)=>
    r?.dutySlipNo &&
    String(r.dutySlipNo).trim() !== ""
);

// ⭐ SORT DATE
temp.sort(
  (a:any,b:any)=>
    new Date(a.date).getTime() -
    new Date(b.date).getTime()
);

return temp;


},[rows,supplier]);

const selectedSupplier = suppliers.find(
  (s:any) => String(s.id) === String(tempSupplier)
);


const supplierMap = useMemo(() => {
  const map:any = {};
  suppliers.forEach((s:any) => {
    map[String(s.id)] = s.name;
  });
  return map;
}, [suppliers]);


return (


<div className="p-6 space-y-6">

        <div className="flex items-center gap-3 my-5">
{/* 
  <Link href="/Reports/duty-chart">
    <Button variant="outline" className="flex items-center gap-2">
      <ClipboardList size={16} />
      Operation
    </Button>
  </Link> */}
<Label>Back to Reports : </Label>
  <Link href="/Reports/reports">
    <Button variant="outline" className="flex items-center gap-2">
      <File size={16} />
      Reports
    </Button>
  </Link>
  </div>
  <div >
    <h2 className=" ml-170 item-center text-2xl"><b>Suppliers Report </b></h2>
  </div>
  {/* SEARCH CARD */}

  <Card>
    <CardContent className="p-5">

      <div className="grid md:grid-cols-4 gap-4 items-end">

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

        {/* SUPPLIER DROPDOWN */}

        <div className="relative" ref={dropdownRef}>

          <label className="text-sm font-medium">Supplier</label>

          <div
            className="border h-10 rounded px-3 flex items-center justify-between cursor-pointer bg-white"
            onClick={()=>setOpenSupplier(v=>!v)}
          >
            <span className="text-sm">
              {selectedSupplier ? selectedSupplier.name : "All Suppliers"}
            </span>
            <span className="text-xs">▼</span>
          </div>

          {openSupplier && (

            <div className="absolute w-full bg-white border shadow mt-1 z-50">

              <div className="p-2 border-b">
                <input
                  autoFocus
                  placeholder="Search supplier..."
                  className="border h-9 rounded w-full px-2 text-sm"
                  value={supplierSearch}
                  onChange={(e)=>setSupplierSearch(e.target.value)}
                />
              </div>

              <div className="max-h-56 overflow-y-auto">

                <div
                  className="p-2 text-sm hover:bg-muted cursor-pointer"
                  onClick={()=>{
                    setTempSupplier("");
                    setSupplierSearch("");
                    setOpenSupplier(false);
                  }}
                >
                  All Suppliers
                </div>

                {filteredSuppliers.map((s:any)=>(
                  <div
                    key={s.id}
                    className="p-2 text-sm hover:bg-muted cursor-pointer"
                    onClick={()=>{
                      setTempSupplier(s.id);
                      setSupplierSearch("");
                      setOpenSupplier(false);
                    }}
                  >
                    {s.name}
                  </div>
                ))}

              </div>

            </div>

          )}

        </div>

        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={search}
        >
          Search
        </Button>

        <Button variant="outline" onClick={print}>
          Print
        </Button>

      </div>

    </CardContent>
  </Card>

  {/* TABLE */}

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
              <th className="p-3">Sr</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Date</th>
              <th className="p-3">Program</th>
              <th className="p-3">Client</th>
              <th className="p-3">Pickup</th>
              <th className="p-3">Drop</th>
              <th className="p-3">Time</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Duty</th>
              <th className="p-3">Booking</th>
            </tr>
          </thead>

          <tbody>

            {tableRows.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-20 text-gray-400">
                  No report data
                </td>
              </tr>
            ) : (

              tableRows.map((r:any,index:number)=>(
                <tr key={r.id} className="border-b hover:bg-muted/40">
                  <td className="p-3">{index+1}</td>
<td className="p-3">{r.supplierName || "-"}</td>
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
