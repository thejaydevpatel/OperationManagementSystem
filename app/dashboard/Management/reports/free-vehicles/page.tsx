"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, File } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FreeVehiclePage() {

  const [rows, setRows] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [vehicle, setVehicle] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [openVehicle, setOpenVehicle] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ================= FETCH =================

  const fetchVehicles = async (
    selectedVehicle: string = vehicle,
    selectedDate: string = date
  ) => {

    setLoading(true);

    const params = new URLSearchParams();

    if (selectedDate) {
      params.append("date", selectedDate);
    }

    const res = await fetch(`/api/free-vehicles?${params.toString()}`);
    const data = await res.json();

    const list = Array.isArray(data) ? data : [];

    setRows(list);

    // build dropdown list
    const uniqueVehicles = list.map((v: any) => ({
      id: v.id,
      name: v.name || v.registration_number || `Vehicle ${v.id}`,
    }));

    setVehicles(uniqueVehicles);

    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
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

  // ================= FILTER TABLE =================

  const filteredRows = useMemo(() => {
    let temp = [...rows];

    if (vehicle) {
      temp = temp.filter(
        (r: any) => String(r.id) === String(vehicle)
      );
    }

    return temp;
  }, [rows, vehicle]);

  // ================= ACTIONS =================

  const search = () => {
    fetchVehicles(vehicle, date);
  };

  const print = () => window.print();

  // ================= UI =================

  return (
    <div className="p-6 space-y-6"> 
    
      <h2 className="text-center text-2xl font-bold">Free Vehicles</h2>

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

                    {filteredVehicles.length === 0 && (
                      <div className="p-3 text-gray-400 text-sm text-center">
                        No vehicles found
                      </div>
                    )}

                    {filteredVehicles.map((v: any) => (
                      <div
                        key={v.id}
                        className="p-2 text-sm hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setVehicle(v.id);
                          setVehicleSearch(v.name);
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
            <Button
              className="bg-green-600 hover:bg-green-700 ml-5 mr-5"
              onClick={search}
              >
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
          ) : filteredRows.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No free vehicles found
            </div>
          ) : (

            <table className="w-full text-sm">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Sr</th>
                  <th className="p-3 text-left">Vehicle</th>
                  <th className="p-3 text-left">Registration</th>
                  <th className="p-3 text-left">Capacity</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((v: any, index: number) => (
                  <tr key={v.id} className="border-b hover:bg-muted/40">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{v.name}</td>
                    <td className="p-3">{v.registration_number}</td>
                    <td className="p-3">{v.capacity}</td>
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