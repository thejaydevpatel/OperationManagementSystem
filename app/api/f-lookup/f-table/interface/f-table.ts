export interface FTableEntity {
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
  vehicle_type_id: number;
  registration_number?: string;
  owner_type?: string;
  supplier_id?: number;
  vehicle_status_id?: number;
  additional_notes?: string;
}
