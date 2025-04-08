import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../libs/supabaseClient";
import NewsHeader from "../components/NewsHeader";
import NewsGrid from "../components/NewsGrid";

const NewsPage = ({ successMessage = "" }) => {
  const [articles, setArticles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [likedNews, setLikedNews] = useState({});
  const [savedNews, setSavedNews] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [commentBoxVisible, setCommentBoxVisible] = useState({});
  const [session, setSession] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "Date Not Available";
    const formattedDate = new Date(date);
    if (isNaN(formattedDate)) return "Invalid Date";

    return formattedDate.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubscribe = () => {
    navigate("/subscribe");
  };

  const handleLike = async (newsId) => {
    if (!session?.user?.email) {
      alert("You must be logged in to like an article.");
      return;
    }

    try {
      if (likedNews[newsId]) {
        await supabase.from("likes").delete()
          .match({ user_id: session.user.email, news_id: newsId });
        setLikedNews(prev => ({ ...prev, [newsId]: false }));
      } else {
        await supabase.from("likes").insert({
          user_id: session.user.email,
          news_id: newsId,
          liked_at: new Date().toISOString()
        });
        setLikedNews(prev => ({ ...prev, [newsId]: true }));
      }
    } catch (error) {
      console.error("Error handling like:", error.message);
    }
  };

  const handleSave = async (newsId) => {
    if (!session?.user?.email) {
      alert("You must be logged in to save an article.");
      return;
    }

    try {
      if (savedNews[newsId]) {
        await supabase.from("saved_news").delete()
          .match({ user_id: session.user.email, news_id: newsId });
        setSavedNews(prev => ({ ...prev, [newsId]: false }));
      } else {
        await supabase.from("saved_news").insert({
          user_id: session.user.email,
          news_id: newsId,
          saved_at: new Date().toISOString()
        });
        setSavedNews(prev => ({ ...prev, [newsId]: true }));
      }
    } catch (error) {
      console.error("Error handling save:", error.message);
    }
  };

  const toggleCommentBox = (newsId) => {
    setCommentBoxVisible(prev => ({
      ...prev,
      [newsId]: !prev[newsId]
    }));
  };

  const handleCommentUpdate = (newsId, updatedComments) => {
    setComments(prev => ({
      ...prev,
      [newsId]: updatedComments
    }));
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let query = supabase
          .from("news_with_authors")
          .select(`
            id, 
            title, 
            body, 
            imageUrl, 
            category, 
            created_at, 
            author_name,
            last_edited_by
          `)
          .order("created_at", { ascending: false });

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

  useEffect(() => {
    const getSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setSession(session);

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    };

    getSession();
  }, []);

  useEffect(() => {
    const fetchLikesAndSaves = async () => {
      if (!session?.user?.email) return;

      try {
        const { data: likes } = await supabase
          .from("likes")
          .select("news_id")
          .eq("user_id", session.user.email);

        const { data: saves } = await supabase
          .from("saved_news")
          .select("news_id")
          .eq("user_id", session.user.email);

        setLikedNews(likes?.reduce((acc, { news_id }) => ({ ...acc, [news_id]: true }), {}));
        setSavedNews(saves?.reduce((acc, { news_id }) => ({ ...acc, [news_id]: true }), {}));
      } catch (error) {
        console.error("Error fetching likes and saves:", error.message);
      }
    };

    fetchLikesAndSaves();
  }, [session]);

  return (
    <div className="container mx-auto py-6">
      <NewsHeader 
        category={category} 
        successMessage={successMessage} 
        handleSubscribe={handleSubscribe} 
      />

      {errorMessage ? (
        <p className="text-center text-red-500 mx-4">{errorMessage}</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 mx-4">
          No articles found for this category.
        </p>
      ) : (
        <NewsGrid
          articles={articles}
          likedNews={likedNews}
          savedNews={savedNews}
          comments={comments}
          commentBoxVisible={commentBoxVisible}
          handleLike={handleLike}
          handleSave={handleSave}
          toggleCommentBox={toggleCommentBox}
          newComment={newComment}
          setNewComment={setNewComment}
          session={session}
          formatDate={formatDate}
          setComments={handleCommentUpdate}
        />
      )}
    </div>
  );
};

export default NewsPage;