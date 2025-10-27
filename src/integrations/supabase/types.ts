export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      defense_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          expertise: string[] | null
          id: string
          name: string
          party: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      economics_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          expertise: string[] | null
          id: string
          name: string
          party: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      education_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          expertise: string[] | null
          id: string
          name: string
          party: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      environment_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          expertise: string[] | null
          id: string
          name: string
          party: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      government_images: {
        Row: {
          candidates_hash: string
          created_at: string
          id: string
          image_url: string
          prompt: string | null
          seed: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          candidates_hash: string
          created_at?: string
          id?: string
          image_url: string
          prompt?: string | null
          seed?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          candidates_hash?: string
          created_at?: string
          id?: string
          image_url?: string
          prompt?: string | null
          seed?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      government_selections: {
        Row: {
          candidate_data: Json
          created_at: string
          id: string
          ministry_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          candidate_data: Json
          created_at?: string
          id?: string
          ministry_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          candidate_data?: Json
          created_at?: string
          id?: string
          ministry_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      government_shares: {
        Row: {
          created_at: string
          creator_name: string | null
          creator_user_id: string | null
          id: string
          image_url: string
          prompt: string | null
          seed: number | null
          selected_candidates: Json
          share_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_name?: string | null
          creator_user_id?: string | null
          id?: string
          image_url: string
          prompt?: string | null
          seed?: number | null
          selected_candidates: Json
          share_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_name?: string | null
          creator_user_id?: string | null
          id?: string
          image_url?: string
          prompt?: string | null
          seed?: number | null
          selected_candidates?: Json
          share_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          expertise: string[] | null
          id: string
          name: string
          party: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      justice_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          expertise: string[] | null
          id: string
          name: string
          party: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          created_at: string
          documents: Json | null
          id: string
          level: number | null
          status: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          documents?: Json | null
          id?: string
          level?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          documents?: Json | null
          id?: string
          level?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      news_articles: {
        Row: {
          category: string
          comment_count: number | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean | null
          published_at: string
          source: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category: string
          comment_count?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string
          source: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string
          comment_count?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string
          source?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      news_comments: {
        Row: {
          content: string | null
          created_at: string
          duration: number | null
          id: string
          like_count: number | null
          news_article_id: string
          reply_count: number | null
          share_count: number | null
          trust_count: number | null
          updated_at: string
          user_id: string
          video_url: string | null
          watch_count: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          like_count?: number | null
          news_article_id: string
          reply_count?: number | null
          share_count?: number | null
          trust_count?: number | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          watch_count?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          like_count?: number | null
          news_article_id?: string
          reply_count?: number | null
          share_count?: number | null
          trust_count?: number | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          watch_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "news_comments_news_article_id_fkey"
            columns: ["news_article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          news_comment_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          news_comment_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          news_comment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_interactions_news_comment_id_fkey"
            columns: ["news_comment_id"]
            isOneToOne: false
            referencedRelation: "news_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_post_id: string | null
          related_user_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_post_id?: string | null
          related_user_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_post_id?: string | null
          related_user_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          otp_code: string
          phone_number: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          otp_code: string
          phone_number: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          otp_code?: string
          phone_number?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: []
      }
      otps: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          otp: string
          phone: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          otp: string
          phone: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          otp?: string
          phone?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          comment_count: number | null
          content: string | null
          created_at: string
          domain: string | null
          id: string
          is_live: boolean | null
          share_count: number | null
          thumbnail_url: string | null
          title: string | null
          trust_count: number | null
          updated_at: string
          user_id: string
          video_url: string | null
          view_count: number | null
          watch_count: number | null
          zooz_earned: number | null
        }
        Insert: {
          category?: string | null
          comment_count?: number | null
          content?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          is_live?: boolean | null
          share_count?: number | null
          thumbnail_url?: string | null
          title?: string | null
          trust_count?: number | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          view_count?: number | null
          watch_count?: number | null
          zooz_earned?: number | null
        }
        Update: {
          category?: string | null
          comment_count?: number | null
          content?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          is_live?: boolean | null
          share_count?: number | null
          thumbnail_url?: string | null
          title?: string | null
          trust_count?: number | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          view_count?: number | null
          watch_count?: number | null
          zooz_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      prime_minister_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          expertise: string[] | null
          id: string
          name: string
          party: string | null
          updated_at: string
          wikipedia_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          party?: string | null
          updated_at?: string
          wikipedia_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      shared_governments: {
        Row: {
          created_at: string
          creator_name: string | null
          creator_user_id: string | null
          generated_image_url: string
          id: string
          minister_1_avatar: string | null
          minister_1_name: string | null
          minister_1_position: string | null
          minister_2_avatar: string | null
          minister_2_name: string | null
          minister_2_position: string | null
          minister_3_avatar: string | null
          minister_3_name: string | null
          minister_3_position: string | null
          minister_4_avatar: string | null
          minister_4_name: string | null
          minister_4_position: string | null
          minister_5_avatar: string | null
          minister_5_name: string | null
          minister_5_position: string | null
          minister_6_avatar: string | null
          minister_6_name: string | null
          minister_6_position: string | null
          minister_7_avatar: string | null
          minister_7_name: string | null
          minister_7_position: string | null
          minister_8_avatar: string | null
          minister_8_name: string | null
          minister_8_position: string | null
          pm_avatar: string | null
          pm_name: string
          share_id: string
          share_url: string | null
        }
        Insert: {
          created_at?: string
          creator_name?: string | null
          creator_user_id?: string | null
          generated_image_url: string
          id?: string
          minister_1_avatar?: string | null
          minister_1_name?: string | null
          minister_1_position?: string | null
          minister_2_avatar?: string | null
          minister_2_name?: string | null
          minister_2_position?: string | null
          minister_3_avatar?: string | null
          minister_3_name?: string | null
          minister_3_position?: string | null
          minister_4_avatar?: string | null
          minister_4_name?: string | null
          minister_4_position?: string | null
          minister_5_avatar?: string | null
          minister_5_name?: string | null
          minister_5_position?: string | null
          minister_6_avatar?: string | null
          minister_6_name?: string | null
          minister_6_position?: string | null
          minister_7_avatar?: string | null
          minister_7_name?: string | null
          minister_7_position?: string | null
          minister_8_avatar?: string | null
          minister_8_name?: string | null
          minister_8_position?: string | null
          pm_avatar?: string | null
          pm_name: string
          share_id: string
          share_url?: string | null
        }
        Update: {
          created_at?: string
          creator_name?: string | null
          creator_user_id?: string | null
          generated_image_url?: string
          id?: string
          minister_1_avatar?: string | null
          minister_1_name?: string | null
          minister_1_position?: string | null
          minister_2_avatar?: string | null
          minister_2_name?: string | null
          minister_2_position?: string | null
          minister_3_avatar?: string | null
          minister_3_name?: string | null
          minister_3_position?: string | null
          minister_4_avatar?: string | null
          minister_4_name?: string | null
          minister_4_position?: string | null
          minister_5_avatar?: string | null
          minister_5_name?: string | null
          minister_5_position?: string | null
          minister_6_avatar?: string | null
          minister_6_name?: string | null
          minister_6_position?: string | null
          minister_7_avatar?: string | null
          minister_7_name?: string | null
          minister_7_position?: string | null
          minister_8_avatar?: string | null
          minister_8_name?: string | null
          minister_8_position?: string | null
          pm_avatar?: string | null
          pm_name?: string
          share_id?: string
          share_url?: string | null
        }
        Relationships: []
      }
      trust_intents: {
        Row: {
          consumed_at: string | null
          created_at: string
          id: string
          is_consumed: boolean | null
          referral_code: string
          target_phone_hash: string
          truster_user_id: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          id?: string
          is_consumed?: boolean | null
          referral_code: string
          target_phone_hash: string
          truster_user_id: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          id?: string
          is_consumed?: boolean | null
          referral_code?: string
          target_phone_hash?: string
          truster_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_intents_referral_code_fkey"
            columns: ["referral_code"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "trust_intents_truster_user_id_fkey"
            columns: ["truster_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trusts: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          trusted_id: string
          truster_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          trusted_id: string
          truster_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          trusted_id?: string
          truster_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trusts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trusts_trusted_id_fkey"
            columns: ["trusted_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trusts_truster_id_fkey"
            columns: ["truster_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_balances: {
        Row: {
          created_at: string
          id: string
          percentage_change: number | null
          updated_at: string
          usd_value: number | null
          user_id: string
          zooz_balance: number
        }
        Insert: {
          created_at?: string
          id?: string
          percentage_change?: number | null
          updated_at?: string
          usd_value?: number | null
          user_id: string
          zooz_balance?: number
        }
        Update: {
          created_at?: string
          id?: string
          percentage_change?: number | null
          updated_at?: string
          usd_value?: number | null
          user_id?: string
          zooz_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_expertise: {
        Row: {
          created_at: string
          domain: string
          id: string
          level: number | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          level?: number | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          level?: number | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_expertise_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_stats: {
        Row: {
          comments_count: number | null
          created_at: string
          id: string
          posts_count: number | null
          profile_views: number | null
          trust_given: number | null
          trust_received: number | null
          trust_score: number | null
          updated_at: string
          user_id: string
          watch_count: number | null
        }
        Insert: {
          comments_count?: number | null
          created_at?: string
          id?: string
          posts_count?: number | null
          profile_views?: number | null
          trust_given?: number | null
          trust_received?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id: string
          watch_count?: number | null
        }
        Update: {
          comments_count?: number | null
          created_at?: string
          id?: string
          posts_count?: number | null
          profile_views?: number | null
          trust_given?: number | null
          trust_received?: number | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string
          watch_count?: number | null
        }
        Relationships: []
      }
      watches: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          watched_id: string
          watcher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          watched_id: string
          watcher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          watched_id?: string
          watcher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watches_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watches_watched_id_fkey"
            columns: ["watched_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "watches_watcher_id_fkey"
            columns: ["watcher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      whatsapp_otps: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          last_attempt_at: string | null
          phone_e164: string
          salt: string
          status: string
          user_agent: string | null
          vendor_message_id: string | null
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: string | null
          last_attempt_at?: string | null
          phone_e164: string
          salt: string
          status?: string
          user_agent?: string | null
          vendor_message_id?: string | null
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_attempt_at?: string | null
          phone_e164?: string
          salt?: string
          status?: string
          user_agent?: string | null
          vendor_message_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      zooz_reactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          post_id: string
          user_id: string | null
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          post_id: string
          user_id?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: []
      }
      zooz_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          from_user_id: string | null
          id: string
          note: string | null
          post_id: string | null
          to_user_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          from_user_id?: string | null
          id?: string
          note?: string | null
          post_id?: string | null
          to_user_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          from_user_id?: string | null
          id?: string
          note?: string | null
          post_id?: string | null
          to_user_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "zooz_transactions_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "zooz_transactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zooz_transactions_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_invitation: {
        Args: { invitation_code: string; new_user_id: string }
        Returns: boolean
      }
      consume_trust: {
        Args: { new_user_id: string; phone_hash: string }
        Returns: string
      }
      create_notification: {
        Args: {
          notification_type: string
          p_message: string
          p_title: string
          rel_post?: string
          rel_user?: string
          target_user: string
        }
        Returns: string
      }
      create_trust_intent: {
        Args: { target_phone_hash: string; truster_id?: string }
        Returns: boolean
      }
      generate_referral_code: { Args: never; Returns: string }
      generate_share_id: { Args: never; Returns: string }
      get_my_referral_code: { Args: never; Returns: string }
      has_trust_for_phone_hash: {
        Args: { phone_hash: string }
        Returns: boolean
      }
      hash_phone: { Args: { phone_number: string }; Returns: string }
      increment_news_view_count: { Args: { news_id: string }; Returns: boolean }
      increment_post_views: { Args: { p_post_id: string }; Returns: boolean }
      init_user_balance: { Args: { p_user?: string }; Returns: boolean }
      reward_zooz: {
        Args: {
          p_amount: number
          p_post?: string
          reason: string
          target_user: string
        }
        Returns: boolean
      }
      transfer_zooz: {
        Args: {
          from_user: string
          p_amount: number
          p_description?: string
          p_note?: string
          p_post?: string
          to_user: string
        }
        Returns: boolean
      }
      update_user_stats: { Args: { p_user_id: string }; Returns: boolean }
      validate_invitation_code: {
        Args: { invitation_code: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
