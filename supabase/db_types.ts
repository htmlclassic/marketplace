export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart: {
        Row: {
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      category: {
        Row: {
          id: number
          name: string
          parent_category: string | null
        }
        Insert: {
          id?: number
          name: string
          parent_category?: string | null
        }
        Update: {
          id?: number
          name?: string
          parent_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_parent_category_fkey"
            columns: ["parent_category"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["name"]
          }
        ]
      }
      chat: {
        Row: {
          created_at: string | null
          customer_id: string
          customer_name: string
          id: number
          product_id: string
          seller_id: string
          seller_name: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          customer_name: string
          id?: number
          product_id: string
          seller_id: string
          seller_name: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          customer_name?: string
          id?: number
          product_id?: string
          seller_id?: string
          seller_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_chat_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_chat_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_message: {
        Row: {
          author_id: string
          chat_id: number
          created_at: string | null
          id: number
          text: string
        }
        Insert: {
          author_id: string
          chat_id: number
          created_at?: string | null
          id?: number
          text: string
        }
        Update: {
          author_id?: string
          chat_id?: number
          created_at?: string | null
          id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_message_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          }
        ]
      }
      favorite_product: {
        Row: {
          created_at: string
          id: number
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_product_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order: {
        Row: {
          address: string
          cancelled: boolean | null
          created_at: string
          delivery_date: string
          email: string
          id: number
          phone_number: string
          receiver_name: string
          user_id: string | null
        }
        Insert: {
          address: string
          cancelled?: boolean | null
          created_at?: string
          delivery_date: string
          email: string
          id?: number
          phone_number: string
          receiver_name: string
          user_id?: string | null
        }
        Update: {
          address?: string
          cancelled?: boolean | null
          created_at?: string
          delivery_date?: string
          email?: string
          id?: number
          phone_number?: string
          receiver_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: number
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          }
        ]
      }
      order_payment_details: {
        Row: {
          created_at: string
          id: number
          is_paid: boolean
          order_id: number | null
          payment_type: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_paid?: boolean
          order_id?: number | null
          payment_type: string
        }
        Update: {
          created_at?: string
          id?: number
          is_paid?: boolean
          order_id?: number | null
          payment_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_order_payment_details_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          }
        ]
      }
      product: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          img_urls: string[] | null
          owner: string
          price: number
          quantity: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          img_urls?: string[] | null
          owner: string
          price: number
          quantity: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          img_urls?: string[] | null
          owner?: string
          price?: number
          quantity?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "product_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      product_characteristic: {
        Row: {
          created_at: string
          id: number
          name: string
          product_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          product_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          product_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_product_characteristic_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          }
        ]
      }
      profile: {
        Row: {
          birthdate: string | null
          email: string
          id: string
          name: string | null
        }
        Insert: {
          birthdate?: string | null
          email: string
          id: string
          name?: string | null
        }
        Update: {
          birthdate?: string | null
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      review: {
        Row: {
          author_id: string
          comment: string
          cons: string
          created_at: string
          id: number
          product_id: string
          pros: string
          rating: number
          updated_at: string
        }
        Insert: {
          author_id: string
          comment: string
          cons: string
          created_at?: string
          id?: number
          product_id: string
          pros: string
          rating: number
          updated_at?: string
        }
        Update: {
          author_id?: string
          comment?: string
          cons?: string
          created_at?: string
          id?: number
          product_id?: string
          pros?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          }
        ]
      }
      review_dislike: {
        Row: {
          id: number
          review_id: number
          user_id: string
        }
        Insert: {
          id?: number
          review_id: number
          user_id: string
        }
        Update: {
          id?: number
          review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_dislike_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "review"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_dislike_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      review_like: {
        Row: {
          id: number
          review_id: number
          user_id: string
        }
        Insert: {
          id?: number
          review_id: number
          user_id: string
        }
        Update: {
          id?: number
          review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_like_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "review"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      test: {
        Row: {
          dope: number
          id: number
        }
        Insert: {
          dope: number
          id?: number
        }
        Update: {
          dope?: number
          id?: number
        }
        Relationships: []
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_wallet_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wallet_history: {
        Row: {
          action: Database["public"]["Enums"]["wallet_history_action_type"]
          created_at: string
          id: number
          sum: number
          wallet_id: number
        }
        Insert: {
          action: Database["public"]["Enums"]["wallet_history_action_type"]
          created_at?: string
          id?: number
          sum: number
          wallet_id: number
        }
        Update: {
          action?: Database["public"]["Enums"]["wallet_history_action_type"]
          created_at?: string
          id?: number
          sum?: number
          wallet_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_wallet_history_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deposit_on_wallet: {
        Args: {
          wallet_id: number
          sum: number
          action: Database["public"]["Enums"]["wallet_history_action_type_on_deposit"]
        }
        Returns: undefined
      }
      get_most_rated_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          price: number
          quantity: number
          category: string
          owner: string
          created_at: string
          img_urls: string[]
          review: Json[]
        }[]
      }
      get_products_with_avg_rating: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          price: number
          quantity: number
          category: string
          owner: string
          created_at: string
          img_urls: string[]
          avg_rating: number
        }[]
      }
      get_user_name: {
        Args: {
          userid: string
        }
        Returns: string
      }
      set_order_payment_status_to_true: {
        Args: {
          orderid: number
        }
        Returns: undefined
      }
      verify_user_password: {
        Args: {
          password: string
        }
        Returns: boolean
      }
      withdraw_from_wallet: {
        Args: {
          wallet_id: number
          sum: number
        }
        Returns: boolean
      }
    }
    Enums: {
      wallet_history_action_type: "sold_product" | "bought_product" | "deposit"
      wallet_history_action_type_on_deposit: "sold_product" | "deposit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
