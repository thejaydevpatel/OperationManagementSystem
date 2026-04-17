"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function DutyTable({
  data,
  loading,
  handlePrintRow,
}: any) {
  return (
<div id="print-section">
<Card>
  <CardHeader>
    <CardTitle>Duty Chart Details</CardTitle>
  </CardHeader>

  <CardContent>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <Table>

        <TableHeader>
          <TableRow className=" mt-20 bg-muted border-b border-border">
            <TableHead>Sr No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>File Details</TableHead>
            <TableHead>Service Details</TableHead>
            <TableHead>Vehicle Driver Details</TableHead>
            <TableHead>Pickup / Reporting</TableHead>
            <TableHead>Drop</TableHead>
            <TableHead>Print</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((row: any, i: number) => (
              <TableRow key={i}>

                <TableCell>{i + 1}</TableCell>

                <TableCell>{row.date || "-"}</TableCell>

                <TableCell>
                  <div><b>Booking:</b> {row.bookingId || "-"}</div>
                  <div><b>PAX:</b> {row.pax || "-"}</div>
                  <div><b>Client Name:</b> {row.client || "-"}</div>
                  <div><b>Agent Name:</b> {row.agent || "-"}</div>
                  <div><b>Remark:</b> {row.remark || "-"}</div>
                  <div><b>Address Details:</b> {row.address || "-"}</div>
                  <div><b>Guide:</b> {row.noOfGuide || "-"}</div>
                </TableCell>

                <TableCell>
                  <div><b>Date:</b> {row.date || "-"}</div>
                  <div><b>Activity:</b> {row.service_type || "-"}</div>
                  <div><b>VH Type:</b> {row.vehicleType || "-"}</div>
                  <div><b>No.Of Vehicles:</b> {row.noOfVehicle || "1"}</div>
                </TableCell>

                <TableCell>
                  <div><b>Duty Slip No.:</b> {row.dutySlipNo || "-"}</div>
                  <div><b>Registration Number:</b> {row.registrationNumber || "-"}</div>
                  <div><b>Driver Name:</b> {row.driverName || "Not Assigned"}</div>
                  <div><b>Guide Name:</b> {row.guideName || "-"}</div>
                </TableCell>

                <TableCell>
                  <div><b>Location:</b> {row.pickupLocation || "-"}</div>
                  <div><b>Report:</b> {row.reportingTime || "-"}</div>
                  <div><b>Pickup:</b> {row.pickupTime || "-"}</div>
                </TableCell>

                <TableCell>
                  {row.dropLocation || "-"}
                </TableCell>

                <TableCell> 
                  <Button
                    variant="ghost"
                    onClick={() => handlePrintRow(row)}
                  >
                    Print
                  </Button>
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>No Data Found</TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
    )}
  </CardContent>
</Card>
</div>
  );
}