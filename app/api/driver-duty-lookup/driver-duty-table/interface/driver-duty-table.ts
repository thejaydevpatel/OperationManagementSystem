export interface DriverDutyTableEntity {
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
  driver_id: number;
  duty_start_time: string;
  duty_end_time?: string;
  total_hours?: string;
  status_id: number;
  notes?: string;
}
