"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaUserTie, FaUserAlt  } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"

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
        manualCost: ""
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

  // ✅ AUTO SET SUPPLIER
  if (field === "vehicle") {
    const selectedVehicle = vehicles.find((v: any) => v.id == value);
    if (selectedVehicle) {
      updated[index].supplier = selectedVehicle.supplier_id;
    }
  }

  setDriverRows(updated);
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
      alert("Saved Successfully ✅");
      setIsDriverModalOpen(false);
    } else {
      alert("Save Failed ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Error saving data");
  }
};

const handleSaveGuide = async () => {
  try {

    // ✅ only save valid rows
    const validRows = guideRows.filter(
      (r) => r.noOfGuide > 0 && r.guide && r.language
    );

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
  .then(setVehicles)
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
 

        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2 my-5">
            <LayoutDashboard size={16} />
            Dashboard
          </Button>
        </Link>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Allocate / Modify
        </h1>
        <p className="text-gray-500">
          Booking No: {bookingId}
        </p>
      </div>

    {/* Two Boxes Side by Side */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mr-200">

      {/* Driver Box */}
      <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500">
        <h2 className="text-lg font-semibold text-blue-600">
          👨‍✈️ Driver Allotment
        </h2>
      </div>

      {/* Guide Box */}
      <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-green-500">
        <h2 className="text-lg font-semibold text-green-600">
          🧑‍🏫 Guide Allotment
        </h2>
      </div>

    </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        
        <table className="w-full text-sm text-left">
          
          <thead className="bg-gray-100 text-gray-600  ">
            <tr>
              <th className="text-center p-3">Sr</th>
              <th className="text-center">Date</th>
              <th className="text-center">Time</th>
              <th className="text-center">From Location</th>
              <th className="text-center">To Location</th>
              {/* <th className="text-center">Vehicle Name</th> */}
              <th className="text-center">Vehicle Type</th>
              <th className="text-center">No. Vehicles</th>
                            <th className="text-center">Service Type</th>
              <th className="text-center">No Of Pax</th>
              <th className="text-center">No Of Guide</th>
              <th className="text-center">Guide Language</th>
              <th className="text-center">Vehicle Price</th>
              <th className="text-center">Guide Price</th>
              <th className="text-center"></th>
              <th className="text-center"></th>
              <th className="text-center"></th>
              <th className="text-center"></th>
            </tr>
          </thead>

          <tbody>
            {sortedJobs.map((job, index) => (
              <tr key={job.id} className="border-t hover:bg-gray-50">

                <td className="text-center p-3">{index + 1}</td>
                <td className="text-center">{job.date}</td>
                <td className="text-center">{job.pickupTime || "-"}</td>
                <td className="text-center">{job.pickupLocation || "-"}</td>
                <td className="text-center">{job.dropLocation || "-"}</td>
                {/* <td className="text-center">{job.vehicleName || "-"}</td> */}
                <td className="text-center">{job.vehicleType || "-"}</td>
                <td className="text-center">{job.noOfVehicle || 1}</td>
                                <td className="text-center">{job.service_type || "-"}</td>
                <td className="text-center">{job.pax || 0}</td>

                <td className="text-center">{job.noOfGuide || 0}</td>
                <td className="text-center">{job.guideLanguage || "-"}</td>

                <td className="text-center">₹ {job.vehiclePrice || 0}</td>
                <td className="text-center">₹ {job.guidePrice || 0}</td>

                {/* Driver Allocation */}
                <td className="text-center">
<button 
    onClick={() => handleOpenDriverModal(job.id)}
    className="bg-blue-200 text-white cursor-pointer p-2 rounded-full hover:bg-blue-700 transition">
    👨‍✈️
</button>
                </td>

                {/* Guide Allocation */}
                <td className="text-center">
<button 
    onClick={() => handleOpenGuideModal(job.id)}
    className="bg-green-200 text-white cursor-pointer p-2 rounded-full hover:bg-green-700 transition">
    🧑‍🏫
</button>
                </td>

                {/* Status */}
<td className="text-center">
  <span
    className={`px-2 py-1 text-xs rounded-full font-medium ${
      job.driverName
        ? "text-green-700"
        : "text-red-600"
    }`}
  >
    {job.driverName ? "Driver Assigned" : "Driver Pending"}
  </span>
</td>

<td className="text-center">
  <span
    className={`px-2 py-1 text-xs rounded-full font-medium ${
      job.guideName
        ? "text-green-700"
        : "text-red-600"
    }`}
  >
    {job.guideName ? "Guide Assigned" : "Guide Pending"}
  </span>
</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>


{isDriverModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center pt-10 items-center z-50">
    <div className="bg-white  w-[95vw] max-w-[1200px] h-[90vh]  overflow-y-auto rounded-xl p-6 shadow-2xl">

      {/* HEADER */}
      
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-lg font-bold text-blue-600">
          Driver Allotment
        </h2>
        
        <button
          onClick={() => setIsDriverModalOpen(false)}
          className="text-red-500 text-xl"
        >
          ✖
        </button>

       
      </div>

      {/* INFO BOXES */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* BOX 1 */}
        <div className="bg-gray-100 p-4 rounded">
          <p>Total vehicle to assign: <b>{jobs.find(j => j.id === selectedJobId)?.noOfVehicle ?? 1}</b></p>
          <p>Vehicle type: <b>{jobs.find(j => j.id === selectedJobId)?.vehicleType || "-"}</b></p>
          <p>Total allotment vehicles: <b>{driverRows.length || "-"}</b></p>
        </div>

        {/* BOX 2 */}
        <div className="bg-gray-100 p-4 rounded">
          <p>Total pax: <b>{jobs.find(j => j.id === selectedJobId)?.pax || 0}</b></p>
          <p>Guide details: <b>{jobs.find(j => j.id === selectedJobId)?.guideName || "NA"}</b></p>
        </div>

      </div>

      {/* TABLE */}
      <table className="w-full text-sm border">
        <thead className="bg-gray-200">
          <tr>
            <th>Duty Slip</th>
            <th>Supplier</th>
            <th>No. Vehicles</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Manual Cost</th>
            <th>Add</th>
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
  value={row.supplier || ""}
  onChange={(e) =>
    handleChange(index, "supplier", e.target.value)
  }
  className="border p-1 rounded w-full"
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
  className="border p-1 w-full"
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
  value={row.vehicle}
  onChange={(e) =>
    handleChange(index, "vehicle", e.target.value)
  }
  className="border p-1 rounded w-full"
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
  className="border p-1 rounded w-full"
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
                        manualCost: ""
                      }
                    ]);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Add
                </button>
              </td>
              

            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSave} 
          className="bg-blue-600 text-white px-4 py-2 rounded">
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
)}

{isGuideModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center pt-10 items-center z-50">
    <div className="bg-white w-[95vw] max-w-[1000px] h-[85vh] overflow-y-auto rounded-xl p-6 shadow-2xl">

      {/* HEADER */}
      <div className="bg-gray-100 p-4 rounded mb-6">
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-green-600">
          Guide Allotment
        </h2>

        <button
          onClick={() => setIsGuideModalOpen(false)}
          className="text-red-500 text-xl"
        >
          ✖
        </button>
      </div>

      {/* BODY WILL COME NEXT STEP */}
      <table className="w-full text-sm border">
  <thead className="bg-gray-200">
    <tr>
      <th>Duty Slip</th>
      <th>No. of Guide</th>
      <th>Guide</th>
      <th>Guide Language</th>
      <th>Extra Charge</th>
      <th>Add</th>
    </tr>
  </thead>

  <tbody>
    {guideRows.map((row, index) => (
      <tr key={index} className="border-t">

        <td className="p-2">
          {row.dutySlipNo || "-"}
        </td>

<td>
  <input
    type="number"
    min="0"
    className="border p-1 w-full"
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
  className="border p-1 w-full"
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
  className="border p-1 w-full"
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
            className="border p-1 w-full"
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

      </tr>
    ))}
  </tbody>
</table>
<div className="flex justify-end gap-3 mt-6">
  <button
    onClick={() => setIsGuideModalOpen(false)}
    className="bg-gray-400 text-white px-4 py-2 rounded"
  >
    Close
  </button>

<button
  onClick={handleSaveGuide}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Save
</button>
</div>

    </div>
  </div>
)}
    </div>
    
  );
}


