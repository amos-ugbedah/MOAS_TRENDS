import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { BadgeX, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Title from "../Title";

const PostLists = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const getAllPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/news");
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllPosts();
  }, []);

  const confirmDelete = (id) => {
    setSelectedPostId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPostId) return;
    setIsPending(true);
    try {
      // Update the delete API endpoint to target the 'news' table instead of 'posts'
      await axiosInstance.delete(`/news?id=eq.${selectedPostId}`);
      setShowModal(false);
      setPosts(posts.filter((post) => post.id !== selectedPostId));
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
      setSelectedPostId(null);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate("/admin-dashboard");
  };

  const truncateBody = (body) => {
    return body.length > 150 ? body.substring(0, 150) + "..." : body;
  };

  const handleEdit = (post) => {
    navigate(`/edit-single-post/${post.id}`, { state: { post } });
  };

  return (
    <section className="flex-1 bg-white shadow-amber-500 shadow-md p-3 rounded-b-lg overflow-y-auto mt-20">
      <Title text="Add Post" textLink="/create-post">
        Post Lists
      </Title>

      {isloading && <p>Loading...</p>}

      <button
        type="button"
        onClick={handleBack}
        className="bg-gray-300 text-black p-2 rounded-md w-full mt-2"
      >
        Go Back
      </button>

      <button
        type="button"
        onClick={handleGoToDashboard}
        className="bg-blue-500 text-white p-2 rounded-md w-full mt-2"
      >
        Admin Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts?.map((post, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-md shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700">{truncateBody(post.body)}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleEdit(post)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil />
              </button>
              <button
                onClick={() => confirmDelete(post.id)}
                className="text-red-500 hover:text-red-700"
              >
                <BadgeX />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Yes"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostLists;
