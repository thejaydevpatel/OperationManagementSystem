"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { File } from "lucide-react"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FreeDriversPage() {

  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================

  const fetchFreeDrivers = async () => {

    setLoading(true);

    const res = await fetch("/api/free-drivers");
    const data = await res.json();

    setDrivers(Array.isArray(data) ? data : []);

    setLoading(false);
  };

  useEffect(() => {
    fetchFreeDrivers();
  }, []);

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
    <h2 className=" ml-170 item-center text-2xl"><b>Free-Drivers </b></h2>
  </div>

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
                  <th className="p-3">Sr</th>
                  <th className="p-3">Driver Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">License</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>

                {drivers.map((d: any, index: number) => (
                  <tr key={d.id} className="border-b hover:bg-muted/40">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.phone}</td>
                    <td className="p-3">{d.license_no}</td>
                    <td className="p-3">{d.status}</td>
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