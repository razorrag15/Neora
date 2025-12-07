/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  
  // NEORA Backend
  readonly VITE_BACKEND_URL: string
  readonly VITE_ADMIN_KEY: string
  
  // Gemini AI
  readonly GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}