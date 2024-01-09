// supabaserealtime.d.ts
declare module '~/types/supabaserealtime' {
    type SupabaseRealtimeType = {
      publish(channel: string, payload: any): void;
      subscribe(channel: string, callback: (payload: any) => void): void;
    };
  
    export type { SupabaseRealtimeType };
  }
  