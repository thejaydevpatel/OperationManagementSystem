export interface SharedGroupJobsTableEntity {
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
  group_id: number;
  job_id: number;
  pax_assigned: number;
  pickup_order_no?: number;
  drop_order_no?: number;
  status_id?: number;
}
