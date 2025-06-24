import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

interface ImageUploadProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrls?: string[]; // For multiple images
  imageUrl?: string; // For single image
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  onChange,
  imageUrls = [],
  imageUrl = "",
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Only set previews from props on mount or when name changes
  useEffect(() => {
    if (multiple) {
      setPreviews(imageUrls);
    } else {
      setPreviews(imageUrl ? [imageUrl] : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      <div
        className="border border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        onClick={() => inputRef.current?.click()}
      >
        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {previews.map((src, idx) => (
              <Image
                key={idx}
                width={120}
                height={120}
                src={src}
                alt={`Preview ${idx + 1}`}
                className="object-contain rounded-lg mb-2"
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center py-4">
            Click to upload{multiple ? " images" : " image"}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
