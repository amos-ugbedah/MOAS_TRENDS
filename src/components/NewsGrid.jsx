import React, { useEffect, useState } from "react";
import supabase from "../libs/supabaseClient"; // Adjust the import to your actual supabase client configuration
import ArticleCard from "./ArticleCard";
import CommentSection from "./CommentSection";

const NewsGrid = ({
  likedNews = {},
  savedNews = {},
  comments = {},
  commentBoxVisible = {},
  handleLike,
  handleSave,
  toggleCommentBox,
  newComment,
  setNewComment,
  session,
  formatDate,
  setComments,
  category
}) => {
  const [articles, setArticles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch articles from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let query = supabase
          .from("news_with_authors")
          .select(
            "id, title, body, main_image_url, category, created_at, author_name, last_edited_by"
          )
          .order("created_at", { ascending: false });

        // Adding category filter
        if (category && category !== "All") {
          if (category === "Trending") {
            query = query.in("category", ["Trending", "Comedy"]);
          } else if (category === "Metro") {
            query = query.in("category", ["Local", "Local News", "Foreign", "International News"]);
          } else {
            query = query.eq("category", category);
          }
        }

        const { data, error } = await query;

        if (error) throw error;

        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching articles:", error.message);
        setErrorMessage("Unable to fetch articles. Please try again later.");
        setArticles([]);
      }
    };

    fetchArticles();
  }, [category]);

  const handleCommentUpdate = (newsId, newComment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [newsId]: [...(prevComments[newsId] || []), newComment],
    }));
  };

  const fallbackImage = "/default-news-image.jpg"; // Default fallback image path

  // Return a message if no articles are available
  if (!articles || !Array.isArray(articles)) {
    return <p className="mx-4 text-center text-red-500">{errorMessage || "No articles available"}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 mx-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {articles.map((article) => {
        if (!article?.id) return null;

        return (
          <div key={article.id} className="mb-8 overflow-hidden transition-all bg-white rounded-lg shadow-md hover:shadow-lg">
            {/* Image Container */}
            <div className="w-full overflow-hidden aspect-video">
              <img
                src={article.main_image_url || fallbackImage}
                alt={article.title}
                className="object-cover w-full h-full"
                style={{ objectPosition: "center top" }}
                onError={(e) => {
                  e.target.src = fallbackImage;
                  e.target.className = "object-contain w-full h-full p-4 bg-gray-100";
                }}
              />
            </div>
            
            {/* Article Content */}
            <div className="p-4">
              <ArticleCard
                article={{
                  ...article,
                  main_image_url: undefined // Prevent duplicate images
                }}
                likedNews={likedNews}
                savedNews={savedNews}
                comments={comments[article.id] || []}
                commentBoxVisible={commentBoxVisible[article.id] || false}
                handleLike={() => handleLike(article.id)}
                handleSave={() => handleSave(article.id)}
                toggleCommentBox={() => toggleCommentBox(article.id)}
                newComment={newComment}
                setNewComment={setNewComment}
                session={session}
              />
              
              <div className="mt-2 space-y-1 text-xs text-gray-500">
                <p>Posted: {formatDate(article.created_at)}</p>
                <p>By {article.author_name || "Staff Writer"}</p>
                {article.last_edited_by && (
                  <p>Edited by: {article.last_edited_by}</p>
                )}
              </div>
            </div>
            
            {/* Comments Section */}
            {commentBoxVisible[article.id] && (
              <div className="px-4 pb-4">
                <CommentSection
                  newsId={article.id}
                  session={session}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  comments={comments[article.id] || []}
                  setComments={(newComment) => handleCommentUpdate(article.id, newComment)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NewsGrid;
