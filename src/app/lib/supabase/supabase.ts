import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl: string = process.env.DB_NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey: string = process.env
  .DB_NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const createsupabaseClient = createBrowserClient(
  supabaseUrl,
  supabaseKey
);

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}
