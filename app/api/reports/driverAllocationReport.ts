import { Request, Response } from "express";
import pool from "@/lib/db"; // pg pool

export const getDriverAllocationReport = async (req: Request, res: Response) => {
  try {
    const { date, driverType, driverId } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date required" });
    }

    // ============================
    // ALLOCATED DRIVERS QUERY
    // ============================

    const allocatedQuery = `
      SELECT 
        d.id as driver_id,
        d.name as driver_name,
        d.phone,
        d.supplier_type,

        j.service_type,
        j.client,
        j.external_booking_id,
        j.scheduled_start_time,

        pl.name as pickup_location,
        dl.name as drop_location,

        v.registration_number

      FROM driver_allocation_lookup_driver_allocation_table da

      JOIN drivers_lookup_drivers_table d
        ON d.id = da.driver_id

      JOIN operation_jobs_lookup_operation_jobs_table j
        ON j.id = da.job_id

      LEFT JOIN vehicles_lookup_vehicles_table v
        ON v.id = da.vehicle_id

      LEFT JOIN location_master_lookup_location_master_table pl
        ON pl.id = j.pickup_location_id

      LEFT JOIN location_master_lookup_location_master_table dl
        ON dl.id = j.dropoff_location_id

      WHERE DATE(j.scheduled_start_time) = $1
      AND d.is_active = true
      ${driverType ? "AND d.supplier_type = $2" : ""}
      ${driverId ? `AND d.id = $${driverType ? 3 : 2}` : ""}

      ORDER BY d.name , j.scheduled_start_time
    `;

    const params: any[] = [date];
    if (driverType) params.push(driverType);
    if (driverId) params.push(driverId);

    const allocatedResult = await pool.query(allocatedQuery, params);

    // ============================
    // GROUPING
    // ============================

    const grouped: any = {};

    allocatedResult.rows.forEach((r) => {
      if (!grouped[r.driver_id]) {
        grouped[r.driver_id] = {
          driverId: r.driver_id,
          driverName: r.driver_name,
          phone: r.phone,
          supplierType: r.supplier_type,
          duties: [],
        };
      }

      grouped[r.driver_id].duties.push({
        program: r.service_type,
        client: r.client,
        bookingCode: r.external_booking_id,
        pickup: r.pickup_location,
        drop: r.drop_location,
        time: r.scheduled_start_time,
        vehicleNo: r.registration_number,
      });
    });

    const allocatedDrivers = Object.values(grouped);

    // ============================
    // FREE DRIVERS
    // ============================

    const freeDriversQuery = `
      SELECT d.id, d.name
      FROM drivers_lookup_drivers_table d
      WHERE d.is_active = true
      ${driverType ? "AND d.supplier_type = $1" : ""}
      AND d.id NOT IN (
          SELECT da.driver_id
          FROM driver_allocation_lookup_driver_allocation_table da
          JOIN operation_jobs_lookup_operation_jobs_table j
          ON j.id = da.job_id
          WHERE DATE(j.scheduled_start_time) = $${driverType ? 2 : 1}
      )
      ORDER BY d.name
    `;

    const freeParams: any[] = [];
    if (driverType) freeParams.push(driverType);
    freeParams.push(date);

    const freeDriversResult = await pool.query(freeDriversQuery, freeParams);

    return res.json({
      success: true,
      allocatedDrivers,
      freeDrivers: freeDriversResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};