"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, File } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FreeDriversPage() {

  const [drivers, setDrivers] = useState<any[]>([]);
  const [driverTypes, setDriverTypes] = useState<any[]>([]);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // ✅ default today
  );
  const [driverType, setDriverType] = useState("");
  const [driver, setDriver] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= FETCH =================

  const fetchFreeDrivers = async () => {
    setLoading(true);

    const res = await fetch(
      `/api/free-drivers?date=${date}&driverType=${driverType}&driver=${driver}`
    );
    const data = await res.json();

    setDrivers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchDriverTypes = async () => {
    const res = await fetch("/api/driver-types");
    const data = await res.json();
    setDriverTypes(data || []);
  };

  useEffect(() => {
    fetchDriverTypes();
    fetchFreeDrivers();
  }, []);

  // ================= SEARCH =================

  const search = () => {
    fetchFreeDrivers();
  };

  // ================= UI =================

  return (
    <div className="p-6 space-y-6"> 

      <h2 className="text-center text-2xl font-bold">Free Drivers</h2>

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


            {/* DRIVER */}
            <div>
              <label className="text-sm font-medium">Drivers</label>
              <select
                className="border h-10 rounded w-full px-2"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
              >
                <option value="">All Drivers</option>

                {drivers.map((d: any) => (
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

      <Card>
        <CardContent className="p-0 overflow-auto">

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No free drivers found
            </div>
          ) : (
            <table className="w-full text-sm">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Sr</th>
                  <th className="p-3 text-left">Driver Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Program</th>
                  <th className="p-3 text-left">Client Name</th>
                  <th className="p-3 text-left">Pickup Location</th>
                  <th className="p-3 text-left">Drop Off Location</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Vehicle No</th>
                  <th className="p-3 text-left">Duty Slip No</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map((d: any, index: number) => (
                  <tr key={d.id} className="border-b hover:bg-muted/40">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.phone}</td>
                    <td className="p-3">NA</td>
                    <td className="p-3">NA</td>
                    <td className="p-3">NA</td>
                    <td className="p-3">NA</td>
                    <td className="p-3">NA</td>
                    <td className="p-3">NA</td>
                    <td className="p-3">NA</td>
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