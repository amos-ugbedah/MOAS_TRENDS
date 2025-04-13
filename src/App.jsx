import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./libs/supabaseClient";

// Import components
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
import SearchResults from "./pages/SearchResults";
import Navbar from "./components/layout/Navbar";
import SubscribeForm from "./pages/SubscribeForm";
import PostDetailPage from "./pages/PostDetailPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound"; // Import dedicated 404 component

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
    if (loading) return <div className="flex justify-center mt-24"><p className="text-lg">Loading...</p></div>;
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    if (loading) return <div className="flex justify-center mt-24"><p className="text-lg">Loading...</p></div>;
    return user?.role === "admin" ? children : <Navigate to="/admin-login" />;
  };

  return (
    <>
      <Navbar />
      <div className="mt-24"> {/* Added mt-24 to account for navbar */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/subscribe" element={<SubscribeForm />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/search-results" element={<SearchResults />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/edit-post/:id" element={<PrivateRoute><EditPostsUser /></PrivateRoute>} />
          <Route path="/edit-single-post/:id" element={<PrivateRoute><EditSinglePost /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/create-post" element={<AdminRoute><AddPosts /></AdminRoute>} />
          <Route path="/admin-edit-post/:id" element={<AdminRoute><EditPostsAdmin /></AdminRoute>} />
          <Route path="/post-lists" element={<AdminRoute><PostLists /></AdminRoute>} />

          {/* 404 Catch-all Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;