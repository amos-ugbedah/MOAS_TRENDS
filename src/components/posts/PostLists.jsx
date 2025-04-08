import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { BadgeX, Pencil } from "lucide-react";
import { Link } from "react-router";
import Title from "../Title";

const PostLists = () => {
  const [posts, setPosts] = React.useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const getAllPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/rest/v1/posts");
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllPosts();
  }, []);

  const handleDelete = async (id) => {
    if(!id) return;
    setIsPending(true);
    try {
      await axiosInstance.delete(`/posts?id=eq.${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  }
  return (
    <section className="flex-1 bg-white shadow-amber-500 shadow-md p-3 rounded-b-lg overflow-y-auto">
      <Title text="Add Post" textLink="/create-post">
        Post Lists
      </Title>

      {isloading && <p>Loading...</p>}
      <div className="grid grid-cols-2 gap-4">
        {posts?.map((post, index) => (
          <div
            key={post.id}
            className="bg-gray-100 p-3 my-3 rounded-lg space-y-2 flex justify-between "
          >
            <div>
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
              <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
              <p className="text-gray-600">{post.body}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-red-500 size-4" onClick={() => handleDelete(post?.id)}>
              <BadgeX className={`size-full ${isPending && index ? "animate-spin" : ""}`} />
              </button>
              <Link to={`/edit-post/${post.id}`}>
                <Pencil className="text-purple-500 size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostLists;
