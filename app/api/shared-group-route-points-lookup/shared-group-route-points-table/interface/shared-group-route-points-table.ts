export interface SharedGroupRoutePointsTableEntity {
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
  order_no: number;
  locarion_id: number;
  stop_type: string;
  eta?: string;
  actual_arrival?: string;
  actual_departure?: string;
  status_id?: number;
  notes?: string;
}
