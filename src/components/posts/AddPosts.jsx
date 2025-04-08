import { addPostInputs } from "../../constant/posts";
import Title from "../Title";

import CustomInput from "../customInput";
import FileInput from "../customInput/FileInput";

import useAddPost from "../admin/hooks/useAddPost";

const AddPosts = () => {
  const {
    control,
    handleClearImage,
    handleFileChange,
    preview,
    handleSubmit,
    onSubmit,
    isloading,
  } = useAddPost();
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Title showClose={true} className="text-xl font-bold text-black">
        Add New Post
      </Title>

      {addPostInputs.map(({ name, label, type, placeholder }) => (
        <CustomInput
          name={name}
          label={label}
          type={type}
          placeholder={placeholder}
          control={control}
        />
      ))}
      <FileInput
        onChange={handleFileChange}
        preview={preview}
        handleClearImage={handleClearImage}
      />

      <button
        type="submit"
        className="bg-purple-500 text-white p-2 rounded-md w-full"
      >
        {isloading ? "Loading..." : "Add Post"}
      </button>
    </form>
  );
};

export default AddPosts;
