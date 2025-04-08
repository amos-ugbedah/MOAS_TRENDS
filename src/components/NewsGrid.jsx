import React from "react";
import ArticleCard from "./ArticleCard";
import CommentSection from "./CommentSection";

const NewsGrid = ({
  articles = [],
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
  setComments
}) => {
  if (!articles || !Array.isArray(articles)) {
    return <p className="text-center text-red-500 mx-4">No articles available</p>;
  }

  const handleCommentUpdate = (newsId, newComment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [newsId]: [...(prevComments[newsId] || []), newComment]
    }));
  };

  const fallbackImage = "/default-news-image.jpg";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-4">
      {articles.map((article) => {
        if (!article?.id) return null;

        return (
          <div key={article.id} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
            {/* Image Container */}
            <div className="w-full aspect-video overflow-hidden">
              <img
                src={article.imageUrl || fallbackImage}
                alt={article.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center top" }}
                onError={(e) => {
                  e.target.src = fallbackImage;
                  e.target.className = "w-full h-full object-contain bg-gray-100 p-4";
                }}
              />
            </div>
            
            {/* Article Content */}
            <div className="p-4">
              <ArticleCard
                article={{ 
                  ...article, 
                  imageUrl: undefined // Prevent duplicate images
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
              
              <div className="mt-2 text-xs text-gray-500 space-y-1">
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