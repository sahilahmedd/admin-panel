import Image from "next/image";
import React, { useRef, useState } from "react";

interface ImageUploadProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, onChange, imageUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(imageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file)); // temporary preview
      onChange(e); // pass up to parent for API upload
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Photo
      </label>
      <div
        className="border border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image
            width={40}
            height={40}
            src={preview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-full mb-2"
          />
        ) : (
          <div className="text-gray-500 text-sm text-center">
            Click to upload
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
