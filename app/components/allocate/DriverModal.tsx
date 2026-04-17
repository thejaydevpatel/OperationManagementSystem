"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

type Vehicle = {
  id: number;
  name: string;
  supplier_id: number;
};

export default function DriverModal({
  open,
  onClose,
  jobId,
  bookingId,
  refreshJobs,
  drivers,
  vehicles,
  suppliers,
  jobs,
}: any) {
  const [driverRows, setDriverRows] = useState<any[]>([]);

  // ✅ Fetch driver allocation
  useEffect(() => {
    if (!jobId) return;

    fetch(`/api/duties/driver-allocation?jobId=${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setDriverRows(data);
        } else {
          setDriverRows([
            {
              dutySlipNo: "",
              supplier: "",
              noOfVehicles: 1,
              vehicle: "",
              driver: "",
              manualCost: "",
              remark: "",
            },
          ]);
        }
      })
      .catch(() => toast.error("Failed to load driver data"));
  }, [jobId]);

  // ✅ Handle change
  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...driverRows];
    updated[index][field] = value;

    if (field === "vehicle") {
      const selectedVehicle = vehicles.find(
        (v: Vehicle) => String(v.id) === String(value)
      );
      updated[index].supplier = selectedVehicle?.supplier_id || "";
    }

    setDriverRows(updated);
  };

  // ✅ Save
  const handleSave = async () => {
    try {
      const validRows = driverRows.filter(
        (r) => r.driver && r.vehicle
      );

      const res = await fetch("/api/duties/driver-allocation/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          rows: validRows,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Driver Saved Successfully ✅");
        onClose();

        // refresh jobs
        fetch(`/api/duties?fileNo=${bookingId}`)
          .then((res) => res.json())
          .then(refreshJobs);
      } else {
        toast.error("Save Failed ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving driver data");
    }
  };

  if (!open) return null;

  const selectedJob = jobs.find((j: any) => j.id === jobId);

  return (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-black  w-[95vw] max-w-[1200px] h-[80vh]  overflow-y-auto rounded-xl p-6 shadow-2xl">

      {/* HEADER */}
      
      <div className="flex justify-between dark:bg-black items-center mb-4">
         <h2 className="text-lg font-bold text-blue-600">
          Driver Allotment
        </h2>
        
<button onClick={onClose}>
  <X className="w-5 h-5" />
</button>

       
      </div>

      {/* INFO BOXES */}
      <div className="grid  grid-cols-2 gap-4 mb-10">

        {/* BOX 1 */}
        <div className="bg-gray-100 p-4  dark:bg-[#0B0B0B] rounded">
          <p>Total vehicle to assign: <b>{jobs.find(j => j.id === jobId)?.noOfVehicle ?? 1}</b></p>
          <p>Vehicle type: <b>{jobs.find(j => j.id === jobId)?.vehicleType || "-"}</b></p>
          <p>Total allotment vehicles: <b>{driverRows.length || "-"}</b></p>
        </div>

        {/* BOX 2 */}
        <div className="bg-gray-100  dark:bg-[#0B0B0B] p-4 rounded">
          <p>Total pax: <b>{jobs.find(j => j.id === jobId)?.pax || 0}</b></p>
          <p>Guide details: <b>{jobs.find(j => j.id === jobId)?.guideName || "NA"}</b></p>
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
  onClick={onClose}
  className="bg-gray-400 text-white px-4 py-2 rounded"
>
  Close
</button>
    </div>

  </div>
</div>


    </div>
  </div>
  );
}