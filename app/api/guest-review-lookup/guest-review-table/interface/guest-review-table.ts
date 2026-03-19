export interface GuestReviewTableEntity {
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
  review_target_type: string;
  review_target_id: number;
  rating: string;
  review_text?: string;
  guest_name?: string;
  guest_email?: string;
  is_anonymous: boolean;
  is_verified: boolean;
}
