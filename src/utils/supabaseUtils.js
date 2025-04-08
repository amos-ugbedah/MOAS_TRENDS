// supabaseUtils.js
import { supabase } from './supabaseClient';

export const fetchUserData = async () => {
  const { data, error } = await supabase.from('users').select('id');

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
