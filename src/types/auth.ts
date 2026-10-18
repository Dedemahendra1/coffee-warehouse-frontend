export interface Role {
    id: number;
    name: string;
    users_web_count: number;
  }
  
  export interface CreateRolePayload {
    name: string;
  }
  
  export interface UpdateRolePayload {
    id: number;
    name: string;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    photo: string;
    phone: string;
    roles?: string[];
    token?: string;
    outlet: import("./outlet").Outlet;
    merchant_id?: number | null;
    merchant?: import("./outlet").Outlet | null;
    assigned_merchant?: import("./outlet").Outlet | null;
  }

  export interface CreateUserPayload {
    name: string;
    phone: string;
    email: string;
    password: string;
    password_confirmation: string;
    photo: File;
    role?: string;
    merchant_id?: number | null;
  } 