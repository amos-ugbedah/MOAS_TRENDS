import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../libs/supabaseClient";

const DynamicNewsTitle = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestNews = async () => {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
      let query = supabase
        .from("news")
        .select("id, title")
        .gte("created_at", twelveHoursAgo)
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (!error) {
        setLatestNews(data || []);
      } else {
        console.error("Error fetching latest news:", error.message);
      }
    };

    fetchLatestNews();
  }, [category]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) =>
        latestNews.length > 0 ? (prevIndex + 1) % latestNews.length : 0
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [latestNews]);

  return (
    <div className="text-white text-sm sm:text-lg font-bold truncate">
      {latestNews.length > 0 ? (
        <span
          onClick={() => navigate(`/post/${latestNews[currentTitleIndex]?.id}`)}
          className="cursor-pointer hover:underline block truncate"
        >
          {latestNews[currentTitleIndex]?.title}
        </span>
      ) : (
        <span className="block truncate">No news available for this category.</span>
      )}
    </div>
  );
};

export default DynamicNewsTitle;