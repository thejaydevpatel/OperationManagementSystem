"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { File } from "lucide-react"
import { Label } from "@/components/ui/label";

import Link from "next/link";

export default function GuideReportPage() {

  const [rows, setRows] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState("");
  const [guide, setGuide] = useState("");
  const [guideSearch, setGuideSearch] = useState("");

  const [openGuide, setOpenGuide] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [appliedDate, setAppliedDate] = useState("");
const [appliedGuide, setAppliedGuide] = useState("");

  // ================= FETCH =================

  const fetchReport = async (
    selectedGuide: string = guide,
    selectedDate: string = date
  ) => {

    setLoading(true);

    const params = new URLSearchParams();

    if (selectedDate) {
      params.append("from", selectedDate);
      params.append("to", selectedDate);
    }

    if (selectedGuide) {
      params.append("guide", selectedGuide);
    }

    const res = await fetch(`/api/duties?${params.toString()}`);
    const data = await res.json();

    const safeData = Array.isArray(data) ? data : [];

    setRows(safeData);

    // BUILD GUIDE LIST
const uniqueGuides = Array.from(
  new Map(
    safeData
      .filter((r: any) => r?.guide_ids)
      .flatMap((r: any) => {

        const ids = String(r.guide_ids).split(",");
        const names = String(r.guideName).split(",");

        return ids.map((id: string, i: number) => [
          id.trim(),
          {
            id: id.trim(),
            name: names[i]?.trim() || `Guide ${id}`
          }
        ]);

      })
  ).values()
);

    setGuides(uniqueGuides);

    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // ================= OUTSIDE CLICK =================

  useEffect(() => {

    const handler = (e: any) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpenGuide(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);

  }, []);

  // ================= DROPDOWN FILTER =================

  const filteredGuides = useMemo(() => {

    return guides.filter((g: any) =>
      (g?.name || "")
        .toLowerCase()
        .includes((guideSearch || "").toLowerCase())
    );

  }, [guides, guideSearch]);

  // ================= ACTIONS =================

const search = () => {

  setAppliedDate(date);
  setAppliedGuide(guide);

  fetchReport(guide, date);

};

const reset = () => {

  setDate("");
  setGuide("");
  setGuideSearch("");

  setAppliedDate("");
  setAppliedGuide("");

  fetchReport("", "");

};

  const print = () => window.print();

  // ================= TABLE FILTER =================

const filteredAndSortedRows = useMemo(() => {

  let temp = [...rows];

  // ⭐ ONLY ROWS HAVING GUIDE + DUTY BOTH
  temp = temp.filter(
    (r: any) =>
      r?.guide_ids != null &&
      String(r.guide_ids).trim() !== "" &&
      r?.dutySlipNo != null &&
      String(r.dutySlipNo).trim() !== ""
  );

  // ⭐ DATE FILTER
  if (appliedDate) {
    temp = temp.filter(
      (r: any) =>
        r?.date &&
        new Date(r.date).toISOString().slice(0, 10) === appliedDate
    );
  }

  // ⭐ GUIDE FILTER
  if (appliedGuide) {
    temp = temp.filter(
      (r: any) =>
        String(r?.guide_ids || "").includes(String(appliedGuide))
    );
  }

  // ⭐ SORT
  temp.sort(
    (a, b) =>
      new Date(a?.date || 0).getTime() -
      new Date(b?.date || 0).getTime()
  );

  return temp;

}, [rows, appliedDate, appliedGuide]);

  // ================= UI =================

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
    <h2 className=" ml-170 item-center text-2xl"><b>Guides Report </b></h2>
  </div>
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

            {/* GUIDE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>

              <label className="text-sm font-medium">Guide</label>

              <div
                className="border h-10 rounded px-3 flex items-center justify-between cursor-pointer bg-white"
                onClick={() => setOpenGuide((v) => !v)}
              >
                <span className="text-sm">
                  {guideSearch || "All Guides"}
                </span>

                <span className="text-xs">▼</span>
              </div>

              {openGuide && (

                <div className="absolute w-full bg-white border shadow mt-1 z-50">

                  <div className="p-2 border-b">
                    <input
                      autoFocus
                      placeholder="Search guide..."
                      className="border h-9 rounded w-full px-2 text-sm"
                      value={guideSearch}
                      onChange={(e) => setGuideSearch(e.target.value)}
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto">

                    <div
                      className="p-2 text-sm hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setGuide("");
                        setGuideSearch("");
                        setOpenGuide(false);
                      }}
                    >
                      All Guides
                    </div>

                    {filteredGuides.length === 0 && (
                      <div className="p-3 text-gray-400 text-sm text-center">
                        No guides found
                      </div>
                    )}

                    {filteredGuides.map((g: any) => (
                      <div
                        key={g.id}
                        className="p-2 text-sm hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setGuide(g.id);
                          setGuideSearch(g.name);
                          setOpenGuide(false);
                        }}
                      >
                        {g.name}
                      </div>
                    ))}

                  </div>

                </div>

              )}

            </div>

            <Button className="bg-green-600 hover:bg-green-700" onClick={search}>
              Search
            </Button>

            <Button variant="outline" onClick={print}>
              Print
            </Button>

            {/* <Button variant="destructive" onClick={reset}>
              Reset
            </Button> */}

          </div>

        </CardContent>
      </Card>

      {/* TABLE */}

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
                  <th className="p-3">Guide</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Pickup</th>
                  <th className="p-3">Drop</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Duty</th>
                  <th className="p-3">Booking</th>
                </tr>
              </thead>

              <tbody>

                {filteredAndSortedRows.map((r: any, index: number) => (
                  <tr key={r.id} className="border-b hover:bg-muted/40">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{r.guideName}</td>
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">{r.service_type}</td>
                    <td className="p-3">{r.client}</td>
                    <td className="p-3">{r.pickupLocation}</td>
                    <td className="p-3">{r.dropLocation}</td>
                    <td className="p-3">{r.pickupTime}</td>
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