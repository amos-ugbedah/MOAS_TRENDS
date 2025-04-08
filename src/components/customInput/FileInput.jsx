import { BadgeX, Camera } from "lucide-react";
import React from "react";

const FileInput = ({ onChange, preview, handleClearImage }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor="image"
        className="text-black font-medium capitalize w-full 
     border-purple-500 border rounded-md outline-none h-30 flex justify-center items-center relative "
      >
       {!preview &&  <Camera className="text-purple-500 size-10 cursor-pointer" />}
        <input
          type="file"
          multiple={true}
          onChange={onChange}
          hidden
          name="image"
          id="image"
          className=""
        />

        {preview && (
          <div  className="size-full aspect-square p-1">
            <img src={preview} alt="new image" className="size-full" />
            <BadgeX
              className=" absolute top-0 right-0 m-2 text-red-500 cursor-pointer"
              onClick={handleClearImage}
            />
          </div>
        )}
      </label>
    </div>
  );
};

export default FileInput;
