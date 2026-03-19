export interface TourGuidesTableEntity {
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
  language_id: number;
  supplier_id?: number;
  guide_status_id: number;
  notes?: string;
}
