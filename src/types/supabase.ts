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
      chat_message: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_read: boolean | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      comment: {
        Row: {
          created_at: string
          id: string
          task_id: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          task_id: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      follow: {
        Row: {
          follower_id: string
          following_id: string | null
          id: string
        }
        Insert: {
          follower_id: string
          following_id?: string | null
          id?: string
        }
        Update: {
          follower_id?: string
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      phase: {
        Row: {
          end_at: string | null
          id: string
          name: string | null
          project_id: string
          start_at: string
        }
        Insert: {
          end_at?: string | null
          id?: string
          name?: string | null
          project_id: string
          start_at: string
        }
        Update: {
          end_at?: string | null
          id?: string
          name?: string | null
          project_id?: string
          start_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phase_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["project_id"]
          }
        ]
      }
      phase_property: {
        Row: {
          id: string
          name: string
          phase_id: string
          type: string
        }
        Insert: {
          id?: string
          name?: string
          phase_id: string
          type?: string
        }
        Update: {
          id?: string
          name?: string
          phase_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "phase_property_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phase"
            referencedColumns: ["id"]
          }
        ]
      }
      post_comments: {
        Row: {
          comment_id: string
          created_at: string | null
          post_id: string | null
          user_id: string
          value: string
        }
        Insert: {
          comment_id?: string
          created_at?: string | null
          post_id?: string | null
          user_id: string
          value?: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          post_id?: string | null
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "research_post"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      post_likes: {
        Row: {
          like_id: string
          post_id: string
          user_id: string
        }
        Insert: {
          like_id?: string
          post_id: string
          user_id: string
        }
        Update: {
          like_id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "research_post"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      profile: {
        Row: {
          about_me: string | null
          avatar_url: string | null
          collab_status: string | null
          name: string
          profile_id: string
          research_interest: string | null
          skills: string | null
          user_id: string
        }
        Insert: {
          about_me?: string | null
          avatar_url?: string | null
          collab_status?: string | null
          name: string
          profile_id?: string
          research_interest?: string | null
          skills?: string | null
          user_id: string
        }
        Update: {
          about_me?: string | null
          avatar_url?: string | null
          collab_status?: string | null
          name?: string
          profile_id?: string
          research_interest?: string | null
          skills?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_achievement: {
        Row: {
          achievement_id: string
          description: string | null
          received_year: string
          title: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string
          description?: string | null
          received_year: string
          title: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string
          description?: string | null
          received_year?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_achievement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_education: {
        Row: {
          description: string | null
          education_id: string
          end_year: string | null
          school: string
          start_year: string | null
          user_id: string
        }
        Insert: {
          description?: string | null
          education_id?: string
          end_year?: string | null
          school: string
          start_year?: string | null
          user_id: string
        }
        Update: {
          description?: string | null
          education_id?: string
          end_year?: string | null
          school?: string
          start_year?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_experience: {
        Row: {
          description: string | null
          end_year: string | null
          experience_id: string
          start_year: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          description?: string | null
          end_year?: string | null
          experience_id?: string
          start_year?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          description?: string | null
          end_year?: string | null
          experience_id?: string
          start_year?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_experience_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      project: {
        Row: {
          c_score: number
          cover_img: string | null
          description: string
          name: string
          p_score: number
          project_id: string
          workspace_id: string
        }
        Insert: {
          c_score?: number
          cover_img?: string | null
          description: string
          name: string
          p_score?: number
          project_id?: string
          workspace_id: string
        }
        Update: {
          c_score?: number
          cover_img?: string | null
          description?: string
          name?: string
          p_score?: number
          project_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          }
        ]
      }
      project_users: {
        Row: {
          is_external_collaborator: boolean
          project_id: string
          project_role: string
          user_id: string
        }
        Insert: {
          is_external_collaborator?: boolean
          project_id: string
          project_role: string
          user_id: string
        }
        Update: {
          is_external_collaborator?: boolean
          project_id?: string
          project_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      property_phase_task: {
        Row: {
          index: number
          phase_id: string
          property_id: string
          task_id: string
          value: string | null
        }
        Insert: {
          index: number
          phase_id: string
          property_id: string
          task_id: string
          value?: string | null
        }
        Update: {
          index?: number
          phase_id?: string
          property_id?: string
          task_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_phase_task_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_phase_task_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "phase_property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_phase_task_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task"
            referencedColumns: ["id"]
          }
        ]
      }
      research_interests: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      research_post: {
        Row: {
          author: string | null
          category: string
          created_at: string
          description: string | null
          document: string | null
          post_id: string
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author?: string | null
          category: string
          created_at?: string
          description?: string | null
          document?: string | null
          post_id?: string
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string | null
          category?: string
          created_at?: string
          description?: string | null
          document?: string | null
          post_id?: string
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_post_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      task: {
        Row: {
          attachments: string[] | null
          created_at: string
          description: string | null
          end_at: string | null
          id: string
          name: string
          phase_id: string
          status: string
        }
        Insert: {
          attachments?: string[] | null
          created_at: string
          description?: string | null
          end_at?: string | null
          id?: string
          name?: string
          phase_id: string
          status?: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          name?: string
          phase_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phase"
            referencedColumns: ["id"]
          }
        ]
      }
      task_assignees: {
        Row: {
          assignee_id: string
          phase_id: string
          task_id: string
        }
        Insert: {
          assignee_id: string
          phase_id: string
          task_id: string
        }
        Update: {
          assignee_id?: string
          phase_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignees_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignees_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          avatar_url: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      workspace: {
        Row: {
          cover_img: string | null
          created_at: string
          description: string
          id: string
          is_personal: boolean
          name: string
          ownerid: string | null
        }
        Insert: {
          cover_img?: string | null
          created_at?: string
          description: string
          id?: string
          is_personal?: boolean
          name: string
          ownerid?: string | null
        }
        Update: {
          cover_img?: string | null
          created_at?: string
          description?: string
          id?: string
          is_personal?: boolean
          name?: string
          ownerid?: string | null
        }
        Relationships: []
      }
      workspace_user: {
        Row: {
          is_collaborator: boolean | null
          userid: string
          workspace_role: string
          workspaceid: string
        }
        Insert: {
          is_collaborator?: boolean | null
          userid: string
          workspace_role?: string
          workspaceid: string
        }
        Update: {
          is_collaborator?: boolean | null
          userid?: string
          workspace_role?: string
          workspaceid?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_user_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_user_workspaceid_fkey"
            columns: ["workspaceid"]
            isOneToOne: false
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          }
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
      category:
        | "Article"
        | "Conference Paper"
        | "Presentation"
        | "Preprint"
        | "Research Proposal"
        | "Thesis"
        | "Others"
      collab_status: "Open For Collaboration" | "Not Open for Collaboration"
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
