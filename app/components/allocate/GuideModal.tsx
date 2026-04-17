"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function GuideModal({
  open,
  onClose,
  jobId,
  bookingId,
  refreshJobs,
  suppliers,
  tourGuides,
  languages,
  jobs,
}: any) {
  const [guideRows, setGuideRows] = useState<any[]>([]);

  // ✅ Fetch guide allocation
  useEffect(() => {
    if (!jobId) return;

    fetch(`/api/duties/guide-allocation?jobId=${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGuideRows(data);
        } else {
          setGuideRows([
            {
              dutySlipNo: "",
              supplier: "",
              noOfGuide: 1,
              guide: "",
              language: "",
              extraCharge: "",
            },
          ]);
        }
      })
      .catch(() => toast.error("Failed to load guide data"));
  }, [jobId]);

  // ✅ Handle change
  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...guideRows];
    updated[index][field] = value;
    setGuideRows(updated);
  };

  // ✅ Save
  const handleSave = async () => {
    try {
      const validRows = guideRows.filter(
        (r) => r.noOfGuide > 0 && r.guide && r.language && r.supplier
      );

      const res = await fetch("/api/duties/guide-allocation/save", {
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
        toast.success("Guide Saved Successfully ✅");
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
      toast.error("Error saving guide data");
    }
  };

  if (!open) return null;

  const selectedJob = jobs.find((j: any) => j.id === jobId);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-black w-[95vw] max-w-[1000px] h-[65vh] overflow-y-auto rounded-xl p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-green-600">
            Guide Allotment
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* INFO */}
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p>
            Total Guide Required: <b>1</b>
          </p>

          <p>
            Language Required:{" "}
            <b>{selectedJob?.guideLanguage || "-"}</b>
          </p>

          <p>
            Total Pax: <b>{selectedJob?.pax || 0}</b>
          </p>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm border">
          <thead className="bg-gray-200">
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
                      handleChange(index, "supplier", Number(e.target.value))
                    }
                    className="border p-1 w-full"
                  >
                    <option value="">Select</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* No of Guide */}
                <td>
                  <input
                    type="number"
                    value={row.noOfGuide}
                    min="0"
                    className="border p-1 w-full"
                    onChange={(e) =>
                      handleChange(index, "noOfGuide", Number(e.target.value))
                    }
                  />
                </td>

                {/* Guide */}
                <td>
                  <select
                    value={row.guide ?? ""}
                    disabled={row.noOfGuide === 0}
                    onChange={(e) =>
                      handleChange(index, "guide", Number(e.target.value))
                    }
                    className="border p-1 w-full"
                  >
                    <option value="">Select</option>
                    {tourGuides.map((g: any) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Language */}
                <td>
                  <select
                    value={row.language ?? ""}
                    disabled={row.noOfGuide === 0}
                    onChange={(e) =>
                      handleChange(index, "language", Number(e.target.value))
                    }
                    className="border p-1 w-full"
                  >
                    <option value="">Select</option>
                    {languages.map((l: any) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Extra Charge */}
                <td>
                  <input
                    type="number"
                    value={row.extraCharge || ""}
                    className="border p-1 w-full"
                    onChange={(e) =>
                      handleChange(index, "extraCharge", e.target.value)
                    }
                  />
                </td>

                {/* Add */}
                <td>
                  <button
                    onClick={() =>
                      setGuideRows([
                        ...guideRows,
                        {
                          dutySlipNo: "",
                          supplier: "",
                          noOfGuide: 1,
                          guide: "",
                          language: "",
                          extraCharge: "",
                        },
                      ])
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Add
                  </button>
                </td>

                {/* Reset */}
                <td>
                  <button
                    onClick={() => {
                      const updated = [...guideRows];
                      updated[index] = {
                        dutySlipNo: "",
                        supplier: "",
                        noOfGuide: 0,
                        guide: "",
                        language: "",
                        extraCharge: "",
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

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
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
  );
}