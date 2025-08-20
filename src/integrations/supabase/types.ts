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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      age_verifications: {
        Row: {
          created_at: string
          date_of_birth: string
          id: string
          is_verified: boolean
          user_id: string
          verification_method: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          id?: string
          is_verified?: boolean
          user_id: string
          verification_method?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          id?: string
          is_verified?: boolean
          user_id?: string
          verification_method?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      ai_matches_archive: {
        Row: {
          archive_reason: string | null
          archived_at: string | null
          compatibility_score: number | null
          id: number
          interaction_status: string | null
          last_interaction_at: string | null
          matched_at: string | null
          matched_user_id: string | null
          original_match_id: number | null
          user_id: string | null
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          compatibility_score?: number | null
          id?: never
          interaction_status?: string | null
          last_interaction_at?: string | null
          matched_at?: string | null
          matched_user_id?: string | null
          original_match_id?: number | null
          user_id?: string | null
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          compatibility_score?: number | null
          id?: never
          interaction_status?: string | null
          last_interaction_at?: string | null
          matched_at?: string | null
          matched_user_id?: string | null
          original_match_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      compatibility_digests: {
        Row: {
          ai_conversation_starters: Json | null
          digest_content: Json | null
          digest_date: string | null
          generated_at: string | null
          id: number
          new_compatible_profiles: Json | null
          profile_score_deltas: Json | null
          user_id: string | null
        }
        Insert: {
          ai_conversation_starters?: Json | null
          digest_content?: Json | null
          digest_date?: string | null
          generated_at?: string | null
          id?: never
          new_compatible_profiles?: Json | null
          profile_score_deltas?: Json | null
          user_id?: string | null
        }
        Update: {
          ai_conversation_starters?: Json | null
          digest_content?: Json | null
          digest_date?: string | null
          generated_at?: string | null
          id?: never
          new_compatible_profiles?: Json | null
          profile_score_deltas?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      connection_dna_compatibility: {
        Row: {
          analysis_confidence: number | null
          communication_compatibility: number | null
          conflict_harmony_score: number | null
          conversation_starters: Json | null
          created_at: string
          date_ideas: Json | null
          detailed_analysis: Json | null
          emotional_sync_score: number | null
          growth_areas: Json | null
          growth_potential_score: number | null
          id: string
          last_analyzed_at: string | null
          overall_compatibility_score: number
          personality_match_score: number | null
          shared_values_score: number | null
          strengths: Json | null
          updated_at: string
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          analysis_confidence?: number | null
          communication_compatibility?: number | null
          conflict_harmony_score?: number | null
          conversation_starters?: Json | null
          created_at?: string
          date_ideas?: Json | null
          detailed_analysis?: Json | null
          emotional_sync_score?: number | null
          growth_areas?: Json | null
          growth_potential_score?: number | null
          id?: string
          last_analyzed_at?: string | null
          overall_compatibility_score: number
          personality_match_score?: number | null
          shared_values_score?: number | null
          strengths?: Json | null
          updated_at?: string
          user_id_1: string
          user_id_2: string
        }
        Update: {
          analysis_confidence?: number | null
          communication_compatibility?: number | null
          conflict_harmony_score?: number | null
          conversation_starters?: Json | null
          created_at?: string
          date_ideas?: Json | null
          detailed_analysis?: Json | null
          emotional_sync_score?: number | null
          growth_areas?: Json | null
          growth_potential_score?: number | null
          id?: string
          last_analyzed_at?: string | null
          overall_compatibility_score?: number
          personality_match_score?: number | null
          shared_values_score?: number | null
          strengths?: Json | null
          updated_at?: string
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: []
      }
      connection_dna_insights: {
        Row: {
          actionable_steps: Json | null
          category: string | null
          confidence_level: number | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          insight_type: string
          is_dismissed: boolean | null
          is_read: boolean | null
          priority_level: string | null
          title: string
          user_id: string
        }
        Insert: {
          actionable_steps?: Json | null
          category?: string | null
          confidence_level?: number | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority_level?: string | null
          title: string
          user_id: string
        }
        Update: {
          actionable_steps?: Json | null
          category?: string | null
          confidence_level?: number | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority_level?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      connection_dna_interactions: {
        Row: {
          analyzed_at: string | null
          created_at: string
          emotional_markers: Json | null
          empathy_indicators: Json | null
          engagement_score: number | null
          id: string
          interaction_data: Json
          interaction_type: string
          message_length: number | null
          other_user_id: string | null
          response_time_seconds: number | null
          sentiment_score: number | null
          user_id: string
          vulnerability_level: number | null
        }
        Insert: {
          analyzed_at?: string | null
          created_at?: string
          emotional_markers?: Json | null
          empathy_indicators?: Json | null
          engagement_score?: number | null
          id?: string
          interaction_data: Json
          interaction_type: string
          message_length?: number | null
          other_user_id?: string | null
          response_time_seconds?: number | null
          sentiment_score?: number | null
          user_id: string
          vulnerability_level?: number | null
        }
        Update: {
          analyzed_at?: string | null
          created_at?: string
          emotional_markers?: Json | null
          empathy_indicators?: Json | null
          engagement_score?: number | null
          id?: string
          interaction_data?: Json
          interaction_type?: string
          message_length?: number | null
          other_user_id?: string | null
          response_time_seconds?: number | null
          sentiment_score?: number | null
          user_id?: string
          vulnerability_level?: number | null
        }
        Relationships: []
      }
      connection_dna_profiles: {
        Row: {
          communication_style: Json | null
          compatibility_insights: Json | null
          conflict_resolution_style: string | null
          created_at: string
          emotional_intelligence_score: number | null
          emotional_patterns: Json | null
          empathy_score: number | null
          growth_metrics: Json | null
          id: string
          interaction_quality_score: number | null
          last_analysis_at: string | null
          love_language_primary: string | null
          love_language_secondary: string | null
          personality_markers: Json | null
          updated_at: string
          user_id: string
          vulnerability_comfort: number | null
        }
        Insert: {
          communication_style?: Json | null
          compatibility_insights?: Json | null
          conflict_resolution_style?: string | null
          created_at?: string
          emotional_intelligence_score?: number | null
          emotional_patterns?: Json | null
          empathy_score?: number | null
          growth_metrics?: Json | null
          id?: string
          interaction_quality_score?: number | null
          last_analysis_at?: string | null
          love_language_primary?: string | null
          love_language_secondary?: string | null
          personality_markers?: Json | null
          updated_at?: string
          user_id: string
          vulnerability_comfort?: number | null
        }
        Update: {
          communication_style?: Json | null
          compatibility_insights?: Json | null
          conflict_resolution_style?: string | null
          created_at?: string
          emotional_intelligence_score?: number | null
          emotional_patterns?: Json | null
          empathy_score?: number | null
          growth_metrics?: Json | null
          id?: string
          interaction_quality_score?: number | null
          last_analysis_at?: string | null
          love_language_primary?: string | null
          love_language_secondary?: string | null
          personality_markers?: Json | null
          updated_at?: string
          user_id?: string
          vulnerability_comfort?: number | null
        }
        Relationships: []
      }
      daily_message_limits: {
        Row: {
          created_at: string
          id: string
          message_count: number
          message_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          message_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          message_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      echo_limited_chats: {
        Row: {
          can_complete_connection: boolean | null
          character_limit: number | null
          connection_completion_available_at: string | null
          created_at: string
          daily_message_limit: number | null
          expires_at: string
          id: string
          last_message_date: string | null
          message_count: number | null
          message_pace_hours: number | null
          response_invite_id: string
          silence_mode_enabled: boolean | null
          single_thread_enforced: boolean | null
          tone_guidance_enabled: boolean | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          can_complete_connection?: boolean | null
          character_limit?: number | null
          connection_completion_available_at?: string | null
          created_at?: string
          daily_message_limit?: number | null
          expires_at?: string
          id?: string
          last_message_date?: string | null
          message_count?: number | null
          message_pace_hours?: number | null
          response_invite_id: string
          silence_mode_enabled?: boolean | null
          single_thread_enforced?: boolean | null
          tone_guidance_enabled?: boolean | null
          user1_id: string
          user2_id: string
        }
        Update: {
          can_complete_connection?: boolean | null
          character_limit?: number | null
          connection_completion_available_at?: string | null
          created_at?: string
          daily_message_limit?: number | null
          expires_at?: string
          id?: string
          last_message_date?: string | null
          message_count?: number | null
          message_pace_hours?: number | null
          response_invite_id?: string
          silence_mode_enabled?: boolean | null
          single_thread_enforced?: boolean | null
          tone_guidance_enabled?: boolean | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "echo_limited_chats_response_invite_id_fkey"
            columns: ["response_invite_id"]
            isOneToOne: false
            referencedRelation: "echo_response_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      echo_limited_messages: {
        Row: {
          character_count: number | null
          chat_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message_text: string
          sender_id: string
        }
        Insert: {
          character_count?: number | null
          chat_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_text: string
          sender_id: string
        }
        Update: {
          character_count?: number | null
          chat_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_text?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "echo_limited_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "echo_limited_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      echo_quiet_notes: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          note_text: string
          recipient_id: string
          response_invite_sent: boolean | null
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          note_text: string
          recipient_id: string
          response_invite_sent?: boolean | null
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          note_text?: string
          recipient_id?: string
          response_invite_sent?: boolean | null
          sender_id?: string
        }
        Relationships: []
      }
      echo_response_invites: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invite_message: string
          quiet_note_id: string
          recipient_id: string
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          invite_message: string
          quiet_note_id: string
          recipient_id: string
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invite_message?: string
          quiet_note_id?: string
          recipient_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "echo_response_invites_quiet_note_id_fkey"
            columns: ["quiet_note_id"]
            isOneToOne: false
            referencedRelation: "echo_quiet_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      echo_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          subscription_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          subscription_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          subscription_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_journeys: {
        Row: {
          created_at: string
          email_address: string
          email_data: Json | null
          email_status: string
          id: string
          journey_type: string
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_address: string
          email_data?: Json | null
          email_status?: string
          id?: string
          journey_type: string
          sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_address?: string
          email_data?: Json | null
          email_status?: string
          id?: string
          journey_type?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      failed_login_attempts: {
        Row: {
          attempt_time: string | null
          email: string
          id: number
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          attempt_time?: string | null
          email: string
          id?: number
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          attempt_time?: string | null
          email?: string
          id?: number
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string | null
          created_at: string
          id: number
          question: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: number
          question?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: number
          question?: string | null
        }
        Relationships: []
      }
      interaction_risk_profiles: {
        Row: {
          block_report_score: number | null
          id: number
          interaction_limit_multiplier: number | null
          last_risk_update: string | null
          location_shift_score: number | null
          next_risk_assessment: string | null
          swiping_anomaly_score: number | null
          total_risk_score: number | null
          user_id: string | null
          warning_level: string | null
        }
        Insert: {
          block_report_score?: number | null
          id?: never
          interaction_limit_multiplier?: number | null
          last_risk_update?: string | null
          location_shift_score?: number | null
          next_risk_assessment?: string | null
          swiping_anomaly_score?: number | null
          total_risk_score?: number | null
          user_id?: string | null
          warning_level?: string | null
        }
        Update: {
          block_report_score?: number | null
          id?: never
          interaction_limit_multiplier?: number | null
          last_risk_update?: string | null
          location_shift_score?: number | null
          next_risk_assessment?: string | null
          swiping_anomaly_score?: number | null
          total_risk_score?: number | null
          user_id?: string | null
          warning_level?: string | null
        }
        Relationships: []
      }
      match_interactions: {
        Row: {
          created_at: string | null
          id: string
          match_type: string
          swipe_timestamp: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_type: string
          swipe_timestamp?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_type?: string
          swipe_timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      match_previews: {
        Row: {
          blurred_avatar_url: string | null
          expires_at: string | null
          id: number
          partial_compatibility_hint: string | null
          preview_generated_at: string | null
          preview_user_id: string | null
          teaser_text: string | null
          user_id: string | null
        }
        Insert: {
          blurred_avatar_url?: string | null
          expires_at?: string | null
          id?: never
          partial_compatibility_hint?: string | null
          preview_generated_at?: string | null
          preview_user_id?: string | null
          teaser_text?: string | null
          user_id?: string | null
        }
        Update: {
          blurred_avatar_url?: string | null
          expires_at?: string | null
          id?: never
          partial_compatibility_hint?: string | null
          preview_generated_at?: string | null
          preview_user_id?: string | null
          teaser_text?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      match_scores: {
        Row: {
          created_at: string | null
          id: string
          score: number | null
          user_a: string | null
          user_b: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          score?: number | null
          user_a?: string | null
          user_b?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          score?: number | null
          user_a?: string | null
          user_b?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scores_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_summaries: {
        Row: {
          conversation_starters: string[] | null
          embedding: string | null
          generated_at: string | null
          id: number
          last_refreshed_at: string | null
          matched_user_id: string | null
          personality_alignment: number | null
          shared_interests: string[] | null
          similarity_score: number | null
          user_id: string | null
        }
        Insert: {
          conversation_starters?: string[] | null
          embedding?: string | null
          generated_at?: string | null
          id?: never
          last_refreshed_at?: string | null
          matched_user_id?: string | null
          personality_alignment?: number | null
          shared_interests?: string[] | null
          similarity_score?: number | null
          user_id?: string | null
        }
        Update: {
          conversation_starters?: string[] | null
          embedding?: string | null
          generated_at?: string | null
          id?: never
          last_refreshed_at?: string | null
          matched_user_id?: string | null
          personality_alignment?: number | null
          shared_interests?: string[] | null
          similarity_score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      match_velocity_analytics: {
        Row: {
          avg_response_time: unknown | null
          engagement_momentum: number | null
          fastest_response: unknown | null
          id: number
          interaction_quality_score: number | null
          last_updated_at: string | null
          reply_rate: number | null
          responded_matches: number | null
          slowest_response: unknown | null
          total_matches: number | null
          tracked_from: string | null
          user_id: string | null
        }
        Insert: {
          avg_response_time?: unknown | null
          engagement_momentum?: number | null
          fastest_response?: unknown | null
          id?: never
          interaction_quality_score?: number | null
          last_updated_at?: string | null
          reply_rate?: number | null
          responded_matches?: number | null
          slowest_response?: unknown | null
          total_matches?: number | null
          tracked_from?: string | null
          user_id?: string | null
        }
        Update: {
          avg_response_time?: unknown | null
          engagement_momentum?: number | null
          fastest_response?: unknown | null
          id?: never
          interaction_quality_score?: number | null
          last_updated_at?: string | null
          reply_rate?: number | null
          responded_matches?: number | null
          slowest_response?: unknown | null
          total_matches?: number | null
          tracked_from?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          score: number | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          score?: number | null
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          score?: number | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      memory_vault_matches: {
        Row: {
          created_at: string
          id: string
          match_id: string | null
          matched_user_id: string
          notes: string | null
          saved_at: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id?: string | null
          matched_user_id: string
          notes?: string | null
          saved_at?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string | null
          matched_user_id?: string
          notes?: string | null
          saved_at?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      memory_vault_moments: {
        Row: {
          content: Json | null
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean | null
          moment_date: string | null
          moment_type: string
          notes: string | null
          related_user_id: string | null
          saved_at: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          moment_date?: string | null
          moment_type: string
          notes?: string | null
          related_user_id?: string | null
          saved_at?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          moment_date?: string | null
          moment_type?: string
          notes?: string | null
          related_user_id?: string | null
          saved_at?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      memory_vault_prompts: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          prompt_source: string | null
          prompt_text: string
          response_text: string | null
          saved_at: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          prompt_source?: string | null
          prompt_text: string
          response_text?: string | null
          saved_at?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          prompt_source?: string | null
          prompt_text?: string
          response_text?: string | null
          saved_at?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          id: string
          is_deleted: boolean | null
          match_id: string | null
          message_text: string
          read_at: string | null
          sender_id: string | null
          visibility_boost: boolean | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          is_deleted?: boolean | null
          match_id?: string | null
          message_text: string
          read_at?: string | null
          sender_id?: string | null
          visibility_boost?: boolean | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          is_deleted?: boolean | null
          match_id?: string | null
          message_text?: string
          read_at?: string | null
          sender_id?: string | null
          visibility_boost?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      "messages, users, posts, etc.": {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_premium: boolean
          match_id: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_premium?: boolean
          match_id?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_premium?: boolean
          match_id?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      paypal_payments: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string
          id: string
          is_recurring: boolean
          payment_provider: string
          paypal_capture_id: string | null
          paypal_order_id: string | null
          paypal_subscription_id: string | null
          plan_name: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_recurring?: boolean
          payment_provider?: string
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          paypal_subscription_id?: string | null
          plan_name: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_recurring?: boolean
          payment_provider?: string
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          paypal_subscription_id?: string | null
          plan_name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_ai_matches: {
        Row: {
          created_at: string | null
          id: string
          match_score: number
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_score: number
          user_id_1: string
          user_id_2: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_score?: number
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: []
      }
      premium_boosts: {
        Row: {
          activated_at: string | null
          boost_duration: unknown
          boost_type: string
          id: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          boost_duration: unknown
          boost_type: string
          id?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          boost_duration?: unknown
          boost_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_matches: {
        Row: {
          ai_match_summary: string | null
          compatibility_score: number | null
          embedding: string | null
          id: number
          interaction_boost: number | null
          is_read: boolean | null
          match_timestamp: string | null
          matched_user_id: string | null
          read_timestamp: string | null
          user_id: string | null
        }
        Insert: {
          ai_match_summary?: string | null
          compatibility_score?: number | null
          embedding?: string | null
          id?: never
          interaction_boost?: number | null
          is_read?: boolean | null
          match_timestamp?: string | null
          matched_user_id?: string | null
          read_timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          ai_match_summary?: string | null
          compatibility_score?: number | null
          embedding?: string | null
          id?: never
          interaction_boost?: number | null
          is_read?: boolean | null
          match_timestamp?: string | null
          matched_user_id?: string | null
          read_timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      premium_memberships: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          is_active: boolean
          starts_at: string
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: never
          is_active?: boolean
          starts_at?: string
          tier: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: never
          is_active?: boolean
          starts_at?: string
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_messages: {
        Row: {
          id: string
          message: string
          recipient_id: string
          sender_id: string
          sent_at: string | null
          video_url: string | null
        }
        Insert: {
          id?: string
          message: string
          recipient_id: string
          sender_id: string
          sent_at?: string | null
          video_url?: string | null
        }
        Update: {
          id?: string
          message?: string
          recipient_id?: string
          sender_id?: string
          sent_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      premium_profile_themes: {
        Row: {
          created_at: string | null
          id: string
          theme_data: Json
          theme_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          theme_data: Json
          theme_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          theme_data?: Json
          theme_name?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          interests: string[] | null
          photos: string[] | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          photos?: string[] | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          photos?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      premium_user_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          interests: string[] | null
          photos: string[] | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          photos?: string[] | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          photos?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          age_preference_max: number | null
          age_preference_min: number | null
          avatar_url: string | null
          bio: string | null
          communication_style: string | null
          created_at: string | null
          date_of_birth: string | null
          distance_preference: number | null
          echo_badge_enabled: boolean | null
          echo_silence_mode: boolean | null
          echo_visibility_level: string | null
          education: string | null
          emotional_soundtrack: string | null
          gender: string | null
          height: number | null
          id: string
          interests: string[] | null
          is_premium: boolean | null
          last_online: string | null
          location: string | null
          looking_for: string | null
          match_score: number | null
          name: string | null
          occupation: string | null
          open_to_connection_invites: boolean | null
          personality_type: string | null
          photos: string[] | null
          relationship_goals: string | null
          tiktok_embed_url: string | null
          unlocked_beyond_badge_enabled: boolean | null
          updated_at: string | null
          vibe_gallery: Json | null
          zip_code: string | null
        }
        Insert: {
          age?: number | null
          age_preference_max?: number | null
          age_preference_min?: number | null
          avatar_url?: string | null
          bio?: string | null
          communication_style?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          distance_preference?: number | null
          echo_badge_enabled?: boolean | null
          echo_silence_mode?: boolean | null
          echo_visibility_level?: string | null
          education?: string | null
          emotional_soundtrack?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean | null
          last_online?: string | null
          location?: string | null
          looking_for?: string | null
          match_score?: number | null
          name?: string | null
          occupation?: string | null
          open_to_connection_invites?: boolean | null
          personality_type?: string | null
          photos?: string[] | null
          relationship_goals?: string | null
          tiktok_embed_url?: string | null
          unlocked_beyond_badge_enabled?: boolean | null
          updated_at?: string | null
          vibe_gallery?: Json | null
          zip_code?: string | null
        }
        Update: {
          age?: number | null
          age_preference_max?: number | null
          age_preference_min?: number | null
          avatar_url?: string | null
          bio?: string | null
          communication_style?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          distance_preference?: number | null
          echo_badge_enabled?: boolean | null
          echo_silence_mode?: boolean | null
          echo_visibility_level?: string | null
          education?: string | null
          emotional_soundtrack?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean | null
          last_online?: string | null
          location?: string | null
          looking_for?: string | null
          match_score?: number | null
          name?: string | null
          occupation?: string | null
          open_to_connection_invites?: boolean | null
          personality_type?: string | null
          photos?: string[] | null
          relationship_goals?: string | null
          tiktok_embed_url?: string | null
          unlocked_beyond_badge_enabled?: boolean | null
          updated_at?: string | null
          vibe_gallery?: Json | null
          zip_code?: string | null
        }
        Relationships: []
      }
      PROFILES: {
        Row: {
          Avatar_url: string | null
          created_at: string
          id: string
        }
        Insert: {
          Avatar_url?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          Avatar_url?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: number
          options: Json | null
          question_type: string | null
          Text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          options?: Json | null
          question_type?: string | null
          Text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          options?: Json | null
          question_type?: string | null
          Text?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: number
          ip_address: unknown | null
          request_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: number
          ip_address?: unknown | null
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: number
          ip_address?: unknown | null
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      safety_settings: {
        Row: {
          allow_messages_from_new_matches: boolean
          block_explicit_content: boolean
          created_at: string
          id: string
          location_sharing_enabled: boolean
          profile_visibility: string
          require_age_verification: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_messages_from_new_matches?: boolean
          block_explicit_content?: boolean
          created_at?: string
          id?: string
          location_sharing_enabled?: boolean
          profile_visibility?: string
          require_age_verification?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_messages_from_new_matches?: boolean
          block_explicit_content?: boolean
          created_at?: string
          id?: string
          location_sharing_enabled?: boolean
          profile_visibility?: string
          require_age_verification?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: number
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: number
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: number
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: never
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: never
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      top_picks: {
        Row: {
          candidate_user_id: string | null
          cooldown_until: string | null
          first_shown_at: string | null
          id: number
          interaction_count: number | null
          is_active: boolean | null
          is_hidden: boolean | null
          last_shown_at: string | null
          priority_score: number | null
          user_id: string | null
          view_count: number | null
          visibility_boost: number | null
        }
        Insert: {
          candidate_user_id?: string | null
          cooldown_until?: string | null
          first_shown_at?: string | null
          id?: never
          interaction_count?: number | null
          is_active?: boolean | null
          is_hidden?: boolean | null
          last_shown_at?: string | null
          priority_score?: number | null
          user_id?: string | null
          view_count?: number | null
          visibility_boost?: number | null
        }
        Update: {
          candidate_user_id?: string | null
          cooldown_until?: string | null
          first_shown_at?: string | null
          id?: never
          interaction_count?: number | null
          is_active?: boolean | null
          is_hidden?: boolean | null
          last_shown_at?: string | null
          priority_score?: number | null
          user_id?: string | null
          view_count?: number | null
          visibility_boost?: number | null
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_user_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_user_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_user_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_timestamp: string | null
          interaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_timestamp?: string | null
          interaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_timestamp?: string | null
          interaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          created_at: string | null
          id: string
          location: string
          location_timestamp: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          location_timestamp?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          location_timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: Database["public"]["Enums"]["report_reason"]
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason: Database["public"]["Enums"]["report_reason"]
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string | null
          email: string | null
          id: number
          name: string
        }
        Insert: {
          auth_id?: string | null
          email?: string | null
          id?: never
          name: string
        }
        Update: {
          auth_id?: string | null
          email?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      vibe_gallery_items: {
        Row: {
          caption: string | null
          content_type: string
          created_at: string
          file_url: string
          id: string
          is_public: boolean | null
          mood_tags: Json | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          content_type: string
          created_at?: string
          file_url: string
          id?: string
          is_public?: boolean | null
          mood_tags?: Json | null
          user_id: string
        }
        Update: {
          caption?: string | null
          content_type?: string
          created_at?: string
          file_url?: string
          id?: string
          is_public?: boolean | null
          mood_tags?: Json | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      archive_expired_matches: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_match_intelligence: {
        Args: { input_user_id: string }
        Returns: {
          compatibility_score: number
          is_premium_preview: boolean
          match_id: string
        }[]
      }
      can_send_message: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_daily_message_limit: {
        Args: { chat_id_param: string; sender_id_param: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_ip_address: unknown
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_security_event_access: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_user_message_limit_access: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_user_security_level: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_whisper_window_constraints: {
        Args: {
          chat_id_param: string
          message_text_param: string
          sender_id_param: string
        }
        Returns: Json
      }
      compute_interaction_risk: {
        Args: { p_user_id: string }
        Returns: {
          block_report_score: number
          computed_user_id: string
          debug_info: Json
          interaction_limit_multiplier: number
          location_shift_score: number
          swiping_anomaly_score: number
          total_risk_score: number
          warning_level: string
        }[]
      }
      compute_match_embedding: {
        Args: { p_matched_user_id: string; p_user_id: string }
        Returns: string
      }
      create_signup_event_for_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      example_function: {
        Args: { param1: string; param2: number }
        Returns: string
      }
      generate_ai_match: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: {
          match_score: number
          matched_user_id: string
        }[]
      }
      generate_ai_match_v2: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_ai_match_wrapper: {
        Args: Record<PropertyKey, never> | { user_id: number }
        Returns: {
          match_id: number
          score: number
          user_id_1: number
          user_id_2: number
        }[]
      }
      generate_daily_compatibility_digest: {
        Args: { p_user_id: string }
        Returns: {
          ai_conversation_starters: Json | null
          digest_content: Json | null
          digest_date: string | null
          generated_at: string | null
          id: number
          new_compatible_profiles: Json | null
          profile_score_deltas: Json | null
          user_id: string | null
        }
      }
      generate_match_preview: {
        Args: { p_preview_user_id: string; p_user_id: string }
        Returns: {
          blurred_avatar_url: string | null
          expires_at: string | null
          id: number
          partial_compatibility_hint: string | null
          preview_generated_at: string | null
          preview_user_id: string | null
          teaser_text: string | null
          user_id: string | null
        }
      }
      generate_match_summary: {
        Args: { p_matched_user_id: string; p_user_id: string }
        Returns: string
      }
      generate_top_picks: {
        Args: { p_max_picks?: number; p_user_id: string }
        Returns: {
          candidate_user_id: string | null
          cooldown_until: string | null
          first_shown_at: string | null
          id: number
          interaction_count: number | null
          is_active: boolean | null
          is_hidden: boolean | null
          last_shown_at: string | null
          priority_score: number | null
          user_id: string | null
          view_count: number | null
          visibility_boost: number | null
        }[]
      }
      get_premium_matches: {
        Args: {
          p_limit?: number
          p_min_compatibility?: number
          p_offset?: number
          p_sort_by?: string
          p_user_id: string
        }
        Returns: {
          ai_match_summary: string
          compatibility_score: number
          embedding: string
          interaction_boost: number
          match_timestamp: string
          matched_user_id: string
        }[]
      }
      get_remaining_messages: {
        Args: { p_user_id: string }
        Returns: number
      }
      increment_message_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      is_user_adult: {
        Args: { user_birth_date: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_event_details?: Json
          p_event_type: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
      perform_sensitive_action: {
        Args: { p_action_details: Json }
        Returns: boolean
      }
      secure_generate_ai_match_deprecated: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          match_score: number
          user_id: string
        }[]
      }
      secure_generate_ai_match_new: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      track_failed_login: {
        Args: { p_email: string; p_ip_address?: unknown; p_user_agent?: string }
        Returns: boolean
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_match_velocity: {
        Args: { p_user_id: string }
        Returns: {
          avg_response_time: unknown | null
          engagement_momentum: number | null
          fastest_response: unknown | null
          id: number
          interaction_quality_score: number | null
          last_updated_at: string | null
          reply_rate: number | null
          responded_matches: number | null
          slowest_response: unknown | null
          total_matches: number | null
          tracked_from: string | null
          user_id: string | null
        }
      }
      validate_user_input: {
        Args: { input_text: string; max_length?: number }
        Returns: boolean
      }
      verify_user_age: {
        Args: { p_date_of_birth: string }
        Returns: boolean
      }
    }
    Enums: {
      report_reason:
        | "inappropriate_content"
        | "harassment"
        | "spam"
        | "fake_profile"
        | "underage"
        | "other"
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
    Enums: {
      report_reason: [
        "inappropriate_content",
        "harassment",
        "spam",
        "fake_profile",
        "underage",
        "other",
      ],
    },
  },
} as const
