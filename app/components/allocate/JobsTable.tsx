"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

export default function JobsTable({
  jobs,
  onDriverClick,
  onGuideClick,
}: any) {
  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sr</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedJobs.map((job: any, index: number) => (
          <TableRow key={job.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{job.date}</TableCell>
            <TableCell>{job.pickupTime}</TableCell>
            <TableCell>{job.pickupLocation}</TableCell>
            <TableCell>{job.dropLocation}</TableCell>
            <TableCell>{job.vehicleType}</TableCell>

            <TableCell>
              <Button onClick={() => onDriverClick(job.id)}>
                👨‍✈️
              </Button>
            </TableCell>

            <TableCell>
              <Button onClick={() => onGuideClick(job.id)}>
                🧑‍🏫
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}