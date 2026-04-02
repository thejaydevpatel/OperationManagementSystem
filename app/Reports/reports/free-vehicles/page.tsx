"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { File } from "lucide-react"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function FreeVehiclePage() {

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    setLoading(true);

    const res = await fetch("/api/free-vehicles");
    const data = await res.json();

    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="p-6">

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
    <h2 className=" ml-170 mb-10 item-center text-2xl"><b> Free Vehicles  </b></h2>
  </div>
      <Card>
        <CardContent className="p-0 overflow-auto">

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No free vehicles found
            </div>
          ) : (

            <table className="w-full text-sm">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Sr</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Registration</th>
                  <th className="p-3">Capacity</th>
                </tr>
              </thead>

              <tbody>

                {rows.map((v: any, index: number) => (
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