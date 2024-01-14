import { Database as DB } from "@/supabase/db_types";

type OrderBase = Database['public']['Tables']['order']['Row'];

declare global {
  type Database = DB;
  type Product = Database['public']['Tables']['product']['Row'] & { imageUrls: string[] | null };
  type Profile = Database['public']['Tables']['profile']['Row'];
  type Chat = Database['public']['Tables']['chat']['Row'];
  type Review = Database['public']['Tables']['review']['Row'];
  type Cart = Omit<Database['public']['Tables']['cart']['Row'], 'id' | 'user_id'>;
  type RawMessage = Database['public']['Tables']['chat_message']['Row'];

  type CartItem = Cart & {
    price: number;
    maxQuantity: number;
  };

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