// src/services/api.js

const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          'apikey': 'YOUR_SUPABASE_KEY', // Replace with your Supabase API key
          'Authorization': 'Bearer YOUR_SUPABASE_KEY' // Replace with your Supabase API key
        }
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export default fetchData;
  