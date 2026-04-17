export interface PagesEntity {
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
  module_name: number;
  page_name: string;
  page_url: string;
  icon: string;
}
