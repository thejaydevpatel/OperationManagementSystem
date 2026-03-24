export interface DriversTableEntity {
  is_used?: boolean;
  is_deleted?: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  host_ip?: string;
  url?: string;
  deleted_at?: string;
  deleted_by?: string;
  tenant_id?: string;
  id: number;
  name: string;
  phone: string;
  license_number: string;
  supplier_id?: number;
  driver_status_id: number;
  last_known_location_id?: number;
  last_duty_end_time?: string;
  max_daily_hours: number;
  note?: string;
}
