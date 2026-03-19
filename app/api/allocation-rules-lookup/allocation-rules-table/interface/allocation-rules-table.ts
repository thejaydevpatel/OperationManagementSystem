export interface AllocationRulesTableEntity {
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
  rule_key: string;
  rule_name: string;
  rule_type: string;
  rule_value: string;
  scope_type: string;
  scope_value?: string;
  priority: number;
  effective_from?: string;
  effective_to?: string;
}
