import { Database as DB } from "@/supabase/db_types";

declare global {
  type Database = DB;

  type OrderDetails = Database['public']['Tables']['order']['Row'];
  type PaymentDetails = Database['public']['Tables']['order_payment_details']['Row'];

  type Product = Database['public']['Tables']['product']['Row'];
  type RawProfile = Database['public']['Tables']['profile']['Row'];
  type Chat = Database['public']['Tables']['chat']['Row'];
  type Review = Database['public']['Tables']['review']['Row'];
  type Cart = Database['public']['Tables']['cart']['Row'];
  type RawMessage = Database['public']['Tables']['chat_message']['Row'];

  type Profile = Omit<RawProfile, 'id' | 'balance'>;

  type CartItem = Omit<Cart, 'id' | 'user_id' | 'product_id'> & { product: Product };

  interface OrderItem {
    price: number;
    product: Product;
    quantity: number;
  }

  type SearchFilter = 'price_asc' | 'price_desc' | 'rating_desc';

  type PaymentType = 'marketplace' | 'bank_card';

  // gets an array's element type
  type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

  interface SearchSuggestion {
    id: number;
    text: string;
  }
}