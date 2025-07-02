import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey, // Anon Key 사용
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      fixed_extensions: {
        Row: {
          id: number
          name: string
          blocked: boolean
        }
        Insert: {
          name: string
          blocked?: boolean
        }
        Update: {
          name?: string
          blocked?: boolean
        }
      }
      custom_extensions: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
      }
    }
  }
}
