export interface GuideAllocationTableEntity {
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
  guide_id: number;
  allocation_status_id: number;
  report_time?: string;
  actual_start_time?: string;
  actual_end_time?: string;
}
