import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../libs/supabaseClient";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const categoryMap = {
    sport: "Sport",
    politics: "Politics",
    comedy: "Comedy",
    trending: "Trending",
    local: "Local",
    international: "International",
    "local-news": "local news",
    "foreign-news": "Foreign news",
    all: "All",
  };

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);

        const category = categoryMap[categorySlug] || categorySlug;
        setCategoryName(category);

        let query = supabase.from("news").select("*");

        if (categorySlug !== "all") {
          query = query.eq("category", category);
        }

        const { data, error } = await query;

        if (error) throw error;

        const processedNews = data.map((newsItem) => ({
          ...newsItem,
          imageUrl: newsItem.main_image_url || "/default-news-image.jpg", // <-- use correct column
        }));

        setNewsData(processedNews || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [categorySlug]);

  if (loading) {
    return <div className="mt-10 text-lg text-center">Loading...</div>;
  }

  return (
    <div className="container px-4 py-8 mx-auto mt-24">
      <h1 className="mb-6 text-3xl font-bold text-center capitalize">
        {categoryName || categorySlug} News
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsData.length > 0 ? (
          newsData.map((news) => (
            <div
              key={news.id}
              className="flex flex-col h-full overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              {/* Image container with fixed aspect ratio */}
              <div className="relative pt-[56.25%] overflow-hidden">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="absolute top-0 left-0 object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-news-image.jpg";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-xl font-semibold text-white line-clamp-2">
                    {news.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-4">
                <p className="flex-grow mb-3 text-gray-600 line-clamp-3">
                  {news.content}
                </p>
                <Link
                  to={`/post/${news.id}`}
                  className="inline-block mt-auto font-medium text-blue-500 hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center col-span-full">
            <p className="text-gray-500">No news found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
