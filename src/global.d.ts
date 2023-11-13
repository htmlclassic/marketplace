import { Database as DB } from "@/supabase/db_types";

type OrderBase = Database['public']['Tables']['order']['Row'];

declare global {
  type Database = DB;
  type Product = Database['public']['Tables']['product']['Row'] & { imageUrls: string[] | null };
  type Profile = Database['public']['Tables']['profile']['Row'];
  type Cart = Omit<Database['public']['Tables']['cart']['Row'], 'id' | 'user_id'>;

  interface OrderItem {
    price: number;
    product: Product;
    quantity: number;
  }

  interface Order {
    id: number;
    createdAt: string;
    deliveryDate: string;
    address: string;
    receiver: string;
    status: 'seller' | 'courier' | 'done';
    items: OrderItem[];
  }

  interface SellerStatistics {
    product: Product;
    soldCount: number;
    grossPay: number;
  }
}