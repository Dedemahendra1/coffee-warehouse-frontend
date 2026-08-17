import { Outlet } from "./outlet";
import { Product } from "./product";
import { User } from "./auth";

export interface StockOut {
  id: number;
  merchant_id: number;
  product_id: number;
  quantity: number;
  reason: string | null;
  user_id: number | null;
  created_at: string;
  updated_at: string;
  merchant?: Outlet;
  product?: Product;
  user?: User;
}

export interface CreateStockOutPayload {
  merchant_id: number;
  product_id: number;
  quantity: number;
  reason?: string;
}
