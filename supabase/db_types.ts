export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      order_details: {
        Row: {
          address: string
          created_at: string
          delivery_date: string
          id: number
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          delivery_date: string
          id?: number
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          delivery_date?: string
          id?: number
          user_id?: string
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
            referencedRelation: "order_details"
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
      product: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
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
          owner?: string
          price?: number
          quantity?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      profile: {
        Row: {
          balance: number
          birthdate: string | null
          first_name: string | null
          id: string
          last_name: string | null
          username: string
        }
        Insert: {
          balance?: number
          birthdate?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          username: string
        }
        Update: {
          balance?: number
          birthdate?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          username?: string
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
      test: {
        Row: {
          id: number
          products: Json[]
        }
        Insert: {
          id?: number
          products: Json[]
        }
        Update: {
          id?: number
          products?: Json[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
