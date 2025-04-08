import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../libs/supabaseClient";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const categoryMap = {
    'sport': 'Sport',
    'politics': 'Politics',
    'comedy': 'Comedy',
    'trending': 'Trending',
    'local': 'Local',
    'international': 'International',
    'local-news': 'local news',
    'foreign-news': 'Foreign news',
    'all': 'All'
  };

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        
        const category = categoryMap[categorySlug] || categorySlug;
        setCategoryName(category);

        let query = supabase.from('news').select('*');

        if (categorySlug !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Process news data with proper image URLs
        const processedNews = data.map(newsItem => ({
          ...newsItem,
          // Use imageUrl directly from the table
          imageUrl: newsItem.imageUrl || '/default-news-image.jpg'
        }));

        setNewsData(processedNews || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [categorySlug]);

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center capitalize">
        {categoryName || categorySlug} News
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.length > 0 ? (
          newsData.map((news) => (
            <div key={news.id} className="flex flex-col h-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
              {/* Image container with fixed aspect ratio */}
              <div className="relative pt-[56.25%] overflow-hidden"> {/* 16:9 aspect ratio */}
                <img 
                  src={news.imageUrl}
                  alt={news.title}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-news-image.jpg';
                  }}
                />
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h2 className="text-xl font-semibold text-white line-clamp-2">
                    {news.title}
                  </h2>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-grow p-4 flex flex-col">
                <p className="text-gray-600 mb-3 line-clamp-3 flex-grow">
                  {news.content}
                </p>
                <Link 
                  to={`/post/${news.id}`} 
                  className="text-blue-500 hover:underline font-medium mt-auto inline-block"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No news found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;