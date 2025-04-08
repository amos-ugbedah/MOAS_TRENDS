import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation
import { supabase } from "../libs/supabaseClient";
import FetchNews from "./FetchNews"; // Import FetchNews component
import NewsPage from "./NewsPage"; // Import NewsPage component

const Dashboard = () => {
  const [savedNews, setSavedNews] = useState([]);
  const [news, setNews] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [comment, setComment] = useState("");
  const [selectedNews, setSelectedNews] = useState(null); // Store selected news for viewing
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        console.error("User not found:", error?.message);
        navigate("/login"); // Redirect to login if no user is found
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchSavedNews();
      fetchAllNews();
    }
  }, [user]);

  const fetchSavedNews = async () => {
    const { data, error } = await supabase
      .from("saved_news")
      .select("news_id, news(title, body, imageUrl)")
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error fetching saved news:", error.message);
    } else {
      setSavedNews(data);
    }
  };

  const fetchAllNews = async () => {
    const { data, error } = await supabase.from("news").select("*");

    if (error) {
      console.error("Error fetching news:", error.message);
    } else {
      setNews(data);
    }
  };

  const saveNews = async (newsId) => {
    const { error } = await supabase
      .from("saved_news")
      .insert({ user_id: user?.id, news_id: newsId });

    if (error) {
      console.error("Error saving news:", error.message);
    } else {
      fetchSavedNews();
    }
  };

  const subscribeNewsletter = async () => {
    const { error } = await supabase
      .from("subscriptions")
      .insert({ email: newsletterEmail });

    if (error) {
      console.error("Error subscribing to newsletter:", error.message);
    } else {
      alert("Subscribed successfully!");
      setNewsletterEmail(""); // Clear input field after successful subscription
    }
  };

  const likeNews = async (newsId) => {
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: user?.id, news_id: newsId });

    if (error) {
      console.error("Error liking news:", error.message);
    } else {
      alert("Liked successfully!");
    }
  };

  const addComment = async (newsId) => {
    if (!comment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    const { error } = await supabase
      .from("comments")
      .insert({ user_id: user?.id, news_id: newsId, comment });

    if (error) {
      console.error("Error adding comment:", error.message);
    } else {
      alert("Comment added successfully!");
      setComment(""); // Clear the comment field after submission
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl mb-6">Dashboard</h1>

      {/* Saved News Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Saved News</h2>
        <ul>
          {savedNews.length > 0 ? (
            savedNews.map((item) => (
              <li key={item.news_id} className="border-b py-2">
                <h3>{item.news.title}</h3>
                <p>{item.news.body}</p>
              </li>
            ))
          ) : (
            <p>No saved news yet.</p>
          )}
        </ul>
      </section>

      {/* Subscribe to Newsletter */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Subscribe to Newsletter</h2>
        <div className="flex gap-2">
          <input
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={subscribeNewsletter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Subscribe
          </button>
        </div>
      </section>

      {/* News Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">News</h2>
        {selectedNews ? (
          <NewsPage news={selectedNews} onBack={() => setSelectedNews(null)} />
        ) : (
          <ul>
            {news.length > 0 ? (
              news.map((item) => (
                <li key={item.id} className="border-b py-4">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p>{item.body}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => saveNews(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => likeNews(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Like
                    </button>
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    >
                      View News
                    </button>
                  </div>
                  {/* Comment Input */}
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="p-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                      onClick={() => addComment(item.id)}
                      className="bg-gray-700 text-white px-3 py-1 rounded-md"
                    >
                      Comment
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No news available.</p>
            )}
          </ul>
        )}
      </section>

      {/* Conditionally Render FetchNews Component */}
      {!selectedNews && <FetchNews />}
    </div>
  );
};

export default Dashboard;
