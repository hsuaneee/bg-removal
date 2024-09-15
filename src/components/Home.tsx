"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { FaEraser, FaEdit, FaImage, FaCog } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Close (X) icon

const Home: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false); // Track if user is in edit mode
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<"erase" | "restore" | null>(null); // Track active tool
  const [brushSize, setBrushSize] = useState<number>(20); // Track brush size
  const [brushPosition, setBrushPosition] = useState<{ x: number; y: number } | null>(null); // Track brush position
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string); // Save base64 image
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click when the image is clicked
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the hidden file input
    }
  };

  // Handle Edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle Close button click (X) to go back to options page
  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  // Handle Done button click (to exit edit mode)
  const handleDoneEdit = () => {
    setIsEditing(false);
  };

  // Handle tool selection (Erase or Restore)
  const handleToolSelect = (tool: "erase" | "restore") => {
    setActiveTool(tool);
  };
  // Handle brush size change
  const handleBrushSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(Number(event.target.value));
  };

  // Handle mouse movement over the image to track brush position
  const handleMouseMove = (event: React.MouseEvent) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setBrushPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  // Hide brush when mouse leaves the image
  const handleMouseLeave = () => {
    setBrushPosition(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Image Uploader */}
      <div
        className="flex flex-col items-center mb-8 cursor-pointer"
        onClick={handleImageClick}
      >
        {uploadedImage ? (
           <div
           className="relative w-96 h-96"
           onMouseMove={activeTool ? handleMouseMove : undefined}
           onMouseLeave={handleMouseLeave}
           ref={imageRef}
         >
            <Image
              src={uploadedImage}
              alt="Uploaded Image"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          {brushPosition && activeTool && (
              <div
                className="absolute rounded-full border  border-gray-600 bg-white bg-opacity-70"
                style={{
                  width: `${brushSize}px`,
                  height: `${brushSize}px`,
                  left: `${brushPosition.x - brushSize / 2}px`,
                  top: `${brushPosition.y - brushSize / 2}px`,
                  pointerEvents: "none", // Prevents blocking mouse interaction
                }}
              ></div>
            )}
          </div>
        ) : (
          <div className="w-96 h-96 bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-gray-500">Click to upload an image</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Conditionally Render Based on Edit Mode */}
      {isEditing ? (
        <div className="relative bg-white shadow-lg rounded-lg p-6 w-80">
          {/* "X" Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={handleCloseEdit}
          >
            <IoClose className="text-2xl" />
          </button>

          {/* Editing Tool UI */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Manually Erase or Restore</h2>

            <div className="flex justify-center space-x-4 mb-6">
              {/* Erase Button */}
              <button
                className={`flex items-center px-4 py-2 rounded-full hover:bg-yellow-300 ${
                  activeTool === "erase"
                    ? "bg-yellow-500 text-white border-2 "
                    : "bg-transparent text-gray-600 border-2 border-gray-300"
                }`}
                onClick={() => handleToolSelect("erase")}
              >
                <FaEraser className="mr-2" />
                <span>Erase</span>
              </button>

              {/* Restore Button */}
              <button
                className={`flex items-center px-4 py-2 rounded-full hover:bg-yellow-300 ${
                  activeTool === "restore"
                    ? "bg-yellow-500 text-white border-2"
                    : "bg-transparent text-gray-600 border-2 border-gray-300"
                }`}
                onClick={() => handleToolSelect("restore")}
              >
                <FaEdit className="mr-2" />
                <span>Restore</span>
              </button>
            </div>

            {/* Brush Size Slider */}
            <div className="w-full mb-4">
              <label className="block text-gray-700">Brush Size</label>
              <input
                type="range"
                min="5"
                max="80"
                value={brushSize}
                onChange={handleBrushSizeChange}
                className="w-full"
              />
            </div>

            {/* Reset and Done Buttons */}
            <div className="flex justify-between space-x-4 mt-6 w-full">
              <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Reset
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleDoneEdit}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {/* Main Options Page */}
          <a
            className="flex items-center space-x-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
            href="#"
          >
            <FaEraser className="text-xl" />
            <span>Remove Background</span>
          </a>
          <button
            className="flex items-center space-x-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
            onClick={handleEditClick}
          >
            <FaEdit className="text-xl" />
            <span>Edit</span>
          </button>
          <a
            className="flex items-center space-x-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
            href="#"
          >
            <FaImage className="text-xl" />
            <span>Add Background</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
