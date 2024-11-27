import { SupabaseClient, Session } from "@supabase/supabase-js"
import { Database } from "./DatabaseDefinitions"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      supabaseServiceRole: SupabaseClient<Database>
      safeGetSession(): Promise<{ session: Session | null; user: User | null }>
    }
    interface PageData {
      session: Session | null
    }
    // interface Error {}
    // interface Platform {}
  }
  interface Category {
    id: string,
    created_at: string,
    description: string,
    thumbnail: string,
    title: string,
    slug: string,
    updated_at: string
  }

  interface Track {
    id: string;
    audio: AudioBuffer | null;
    title: string;
    volume: number;
    audioSrc: string;
    gainNode: GainNode | null;
    sourceNode: AudioBufferSourceNode | null;
  }

  interface Clip {
    id: string,
    category: string,
    created_at: string,
    description: string,
    thumbnail: string,
    title: string,
    tracks: Track[],
    updated_at: string,
    slug: string
  }
}

export {}
