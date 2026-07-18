import { Product } from "./product";
import { User } from "./auth";

export interface Outlet {
  id: number;
  name: string;
  address: string;
  phone: string;
  photo: string;
  keeper_id: number;
  products: Product[];
  keeper: User;
}

export interface CreateOutletPayload {
  name: string;
  address: string;
  phone: string;
  keeper_id: number;
  photo: File;
}

export interface UpdateOutletPayload {
  id: number;
  name: string;
  address: string;
  phone: string;
  keeper_id: number;
  photo?: File;
}

export interface DistribusiStokPayload {
  outlet_id: number;
  warehouse_id: number;
  product_id: number;
  stock: number;
}
