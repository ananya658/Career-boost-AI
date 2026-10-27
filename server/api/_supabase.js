import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './_wake.js';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://mock-careerboost.supabase.co';
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.mock-service-key';

export const isServerSupabaseConfigured = Boolean(
  (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!isServerSupabaseConfigured) {
  console.warn(
    '[CareerBoost Server] SUPABASE_SERVICE_ROLE_KEY is not set. Server API running in development/fallback mode.'
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  global: {
    fetch: async (url, options) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok && res.status >= 500) triggerRestore();
        return res;
      } catch (err) {
        triggerRestore();
        throw err;
      }
    },
  },
});

export default supabase;