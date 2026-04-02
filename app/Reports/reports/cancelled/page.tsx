"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, File } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CancelledDutiesPage() {

  const [rows,setRows] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);

  const load = async ()=>{

    setLoading(true);

    const res = await fetch(`/api/cancelled-duties`);

    const data = await res.json();

    setRows(Array.isArray(data)?data:[]);
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const print = ()=>window.print();

  return (

    <div className="p-6 space-y-6">

      <div className="flex items-center gap-3 my-5">
        <Label>Back to Reports : </Label>
        <Link href="/Reports/reports">
          <Button variant="outline" className="flex items-center gap-2">
            <File size={16}/>
            Reports
          </Button>
        </Link>
      </div>
  <div >
    <h2 className=" ml-170 item-center text-2xl"><b>Cancelled Bokkings </b></h2>
  </div>
      <Card>
        <CardContent className="p-0 overflow-auto">

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin"/>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No cancelled duties found
            </div>
          ) : (

            <table className="w-full text-sm">

              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-3">Sr</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Pickup</th>
                  <th className="p-3">Drop</th>
                  <th className="p-3">Duty</th>
                </tr>
              </thead>

              <tbody>

                {rows.map((r:any,index:number)=>(
                  <tr key={r.id} className="border-b hover:bg-muted/40">
                    <td className="p-3">{index+1}</td>
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">{r.client}</td>
                    <td className="p-3">{r.service_type}</td>
                    <td className="p-3">{r.supplier}</td>
                    <td className="p-3">{r.vehicle}</td>
                    <td className="p-3">{r.pickup}</td>
                    <td className="p-3">{r.drop}</td>
                    <td className="p-3">{r.dutySlip || "-"}</td>
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