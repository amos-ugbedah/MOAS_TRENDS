import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "your-anon-or-service-role-key";
const supabase = createClient(supabaseUrl, supabaseKey);

async function loginUser(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return null;
  }
  return user;
}
