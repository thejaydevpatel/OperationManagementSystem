// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import { File } from "lucide-react"
// import { Label } from "@/components/ui/label";

// import Link from "next/link";

// export default function VehicleReportPage() {

//   const [rows, setRows] = useState<any[]>([]);
//   const [vehicles, setVehicles] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [date, setDate] = useState("");
//   const [vehicle, setVehicle] = useState("");
//   const [vehicleSearch, setVehicleSearch] = useState("");

//   const [openVehicle, setOpenVehicle] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // ================= FETCH =================

// const fetchReport = async (
//   selectedVehicle: string = vehicle,
//   selectedDate: string = date
// ) => {

//     setLoading(true);

//     const params = new URLSearchParams();

//     // const v = selectedVehicle ?? vehicle;
//     // const d = selectedDate ?? date;

// if (selectedDate) {
//   params.append("from", selectedDate);
//   params.append("to", selectedDate);
// }

// if (selectedVehicle) {
//   params.append("vehicle", selectedVehicle);
// }

//     const res = await fetch(`/api/duties?${params.toString()}`);
//     const data = await res.json();

//     setRows(Array.isArray(data) ? data : []);

//     // BUILD VEHICLE LIST SAFELY
//     const uniqueVehicles = Array.from(
//       new Map(
//         (Array.isArray(data) ? data : [])
//           .filter((r: any) => r?.vehicleId)
//           .map((r: any) => [
//             r.vehicleId,
//             {
//               id: r.vehicleId,
//               name:
//                 r.vehicleType ||
//                 r.registrationNumber ||
//                 `Vehicle ${r.vehicleId}`,
//             },
//           ])
//       ).values()
//     );

//     setVehicles(uniqueVehicles);

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchReport(); // default load
//   }, []);

//   // ================= OUTSIDE CLICK =================

//   useEffect(() => {

//     const handler = (e: any) => {
//       if (!dropdownRef.current?.contains(e.target)) {
//         setOpenVehicle(false);
//       }
//     };

//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);

//   }, []);

//   // ================= FILTER DROPDOWN =================

//   const filteredVehicles = useMemo(() => {

//     return vehicles.filter((v: any) =>
//       (v?.name || "")
//         .toLowerCase()
//         .includes((vehicleSearch || "").toLowerCase())
//     );

//   }, [vehicles, vehicleSearch]);

//   // ================= ACTIONS =================

// const search = () => {
//   fetchReport(vehicle, date);
// };

//   const reset = () => {
//     setDate("");
//     setVehicle("");
//     setVehicleSearch("");
//     fetchReport("", "");
//   };

//   const print = () => window.print();

//   // ================= SORT TABLE =================

// const filteredAndSortedRows = useMemo(() => {

//   let temp = [...rows];

//   // ⭐ SHOW ONLY ROWS HAVING REGISTRATION NUMBER
//   temp = temp.filter(
//     (r: any) =>
//       r?.registrationNumber &&
//       String(r.registrationNumber).trim() !== ""
//   );

//   // ⭐ FILTER BY DATE
//   if (date) {
//     temp = temp.filter(
//       (r: any) =>
//         r?.date &&
//         new Date(r.date).toISOString().slice(0, 10) === date
//     );
//   }

//   // ⭐ FILTER BY VEHICLE
//   if (vehicle) {
//     temp = temp.filter(
//       (r: any) =>
//         String(r?.vehicleId || "") === String(vehicle)
//     );
//   }

//   // ⭐ SORT
//   temp.sort(
//     (a, b) =>
//       new Date(a?.date || 0).getTime() -
//       new Date(b?.date || 0).getTime()
//   );

//   return temp;

// }, [rows, date, vehicle]);

//   return (

//     <div className="p-6 space-y-6">

//       <div className="flex items-center gap-3 my-5">
// {/* 
//   <Link href="/Reports/duty-chart">
//     <Button variant="outline" className="flex items-center gap-2">
//       <ClipboardList size={16} />
//       Operation
//     </Button>
//   </Link> */}
// <Label>Back to Reports : </Label>
//   <Link href="/Reports/reports">
//     <Button variant="outline" className="flex items-center gap-2">
//       <File size={16} />
//       Reports
//     </Button>
//   </Link>
//   </div>
//       {/* ================= SEARCH CARD ================= */}
//   <div >
//     <h2 className=" ml-170 item-center text-2xl"><b>Vehicles Report </b></h2>
//   </div>
//       <Card>
//         <CardContent className="p-5">

//           <div className="grid md:grid-cols-5 gap-4 items-end">

//             {/* DATE */}

//             <div>
//               <label className="text-sm font-medium">For Date</label>
//               <input
//                 type="date"
//                 className="border h-10 rounded w-full px-2"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>

//             {/* VEHICLE DROPDOWN */}

//             <div className="relative" ref={dropdownRef}>

//               <label className="text-sm font-medium">Vehicle</label>

//               <div
//                 className="border h-10 rounded px-3 flex items-center justify-between cursor-pointer bg-white"
//                 onClick={() => setOpenVehicle((v) => !v)}
//               >
//                 <span className="text-sm">
//                   {vehicleSearch || "All Vehicles"}
//                 </span>

//                 <span className="text-xs">▼</span>
//               </div>

//               {openVehicle && (

//                 <div className="absolute w-full bg-white border shadow mt-1 z-50">

//                   <div className="p-2 border-b">
//                     <input
//                       autoFocus
//                       placeholder="Search vehicle..."
//                       className="border h-9 rounded w-full px-2 text-sm"
//                       value={vehicleSearch}
//                       onChange={(e) => setVehicleSearch(e.target.value)}
//                     />
//                   </div>

//                   <div className="max-h-56 overflow-y-auto">

//                     <div
//                       className="p-2 text-sm hover:bg-muted cursor-pointer"
//                       onClick={() => {
//                         setVehicle("");
//                         setVehicleSearch("");
//                         setOpenVehicle(false);
//                       }}
//                     >
//                       All Vehicles
//                     </div>

//                     {filteredVehicles.length === 0 && (
//                       <div className="p-3 text-gray-400 text-sm text-center">
//                         No vehicles found
//                       </div>
//                     )}

//                     {filteredVehicles.map((v: any) => (
//                       <div
//                         key={v.id}
//                         className="p-2 text-sm hover:bg-muted cursor-pointer"
//                         onClick={() => {
//                           setVehicle(v.id);
//                           setVehicleSearch(v.name);
//                           setOpenVehicle(false);
//                         }}
//                       >
//                         {v.name}
//                       </div>
//                     ))}

//                   </div>

//                 </div>

//               )}

//             </div>

//             {/* BUTTONS */}

//             <Button className="bg-green-600 hover:bg-green-700" onClick={search}>
//               Search
//             </Button>

//             <Button variant="outline" onClick={print}>
//               Print
//             </Button>

//             {/* <Button variant="destructive" onClick={reset}>
//               Reset
//             </Button> */}

//           </div>

//         </CardContent>
//       </Card>

//       {/* ================= TABLE ================= */}

//       <Card>
//         <CardContent className="p-0 overflow-auto">

//           {loading ? (
//             <div className="flex justify-center py-20">
//               <Loader2 className="animate-spin" />
//             </div>
//           ) : filteredAndSortedRows.length === 0 ? (
//             <div className="text-center py-20 text-gray-400">
//               No report data found
//             </div>
//           ) : (

//             <table className="w-full text-sm">

//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="p-3">Sr</th>
//                   <th className="p-3">Vehicle</th>
//                   <th className="p-3">Date</th>
//                   <th className="p-3">Program</th>
//                   <th className="p-3">Client</th>
//                   <th className="p-3">Pickup</th>
//                   <th className="p-3">Drop</th>
//                   <th className="p-3">Time</th>
//                   <th className="p-3">Reg</th>
//                   <th className="p-3">Duty</th>
//                   <th className="p-3">Booking</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {filteredAndSortedRows.map((r: any, index: number) => (
//                   <tr key={r.id} className="border-b hover:bg-muted/40">
//                     <td className="p-3">{index + 1}</td>
//                     <td className="p-3">{r.vehicleType}</td>
//                     <td className="p-3">{r.date}</td>
//                     <td className="p-3">{r.service_type}</td>
//                     <td className="p-3">{r.client}</td>
//                     <td className="p-3">{r.pickupLocation}</td>
//                     <td className="p-3">{r.dropLocation}</td>
//                     <td className="p-3">{r.pickupTime}</td>
//                     <td className="p-3">{r.registrationNumber}</td>
//                     <td className="p-3">{r.dutySlipNo}</td>
//                     <td className="p-3">{r.bookingId}</td>
//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           )}

//         </CardContent>
//       </Card>

//     </div>

//   );
// }




"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, File } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function VehicleReportPage() {

  const [rows, setRows] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ DEFAULT TODAY
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [vehicle, setVehicle] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [openVehicle, setOpenVehicle] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ================= FETCH =================

  const fetchReport = async (
    selectedVehicle: string = vehicle,
    selectedDate: string = date
  ) => {

    setLoading(true);

    const params = new URLSearchParams();

    if (selectedDate) {
      params.append("from", selectedDate);
      params.append("to", selectedDate);
    }

    if (selectedVehicle) {
      params.append("vehicle", selectedVehicle);
    }

    const res = await fetch(`/api/duties?${params.toString()}`);
    const data = await res.json();

    const list = Array.isArray(data) ? data : [];
    setRows(list);

    // ✅ BUILD VEHICLE LIST
    const uniqueVehicles = Array.from(
      new Map(
        list
          .filter((r: any) => r?.vehicleId)
          .map((r: any) => [
            r.vehicleId,
            {
              id: r.vehicleId,
              name:
                r.vehicleType ||
                r.registrationNumber ||
                `Vehicle ${r.vehicleId}`,
            },
          ])
      ).values()
    );

    setVehicles(uniqueVehicles);

    setLoading(false);
  };

  // ✅ LOAD WITH TODAY DATE
  useEffect(() => {
    fetchReport("", date);
  }, []);

  // ================= OUTSIDE CLICK =================

  useEffect(() => {
    const handler = (e: any) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpenVehicle(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ================= FILTER DROPDOWN =================

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v: any) =>
      (v?.name || "")
        .toLowerCase()
        .includes(vehicleSearch.toLowerCase())
    );
  }, [vehicles, vehicleSearch]);

  // ================= ACTIONS =================

  const search = () => {
    fetchReport(vehicle, date);
  };

  const print = () => window.print();

  // ================= SORT TABLE =================

  const filteredAndSortedRows = useMemo(() => {

    let temp = [...rows];

    temp = temp.filter(
      (r: any) =>
        r?.registrationNumber &&
        String(r.registrationNumber).trim() !== ""
    );

    if (date) {
      temp = temp.filter(
        (r: any) =>
          r?.date &&
          new Date(r.date).toISOString().slice(0, 10) === date
      );
    }

    if (vehicle) {
      temp = temp.filter(
        (r: any) =>
          String(r?.vehicleId || "") === String(vehicle)
      );
    }

    temp.sort(
      (a, b) =>
        new Date(a?.date || 0).getTime() -
        new Date(b?.date || 0).getTime()
    );

    return temp;

  }, [rows, date, vehicle]);

  return (
    <div className="p-6 space-y-6"> 
    
      <h2 className="text-center text-2xl font-bold">Vehicles Report</h2>

      {/* ================= SEARCH CARD ================= */}

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
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* VEHICLE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>

              <label className="text-sm font-medium">Vehicle</label>

              <div
                className="border h-10 rounded px-3 flex items-center justify-between cursor-pointer bg-white"
                onClick={() => setOpenVehicle((v) => !v)}
              >
                <span className="text-sm">
                  {vehicleSearch || "All Vehicles"}
                </span>
                <span className="text-xs">▼</span>
              </div>

              {openVehicle && (
                <div className="absolute w-full bg-white border shadow mt-1 z-50">

                  <div className="p-2 border-b">
                    <input
                      autoFocus
                      placeholder="Search vehicle..."
                      className="border h-9 rounded w-full px-2 text-sm"
                      value={vehicleSearch}
                      onChange={(e) => setVehicleSearch(e.target.value)}
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto">

                    <div
                      className="p-2 text-sm hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setVehicle("");
                        setVehicleSearch("");
                        setOpenVehicle(false);
                      }}
                    >
                      All Vehicles
                    </div>

                    {filteredVehicles.map((v: any) => (
                      <div
                        key={v.id}
                        className="p-2 text-sm hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setVehicle(v.id);
                          setVehicleSearch(v.name); // ✅ show selected
                          setOpenVehicle(false);
                        }}
                      >
                        {v.name}
                      </div>
                    ))}

                  </div>

                </div>
              )}

            </div>
<div>

            {/* BUTTONS */}
            <Button className="bg-green-600 hover:bg-green-700 ml-5 mr-5" onClick={search}>
              Search
            </Button>

            <Button variant="outline" onClick={print}>
              Print
            </Button>

</div>
          </div>

        </CardContent>
      </Card>

      {/* ================= TABLE ================= */}

      <Card>
        <CardContent className="p-0 overflow-auto">

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredAndSortedRows.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No report data found
            </div>
          ) : (

            <table className="w-full text-sm">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Sr</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Pickup</th>
                  <th className="p-3">Drop</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Reg</th>
                  <th className="p-3">Duty</th>
                  <th className="p-3">Booking</th>
                </tr>
              </thead>

              <tbody>
                {filteredAndSortedRows.map((r: any, index: number) => (
                  <tr key={r.id} className="border-b hover:bg-muted/40">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{r.vehicleType}</td>
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
                ))}
              </tbody>

            </table>

          )}

        </CardContent>
      </Card>

    </div>
  );
}