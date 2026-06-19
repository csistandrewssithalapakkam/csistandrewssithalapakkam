export interface AdminUser {
  user_id: number;
  user_name: string;
  user_email: string;
  first_name: string;
  last_name: string;
  mobile_number?: string;
  user_active: number;
}

export interface Role {
  user_role_id: number;
  user_role_name: string;
  user_role_desc?: string;
  user_role_active: number;
}

export interface Page {
  page_id: number;
  page_name: string;
  page_slug: string;
  page_icon?: string;
  parent_id?: number | null;
  sort_order?: number;
  submenus?: Page[];
}

export interface PageAccess {
  page_id: number;
  page_name: string;
  page_slug: string;
  has_access?: boolean; // present in getUserPageAccess (admin view), absent in getMyPageAccess
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface PageAccessAssignment {
  page_id: number;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}
