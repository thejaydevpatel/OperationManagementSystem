export interface JobRoutePointsTableEntity {
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
  job_id: number;
  order_no: number;
  location_id: number;
  stop_type: string;
  eta?: string;
  actual_arrival?: string;
  actual_departure?: string;
  status_id?: number;
  notes?: string;
}
