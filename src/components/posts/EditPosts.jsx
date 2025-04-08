import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate, useParams } from "react-router";
import Title from "../Title";

const EditPosts = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const intialState = {
    title: "",
    body: "",
  };
  const [values, setValues] = useState(intialState);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSinglePost = async () => {
      setIsPending(true);
      try {
        const { data } = await axiosInstance.get(`/rest/v1/posts?id=eq.${postId}`);
        setValues({
          title: data[0]?.title,
          body: data[0]?.body,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsPending(false);
      }
    };

    getSinglePost();
  }, [postId]);

  const handleSumit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!values.title.trim() || !values.body.trim()) {
      setError("Please fill in all the fields");
      setIsLoading(false);
      return;
    }

    try {
      await axiosInstance.patch(`/rest/v1/posts?id=eq.${postId}`, values);
      setError(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setValues(intialState);
    }
  };

  if (isPending) return <p className="text-2xl font-medium">Loading...</p>;
  return (
    <form className="space-y-4" onSubmit={handleSumit}>
      <Title showClose={true} className="text-xl font-bold text-black">
        Edit Post
      </Title>

      {error && !isloading && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="title" className="text-black font-medium capitalize">
          title
        </label>
        <input
          type="text"
          onChange={handleOnChange}
          value={values.title}
          name="title"
          id="title"
          className="w-full p-2 border-purple-500 border rounded-md outline-none"
          placeholder="Enter Title"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="body" className="text-black font-medium capitalize">
          body
        </label>
        <textarea
          type="text"
          onChange={handleOnChange}
          value={values.body}
          name="body"
          id="body"
          className="w-full p-2
         border-purple-500 border rounded-md outline-none"
          placeholder="Enter Body"
          rows={5}
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-purple-500 text-white p-2 rounded-md w-full"
      >
        {isloading ? "Loading..." : "Update Post"}
      </button>
    </form>
  );
};

export default EditPosts;
