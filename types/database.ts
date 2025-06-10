export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          phone: string | null
          role: "client" | "provider" | "admin"
          avatar_url: string | null
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          phone?: string | null
          role: "client" | "provider" | "admin"
          avatar_url?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: "client" | "provider" | "admin"
          avatar_url?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          location: any | null
          language: string
          theme: string
          notifications: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          location?: any | null
          language?: string
          theme?: string
          notifications?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          location?: any | null
          language?: string
          theme?: string
          notifications?: any
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          provider_id: string
          category_id: string
          title: string
          description: string
          price: number
          currency: string
          images: string[]
          availability: any | null
          service_area: any | null
          is_active: boolean
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          category_id: string
          title: string
          description: string
          price: number
          currency?: string
          images?: string[]
          availability?: any | null
          service_area?: any | null
          is_active?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          category_id?: string
          title?: string
          description?: string
          price?: number
          currency?: string
          images?: string[]
          availability?: any | null
          service_area?: any | null
          is_active?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          provider_id: string
          service_id: string
          status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
          scheduled_date: string
          scheduled_time: string
          address: string
          notes: string | null
          price: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          provider_id: string
          service_id: string
          status?: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
          scheduled_date: string
          scheduled_time: string
          address: string
          notes?: string | null
          price: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          provider_id?: string
          service_id?: string
          status?: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
          scheduled_date?: string
          scheduled_time?: string
          address?: string
          notes?: string | null
          price?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          participant_1: string
          participant_2: string
          booking_id: string | null
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          participant_1: string
          participant_2: string
          booking_id?: string | null
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          participant_1?: string
          participant_2?: string
          booking_id?: string | null
          last_message_at?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string | null
          message_type: "text" | "image" | "system"
          image_url: string | null
          reply_to_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content?: string | null
          message_type?: "text" | "image" | "system"
          image_url?: string | null
          reply_to_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string | null
          message_type?: "text" | "image" | "system"
          image_url?: string | null
          reply_to_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          client_id: string
          provider_id: string
          service_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          client_id: string
          provider_id: string
          service_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          client_id?: string
          provider_id?: string
          service_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      kyc_verifications: {
        Row: {
          id: string
          user_id: string
          status: "pending" | "under_review" | "approved" | "rejected"
          documents: any | null
          notes: string | null
          rejection_reason: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: "pending" | "under_review" | "approved" | "rejected"
          documents?: any | null
          notes?: string | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: "pending" | "under_review" | "approved" | "rejected"
          documents?: any | null
          notes?: string | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string
          reported_service_id: string | null
          reason: string
          description: string | null
          status: "pending" | "investigating" | "resolved" | "dismissed"
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id: string
          reported_service_id?: string | null
          reason: string
          description?: string | null
          status?: "pending" | "investigating" | "resolved" | "dismissed"
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string
          reported_service_id?: string | null
          reason?: string
          description?: string | null
          status?: "pending" | "investigating" | "resolved" | "dismissed"
          created_at?: string
        }
      }
    }
  }
}
