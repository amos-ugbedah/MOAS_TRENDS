import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [subheadings, setSubheadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorName, setAuthorName] = useState("Staff Writer");

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);

        // Fetch the main post + author from users table
        const { data: postData, error: postError } = await supabase
          .from("news")
          .select(
            `
            *,
            author:users!author_id (
              fullName
            )
          `
          )
          .eq("id", id)
          .single();

        if (postError) throw postError;

        // Fetch subheadings for this post
        const { data: subheadingsData, error: subError } = await supabase
          .from("subheadings")
          .select("*")
          .eq("post_id", id)
          .order("created_at", { ascending: true });

        if (subError) throw subError;

        setPost(postData);
        setSubheadings(subheadingsData || []);

        // Determine author name
        const authorFromUserTable = postData.author?.fullName;
        const fallbackAdminName = postData.admin_name;
        setAuthorName(authorFromUserTable || fallbackAdminName || "Admin");

      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
        toast.error("Failed to load post details");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!post) return <div className="py-8 text-center">Post not found</div>;

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto mt-24">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 mb-4 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back
      </button>

      <article className="p-6 bg-white rounded-lg shadow">
        <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>

        <p className="mb-4 text-sm text-gray-500">
          Posted on {new Date(post.created_at).toLocaleDateString()} by{" "}
          <span className="font-medium">{authorName}</span>
        </p>

        {post.main_image_url && (
          <img
            src={post.main_image_url}
            alt={post.title}
            className="object-contain w-full h-auto mb-6 rounded-lg max-h-96"
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
              e.target.classList.add("opacity-70");
            }}
          />
        )}

        <div className="mb-8 prose max-w-none">
          <p className="whitespace-pre-line">{post.body}</p>
        </div>

        {/* Display subheadings */}
        {subheadings.map((subheading, index) => (
          <div key={index} className="mb-8">
            <h2 className="mb-2 text-2xl font-semibold">{subheading.subheading_title}</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {subheading.subheading_content}
            </p>
          </div>
        ))}

        {/* Display additional images if any */}
        {post.additional_images?.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2">
            {post.additional_images.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`${post.title} - ${index + 1}`}
                className="object-contain w-full h-auto rounded-lg max-h-64"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                  e.target.classList.add("opacity-70");
                }}
              />
            ))}
          </div>
        )}

        {/* Display video if available */}
        {post.video_url && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Video</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={post.video_url}
                title={post.title}
                className="w-full h-96"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetailPage;
