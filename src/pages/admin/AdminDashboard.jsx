import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../libs/supabaseClient";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentNews, setRecentNews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    hobby: "",
    profile_picture: null,
  });

  // Cloudinary configuration
  const [cloudName] = useState("your_cloud_name");
  const [uploadPreset] = useState("your_upload_preset");

  // Initialize Cloudinary widget
  const showWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget not loaded yet");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        cropping: true,
        croppingAspectRatio: 1,
        showAdvancedOptions: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData({
            ...formData,
            profile_picture: result.info.secure_url,
          });
        }
      }
    );
    widget.open();
  };

  // Load Cloudinary script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch admin details
  const fetchAdminDetails = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated.");
        navigate("/admin-login");
        return;
      }

      const userEmail = user.email;
      console.log("Authenticated user email:", userEmail);

      // Fetch user role and details
      const { data: userData, error: userFetchError } = await supabase
        .from("users")
        .select("id, fullName, email, role")
        .eq("email", userEmail)
        .single();

      if (userFetchError) {
        console.error("Error fetching user role:", userFetchError.message);
        navigate("/admin-login");
        return;
      }

      if (!userData) {
        console.warn("No user record found for this email.");
        navigate("/admin-login");
        return;
      }

      const userRole = userData.role;

      if (userRole !== "admin") {
        console.error("User is not an admin.");
        navigate("/admin-login");
        return;
      }

      // Fetch admin data
      const { data: adminData, error: adminFetchError } = await supabase
        .from("admindashboard")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (adminFetchError) {
        console.error("Error fetching admin data:", adminFetchError.message);
        navigate("/admin-login");
        return;
      }

      // Set admin details with user's fullName if available
      const admin = adminData || {};
      setAdminDetails({
        ...admin,
        name: admin.name || userData.fullName || "Admin",
      });

      setFormData({
        name: admin.name || userData.fullName || "Admin",
        hobby: admin.hobby || "",
        profile_picture: admin.profile_picture || null,
      });

      // Fetch recent news from the 'news' table with admin_name
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .select("*, admin:admin_name")
        .order("created_at", { ascending: false })
        .limit(5);

      if (newsError) {
        console.warn("Could not fetch news:", newsError.message);
        setRecentNews([]);
      } else {
        setRecentNews(newsData || []);
      }

      // Fetch recently created and edited news items by this admin
      const { data: activityData, error: activityError } = await supabase
        .from("news")
        .select("*")
        .or(`created_by.eq.${user.id},updated_by.eq.${user.id}`)
        .order("created_at", { ascending: false }) // Changed to created_at for more accurate sorting
        .limit(5);

      if (activityError) {
        console.warn("Could not fetch activity:", activityError.message);
        setNotifications([]);
      } else {
        const activityNotifications = activityData
          .map((news) => {
            const action = news.created_by === user.id ? "created" : "updated";
            return {
              message: `${action} news: ${news.title}`,
              timestamp: news.created_at || news.updated_at,
            };
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNotifications(activityNotifications.map((item) => item.message));
      }
    } catch (error) {
      console.error("Error in fetchAdminDetails:", error);
      navigate("/admin-login");
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for news updates
  useEffect(() => {
    fetchAdminDetails();

    const newsSubscription = supabase
      .channel("news_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news",
        },
        () => fetchAdminDetails()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(newsSubscription);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("admindashboard").upsert({
        user_id: user.id,
        name: formData.name,
        hobby: formData.hobby,
        profile_picture: formData.profile_picture,
      });

      if (error) throw error;

      fetchAdminDetails();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Error updating profile");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed w-64 h-full p-4 text-white bg-gray-800 md-w-34">
        <div className="flex flex-col items-center mt-8 mb-4">
          <img
            src={formData.profile_picture || "/default-profile.png"}
            alt="Profile"
            className="object-cover w-32 h-32 border-4 border-white rounded-full"
          />
          <h2 className="mt-2 text-xl font-semibold">{formData.name}</h2>
          <p className="text-sm text-gray-300">{formData.hobby}</p>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate("/create-post")}
                className="w-full p-2 text-left text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add News
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/post-lists")}
                className="w-full p-2 text-left text-white transition duration-200 bg-green-600 rounded-md hover:bg-green-700"
              >
                News List
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/admin-edit-post/1")}
                className="w-full p-2 text-left text-white transition duration-200 bg-yellow-600 rounded-md hover:bg-yellow-700"
              >
                Edit News
              </button>
            </li>
            <li className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full p-2 text-left text-white transition duration-200 bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-16 ml-64">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        {/* Update Profile Section */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Update Profile
          </h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Hobby</label>
              <input
                type="text"
                name="hobby"
                value={formData.hobby}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700">
                Profile Picture
              </label>
              {formData.profile_picture && (
                <img
                  src={formData.profile_picture}
                  alt="Current Profile"
                  className="object-cover w-32 h-32 mb-2 rounded-full"
                />
              )}
              <button
                type="button"
                onClick={showWidget}
                className="px-4 py-2 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Upload New Image
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2 text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Stats and Recent Activity */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Recent News Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Recent News
            </h2>
            {recentNews.length === 0 ? (
              <p className="text-gray-500">No recent news available.</p>
            ) : (
              <ul className="space-y-3">
                {recentNews.map((news) => (
                  <li key={news.id} className="pb-2 border-b">
                    <Link
                      to={`/post/${news.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {news.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-600">
                      {news.body?.slice(0, 100)}...
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Posted by: {news.admin_name || formData.name || "Admin"} •{" "}
                      {formatDate(news.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Notifications Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Recent Activity
            </h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No recent activities.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((notification, index) => (
                  <li key={index} className="pb-2 border-b">
                    <p className="text-gray-700">{notification}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
