import { supabase } from "../services/supabaseClient";

async function fetchNews() {
  const { data, error } = await supabase.from('news').select('*');

  if (error) {
    console.error("Error fetching news:", error);
    return;
  }

  console.log("Fetched news:", data);
}

fetchNews();
