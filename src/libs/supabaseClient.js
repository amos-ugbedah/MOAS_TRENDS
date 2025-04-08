import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Configure retry mechanism
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => 
    ['ECONNABORTED', 'ECONNRESET', 'ETIMEDOUT'].includes(error.code) || 
    !error.response
});

// Create the Supabase client instance
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
    },
    global: {
      headers: { 'x-application': 'moas-trends' },
      fetch: (url, options) => {
        // Add timeout to all requests
        return fetch(url, { ...options, timeout: 30000 });
      }
    }
  }
);

// Heartbeat to maintain connection
const heartbeatInterval = setInterval(async () => {
  try {
    await supabase.from('heartbeat').select('*').limit(1).single();
    console.debug('Supabase connection active');
  } catch (error) {
    console.warn('Supabase connection issue:', error.message);
    clearInterval(heartbeatInterval);
  }
}, 30000);

// For backwards compatibility
export default supabase;