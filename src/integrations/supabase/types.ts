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
      advertisements: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          status: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          status?: string | null
          title: string
          url: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          status?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      auth_settings: {
        Row: {
          created_at: string
          id: string
          redirect_urls: string[]
          site_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          redirect_urls: string[]
          site_url: string
        }
        Update: {
          created_at?: string
          id?: string
          redirect_urls?: string[]
          site_url?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      episodes: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          episode_number: number
          id: string
          season_id: string | null
          thumbnail_image: string | null
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          episode_number: number
          id?: string
          season_id?: string | null
          thumbnail_image?: string | null
          title: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          episode_number?: number
          id?: string
          season_id?: string | null
          thumbnail_image?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          category_id: string | null
          cover_image: string
          created_at: string
          description: string | null
          id: string
          movie_cast: string[] | null
          tags: string[] | null
          thumbnail_image: string | null
          title: string
          video_url: string
        }
        Insert: {
          category_id?: string | null
          cover_image: string
          created_at?: string
          description?: string | null
          id?: string
          movie_cast?: string[] | null
          tags?: string[] | null
          thumbnail_image?: string | null
          title: string
          video_url: string
        }
        Update: {
          category_id?: string | null
          cover_image?: string
          created_at?: string
          description?: string | null
          id?: string
          movie_cast?: string[] | null
          tags?: string[] | null
          thumbnail_image?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "movies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          season_number: number
          series_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          season_number: number
          series_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          season_number?: number
          series_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          category_id: string | null
          cover_image: string
          created_at: string
          description: string | null
          id: string
          series_cast: string[] | null
          tags: string[] | null
          thumbnail_image: string | null
          title: string
        }
        Insert: {
          category_id?: string | null
          cover_image: string
          created_at?: string
          description?: string | null
          id?: string
          series_cast?: string[] | null
          tags?: string[] | null
          thumbnail_image?: string | null
          title: string
        }
        Update: {
          category_id?: string | null
          cover_image?: string
          created_at?: string
          description?: string | null
          id?: string
          series_cast?: string[] | null
          tags?: string[] | null
          thumbnail_image?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_likes: {
        Row: {
          created_at: string
          id: string
          movie_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_likes_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_movies: {
        Row: {
          created_at: string
          id: string
          movie_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_movies_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      youtube_videos: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "youtube_videos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
