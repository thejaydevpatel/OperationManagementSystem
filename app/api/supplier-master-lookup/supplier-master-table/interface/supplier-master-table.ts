export interface SupplierMasterTableEntity {
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
  supplier_type: number;
  name: string;
  service_type: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status_id: number;
}
