import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
    }

    // interface PageData {}
    // interface PageState {}
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
    updated_at: string
  }
}

export {}