"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaUserTie, FaUserAlt  } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ClipboardList } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react";


export default function AllocatePage() {
  const { bookingId } = useParams();
  const [jobs, setJobs] = useState<any[]>([]);


const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
const [driverRows, setDriverRows] = useState<any[]>([]);
const [guideRows, setGuideRows] = useState<any[]>([]);
const [tourGuides, setTourGuides] = useState<any[]>([]);
const [languages, setLanguages] = useState<any[]>([]);

const [drivers, setDrivers] = useState([]);
const [vehicles, setVehicles] = useState<Vehicle[]>([]);
const [suppliers, setSuppliers] = useState([]);

const fetchDriverAllocation = async (jobId: number) => {
  const res = await fetch(`/api/duties/driver-allocation?jobId=${jobId}`);
  const data = await res.json();

  if (data.length > 0) {
    setDriverRows(data);
  } else {
    // default one blank row
    setDriverRows([
      {
        dutySlipNo: "",
        supplier: "",
        noOfVehicles: 1,
        vehicle: "",
        driver: "",
        manualCost: "",
        remark:""
      }
    ]);
  }
};

const fetchGuideAllocation = async (jobId: number) => {
  const res = await fetch(`/api/duties/guide-allocation?jobId=${jobId}`);
  const data = await res.json();

  if (Array.isArray(data) && data.length > 0) {
    setGuideRows(data);
  } else {
    setGuideRows([
      {
        dutySlipNo: "",
        suppliers:"",
        noOfGuide: 1,
        guide: "",
        language: "",
        extraCharge: ""
      }
    ]);
  }
};

type Vehicle = {
  id: number;
  name: string;
  supplier_id: number;
};

const handleChange = (index: number, field: string, value: any) => {
  const updated = [...driverRows];

  updated[index][field] = value;

  if (field === "vehicle") {
    const selectedVehicle = vehicles.find(
      (v) => String(v.id) === String(value)
    );

    updated[index].supplier = selectedVehicle?.supplier_id || "";
  }

  setDriverRows(updated);
};

const handleGuideChange = (index: number, field: string, value: any) => {
  const updated = [...guideRows];
  updated[index][field] = value;
  setGuideRows(updated);
};


const handleOpenDriverModal = (jobId: number) => {
   setSelectedJobId(jobId);
  setIsDriverModalOpen(true);
  fetchDriverAllocation(jobId);
};


const handleOpenGuideModal = async (jobId: number) => {

  setSelectedJobId(jobId);

  try {

    const res = await fetch(`/api/duties/guide-allocation?jobId=${jobId}`);
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      setGuideRows(data);
    } else {
      setGuideRows([
        {
          dutySlipNo: "",
          noOfGuide: 1,
          guide: "",
          language: "",
          extraCharge: ""
        }
      ]);
    }

    // ⭐ wait little so dropdown options already mounted
    setTimeout(() => {
      setIsGuideModalOpen(true);
    }, 100);

  } catch (err) {
    console.error(err);
    toast.error("Failed to load guide data");
  }
};

const sortedJobs = [...jobs].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);


const handleSave = async () => {
  const validRows = driverRows
  .filter(r => r.driver && r.vehicle)
  .map(r => ({
    ...r,
    vehicle: Number(r.vehicle),
    supplier: Number(r.supplier),
  }));
  try {
    
    // ✅ allow even partial rows
const validRows = driverRows.filter(
  (r) => r.driver && r.vehicle
);

    const res = await fetch("/api/duties/driver-allocation/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: selectedJobId,
        rows: validRows,
      }),
    });

    const data = await res.json();

    if (data.success) {
        toast.success("Driver Saved Successfully ✅");
      setIsDriverModalOpen(false);

            fetch(`/api/duties?fileNo=${bookingId}`)
        .then(res => res.json())
        .then(setJobs);

    } else {
      toast.error("Save Failed ❌");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error saving guide data");
  }
};

const handleSaveGuide = async () => {
  try {

    // ✅ only save valid rows
const validRows = guideRows.filter(
  (r) => r.noOfGuide > 0 && r.guide && r.language && r.supplier
);
console.log("🚀 Sending rows:", validRows);

    const res = await fetch("/api/duties/guide-allocation/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: selectedJobId,
        rows: validRows,
      }),
    });

    const data = await res.json();
console.log("✅ API response:", data);
 if (data.success) {
  toast.success("Guide Saved Successfully ✅");
  setIsGuideModalOpen(false);

  fetch(`/api/duties?fileNo=${bookingId}`)
    .then(res => res.json())
    .then(setJobs);
}else {
      toast.error("Save Failed ❌");
    }

  } catch (err) {
    console.error(err);
    toast.error("Error saving guide data");
  }
};

  useEffect(() => {
    if (bookingId) {
      fetch(`/api/duties?fileNo=${bookingId}`)
        .then((res) => res.json())
        .then((data) => setJobs(data));

      //  fetch("/api/duties/drivers")
      //   .then(res => res.json())
      //   .then(setDrivers);
  fetch("/api/duties/drivers")
  .then(res => {
    if (!res.ok) throw new Error("driver API failed");
    return res.json();
  })
  .then(setDrivers)
  .catch(err => console.error(err));
      // fetch("/api/duties/vehicles")
      //   .then(res => res.json())
      //   .then(setVehicles);
fetch("/api/duties/vehicles")
  .then(res => {
    if (!res.ok) throw new Error("Vehicle API failed");
    return res.json();
  })
  .then(data => {
    console.log("🔥 VEHICLES API RESPONSE:", data);

    // ✅ FIX HERE (handle both cases)
    const vehiclesArray = Array.isArray(data) ? data : data.data;

    setVehicles(vehiclesArray || []);
  })
  .catch(err => console.error(err));

  
      // fetch("/api/duties/suppliers")
      //   .then(res => res.json())
      //   .then(setSuppliers);
  fetch("/api/duties/suppliers")
  .then(res => {
    if (!res.ok) throw new Error("supplier API failed");
    return res.json();
  })
  .then(setSuppliers)
  .catch(err => console.error(err));

  fetch("/api/duties/tour-guides")
  .then(res => {
    if (!res.ok) throw new Error("guide API failed");
    return res.json();
  })
  .then(setTourGuides)
  .catch(err => console.error(err));

fetch("/api/duties/languages")
  .then(res => {
    if (!res.ok) throw new Error("language API failed");
    return res.json();
  })
  .then(setLanguages)
  .catch(err => console.error(err));
    }
  }, [bookingId]);

  return (
 <div className="p-6 min-h-screen bg-gray-50 dark:bg-black">
      
      {/* HEADER BUTTONS */}
      <div className="flex items-center gap-2 my-5">
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

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Allocate / Modify
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Booking No: {bookingId}
        </p>
      </div>

      {/* TWO CARDS */}
      <div className="grid grid-cols-1 mr-200 md:grid-cols-2 gap-6 mb-6">
        
        {/* DRIVER CARD */}
        <Card className="border-l-4 h-15 border-blue-500 dark:border-blue-400">
          <CardHeader>
            <CardTitle className="text-blue-600   dark:text-blue-400">
              👨‍✈️ Driver Allotment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* content here */}
          </CardContent>
        </Card>

        {/* GUIDE CARD */}
        <Card className="border-l-4 h-15 border-green-500 dark:border-green-400">
          <CardHeader>
            <CardTitle className="text-green-600  dark:text-green-400">
              🧑‍🏫 Guide Allotment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* content here */}
          </CardContent>
        </Card>

      </div>
   
      {/* Table Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">

          <Table>
            {/* HEADER */}
            <TableHeader className="bg-gray-100 dark:bg-neutral-900">
              <TableRow>
                <TableHead className="text-center">Sr</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Time</TableHead>
                <TableHead>From Location</TableHead>
                <TableHead>To Location</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead className="text-center">No. Vehicles</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead className="text-center">No Of Pax</TableHead>
                <TableHead className="text-center">No Of Guide</TableHead>
                <TableHead>Guide Language</TableHead>
                <TableHead className="text-center">Vehicle Price</TableHead>
                <TableHead className="text-center">Guide Price</TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            {/* BODY */}
            <TableBody>
              {sortedJobs.map((job, index) => (
                <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">

                  <TableCell className="text-center">{index + 1}</TableCell>

                  <TableCell className="text-center">
                    {job.date
                      ? new Date(job.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })
                      : "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {job.pickupTime || "-"}
                  </TableCell>

                  <TableCell>{job.pickupLocation || "-"}</TableCell>
                  <TableCell>{job.dropLocation || "-"}</TableCell>
                  <TableCell>  {`${job.service_type || "-"} from ${job.pickupLocation || "-"} to ${job.dropLocation || "-"}`}</TableCell>
                  <TableCell>{job.vehicleType || "-"}</TableCell>

                  <TableCell className="text-center">
                    {job.noOfVehicle || 1}
                  </TableCell>

                  <TableCell>{job.service_type || "-"}</TableCell>

                  <TableCell className="text-center">{job.pax || 0}</TableCell>
                  <TableCell className="text-center">{job.noOfGuide || 0}</TableCell>

                  <TableCell>{job.guideLanguage || "-"}</TableCell>

                  <TableCell className="text-center">
                    ₹ {job.vehiclePrice || 0}
                  </TableCell>

                  <TableCell className="text-center">
                    ₹ {job.guidePrice || 0}
                  </TableCell>

                  {/* Driver Button */}
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleOpenDriverModal(job.id)}
                      className="bg-blue-200 dark:bg-blue-200 rounded-full"
                    >
                      👨‍✈️
                    </Button>
                  </TableCell>

                  {/* Guide Button */}
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleOpenGuideModal(job.id)}
                      className="bg-green-200 dark:bg-green-200 rounded-full"
                    >
                      🧑‍🏫
                    </Button>
                  </TableCell>

                  {/* Driver Status */}
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${
                        job.driverName
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {job.driverName ? "Driver Assigned" : "Driver Pending"}
                    </span>
                  </TableCell>

                  {/* Guide Status */}
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${
                        job.guideName
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {job.guideName ? "Guide Assigned" : "Guide Pending"}
                    </span>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

        </CardContent>
      </Card>


{isDriverModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-black  w-[95vw] max-w-[1200px] h-[80vh]  overflow-y-auto rounded-xl p-6 shadow-2xl">

      {/* HEADER */}
      
      <div className="flex justify-between dark:bg-black items-center mb-4">
         <h2 className="text-lg font-bold text-blue-600">
          Driver Allotment
        </h2>
        
<button
  onClick={() => setIsDriverModalOpen(false)}
  className="
    flex items-center justify-center
    w-9 h-9 rounded-full
    text-gray-500 dark:text-gray-400
    hover:bg-gray-100 dark:hover:bg-zinc-800
    hover:text-black dark:hover:text-white
    transition
  "
>
  <X className="w-5 h-5" />
</button>

       
      </div>

      {/* INFO BOXES */}
      <div className="grid  grid-cols-2 gap-4 mb-10">

        {/* BOX 1 */}
        <div className="bg-gray-100 p-4  dark:bg-[#0B0B0B] rounded">
          <p>Total vehicle to assign: <b>{jobs.find(j => j.id === selectedJobId)?.noOfVehicle ?? 1}</b></p>
          <p>Vehicle type: <b>{jobs.find(j => j.id === selectedJobId)?.vehicleType || "-"}</b></p>
          <p>Total allotment vehicles: <b>{driverRows.length || "-"}</b></p>
        </div>

        {/* BOX 2 */}
        <div className="bg-gray-100  dark:bg-[#0B0B0B] p-4 rounded">
          <p>Total pax: <b>{jobs.find(j => j.id === selectedJobId)?.pax || 0}</b></p>
          <p>Guide details: <b>{jobs.find(j => j.id === selectedJobId)?.guideName || "NA"}</b></p>
        </div>

      </div>

      {/* TABLE */}
      <table className="w-full text-sm border">
        <thead className="bg-gray-200  dark:bg-[#0B0B0B]">
          <tr>
            <th>Duty Slip</th>
            <th>Supplier</th>
            <th>No. Vehicles</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Manual Cost</th>
            <th>Add</th>
            <th>Reset</th>
            </tr>
        </thead>

        <tbody>
          {driverRows.map((row, index) => (
            <tr key={index} className="border-t">

              {/* Duty Slip */}
              <td className="p-2">
                {row.dutySlipNo || "-"}
              </td>

              {/* Supplier */}
              <td>
                <select
                  value={row.supplier ?? ""}
                  onChange={(e) =>
                    handleChange(index, "supplier", e.target.value)
                  }
                  className="border p-1 dark:bg-black rounded w-full"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* No Vehicles */}
              <td>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="border dark:bg-black p-1 w-full"
                  value={row.noOfVehicles ?? "1"}
                  onChange={(e) => {
                    const value = e.target.value;

                    // ✅ Allow empty (user can clear)
                    if (value === "") {
                      const updated = [...driverRows];
                      updated[index].noOfVehicles = "";
                      setDriverRows(updated);
                      return;
                    }

                    const num = Number(value);

                    // ❌ Invalid (0 or negative)
                    if (num < 1) {
                      toast.error("Minimum 1 vehicle required", { duration: 1500 });
                      return;
                    }

                    // ✅ Valid
                    const updated = [...driverRows];
                    updated[index].noOfVehicles = num;
                    setDriverRows(updated);
                  }}

                  // 🔥 If user leaves empty → set 1
                  onBlur={() => {
                    if (!row.noOfVehicles || row.noOfVehicles < 1) {
                      const updated = [...driverRows];
                      updated[index].noOfVehicles = 1;
                      setDriverRows(updated);
                    }
                  }}
                />
              </td>

              {/* Vehicle */}
              <td>
                <select
                  value={row.vehicle ? String(row.vehicle) : ""}
                  onChange={(e) =>
                    handleChange(index, "vehicle", e.target.value)
                  }
                  className="border dark:bg-black p-1 rounded w-full"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Driver */}
              <td>
                <select
                  value={row.driver}
                  onChange={(e) =>
                    handleChange(index, "driver", e.target.value)
                  }
                  className="border dark:bg-black p-1 rounded w-full"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Manual Cost */}
              <td>
                <input
                  type="number"
                  className="border p-1 w-full"
                  value={row.manualCost || ""}
                  onChange={(e) => {
                    const updated = [...driverRows];
                    updated[index].manualCost = e.target.value;
                    setDriverRows(updated);
                  }}
                />
              </td>

              {/* Add Button */}
              <td className="text-center">
                <button
                  onClick={() => {
                    setDriverRows([
                      ...driverRows,
                      {
                        dutySlipNo: "",
                        supplier: "",
                        noOfVehicles: 1,
                        vehicle: "",
                        driver: "",
                        manualCost: "",
                        remark:""
                      }
                    ]);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Add
                </button>
              </td>

              <td className="text-center">
  <button
    onClick={() => {
      const updated = [...driverRows];

      updated[index] = {
                        dutySlipNo: "",
                        supplier: "",
                        noOfVehicles: 1,
                        vehicle: "",
                        driver: "",
                        manualCost: "",
                        remark:""
      };

      setDriverRows(updated);
    }}
    className="bg-red-500 text-white px-2 py-1 rounded"
  >
    Reset
  </button>
</td>
              
               
               
            </tr>
          ))}
        </tbody>
      </table>


 <div className="mt-8 border-t pt-4">

            {driverRows.map((row, index) => (
        <div key={index} className=" w-150 p-3 mt-3 rounded">
          
          <div className="font-semibold mb-2">
            Notes 
          </div>

          <textarea
            className="border p-2 w-150  dark:bg-black rounded"
            value={row.remark ?? ""}
            onChange={(e) => {
              const updated = [...driverRows];
              updated[index].remark = e.target.value;
              setDriverRows(updated);
            }}
            placeholder="Enter notes..."
          />
        </div>
      ))}

  <div className="grid grid-cols-1 ml-280  md:grid-cols-3 gap-4 items-end">

    {/* Buttons */}
    <div className="flex gap-3 justify-end">
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>

      <button
        onClick={() => setIsDriverModalOpen(false)}
        className="bg-gray-400 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>

  </div>
</div>


    </div>
  </div>
)}

{isGuideModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-black w-[95vw] max-w-[1000px] h-[65vh] overflow-y-auto rounded-xl p-6 shadow-2xl">

      {/* HEADER */}

      <div className="flex justify-between dark:bg-black items-center mb-4">
        <h2 className="text-lg font-bold text-green-600">
          Guide Allotment
        </h2>
<button
  onClick={() => setIsGuideModalOpen(false)}
  className="
    flex items-center justify-center
    w-9 h-9 rounded-full
    text-gray-500 dark:text-gray-400
    hover:bg-gray-100 dark:hover:bg-zinc-800
    hover:text-black dark:hover:text-white
    transition
  "
>
  <X className="w-5 h-5" />
</button>
 
      </div>
            <div className="bg-gray-100 dark:bg-[#0B0B0B] p-4 rounded mb-6">
  <p>
    Total Guide Required :{" "}
    <b>
      {jobs.find(j => j.id === selectedJobId)?.noOfGuide || 0}
    </b>
  </p>

  <p>
    Language Required :{" "}
    <b>
      {jobs.find(j => j.id === selectedJobId)?.guideLanguage || "-"}
    </b>
  </p>

  <p>
    Total Pax :{" "}
    <b>
      {jobs.find(j => j.id === selectedJobId)?.pax || 0}
    </b>
  </p>
</div>

      {/* BODY WILL COME NEXT STEP */}
      <table className="w-full dark:bg-[#0B0B0B] text-sm border">
  <thead className="dark:bg-[#0B0B0B] bg-gray-200">
    <tr>
      <th>Duty Slip</th>
      <th>Supplier</th>
      <th>No. of Guide</th>
      <th>Guide</th>
      <th>Guide Language</th>
      <th>Extra Charge</th>
      <th>Add</th>
      <th>Reset</th>
    </tr>
  </thead>

  <tbody>
    {guideRows.map((row, index) => (
      <tr key={index} className="border-t">

        <td className="p-2">
          {row.dutySlipNo || "-"}
        </td>

                      {/* Supplier */}
              <td>
                <select
                  value={row.supplier ?? ""}
                  onChange={(e) =>
  handleGuideChange(index, "supplier", Number(e.target.value))
}
                  className="border p-1 dark:bg-black rounded w-full"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>

<td>
  <input
    type="number"
    min="0"
    className="border dark:bg-black p-1 w-full"
    value={row.noOfGuide}
    onChange={(e) => {
      const updated = [...guideRows];
      updated[index].noOfGuide = Number(e.target.value);
      setGuideRows(updated);
    }}
  />
</td>

        <td>
<select
  disabled={row.noOfGuide === 0}
  className="border dark:bg-black p-1 w-full"
value={row.guide ?? ""}
  onChange={(e) => {
    const updated = [...guideRows];
   updated[index].guide = Number(e.target.value);
    setGuideRows(updated);
  }}
>
           <option value="">Select Guide</option>

{tourGuides.map((g: any) => (
  <option key={g.id} value={g.id}>
    {g.name}
  </option>
))}
          </select>
        </td>

        <td>
<select
  disabled={row.noOfGuide === 0}
  className="border dark:bg-black p-1 w-full"
value={row.language ?? ""}
  onChange={(e) => {
    const updated = [...guideRows];
    updated[index].language = Number(e.target.value);
    setGuideRows(updated);
  }}
>
<option value="">Select Language</option>

{languages.map((l: any) => (
  <option key={l.id} value={l.id}>
    {l.name}
  </option>
))}
          </select>
        </td>

        <td>
          <input
            type="number"
            className="border dark:bg-black p-1 w-full"
            value={row.extraCharge}
            onChange={(e) => {
              const updated = [...guideRows];
              updated[index].extraCharge = e.target.value;
              setGuideRows(updated);
            }}
          />
        </td>

        <td className="text-center">
          <button
            onClick={() =>
              setGuideRows([
                ...guideRows,
                {
                  dutySlipNo: "",
                   supplier: "",
                  guide: "",
                    noOfGuide: 1,
                  language: "",
                  extraCharge: ""
                }
              ])
            }
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Add
          </button>
        </td>

        <td className="text-center">
  <button
    onClick={() => {
      const updated = [...guideRows];

      updated[index] = {
        dutySlipNo: "",
        supplier: "",
        guide: "",
        noOfGuide: 0,
        language: "",
        extraCharge: ""
      };

      setGuideRows(updated);
    }}
    className="bg-red-500 text-white px-2 py-1 rounded"
  >
    Reset
  </button>
</td>

      </tr>
    ))}
  </tbody>
</table>
<div className="flex justify-end gap-3 mt-6">

  <button
  onClick={handleSaveGuide}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Save
</button>
  <button
    onClick={() => setIsGuideModalOpen(false)}
    className="bg-gray-400 text-white px-4 py-2 rounded"
  >
    Close
  </button>


</div>

    </div>
  </div>
)}
    </div>
    
  );
}


