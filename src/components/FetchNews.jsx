import { useEffect, useState } from 'react';

const FetchNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news?select=id`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_KEY, // Use the environment variable with the correct prefix
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_KEY}` // Use the environment variable with the correct prefix
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else {
          throw new Error('Failed to fetch news');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      <h1>News</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {news.map((newsItem) => (
          <li key={newsItem.id}>{newsItem.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default FetchNews;
