import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./libs/supabaseClient";

import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import NewsPage from "./pages/NewsPage";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryPage from "./pages/CategoryPage";

import AddPosts from "./components/admin/AddPosts";
import EditPostsAdmin from "./components/admin/EditPosts";
import EditPostsUser from "./components/posts/EditPosts";
import EditSinglePost from "./components/posts/EditSinglePost";
import PostLists from "./components/admin/PostLists";
import SearchResults from "./pages/SearchResults"; // Import SearchResults component

import Navbar from "./components/layout/Navbar";
import SubscribeForm from "./pages/SubscribeForm";
import PostDetailPage from "./pages/PostDetailPage";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async (authUserId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, fullName, email, role")
        .eq("id", authUserId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error.message);
        setUser(null);
      } else {
        setUser(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching user details:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.warn("No active session found");
        setUser(null);
        setLoading(false);
        return;
      }

      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting current user:", userError.message);
        setUser(null);
        setLoading(false);
        return;
      }

      if (authUser?.id) {
        fetchUserDetails(authUser.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    initUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserDetails(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return <p className="text-center text-lg mt-10">Loading...</p>;
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    if (loading) return <p className="text-center text-lg mt-10">Loading...</p>;
    return user?.role === "admin" ? children : <Navigate to="/admin-login" />;
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/subscribe" element={<SubscribeForm />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />

        {/* Search Results Route */}
        <Route path="/search-results" element={<SearchResults />} /> {/* Added SearchResults */}

        {/* Protected User Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/edit-post/:id" element={<PrivateRoute><EditPostsUser /></PrivateRoute>} />
        <Route path="/edit-single-post/:postId" element={<PrivateRoute><EditSinglePost /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/create-post" element={<AdminRoute><AddPosts /></AdminRoute>} />
        <Route path="/admin-edit-post/:id" element={<AdminRoute><EditPostsAdmin /></AdminRoute>} />
        <Route path="/post-lists" element={<AdminRoute><PostLists /></AdminRoute>} />

        {/* Post Detail Route */}
        <Route path="/post/:id" element={<PostDetailPage />} />

        {/* Catch-All Route */}
        <Route path="*" element={<h1 className="text-center text-lg text-red-500 mt-10">404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
