'use client';
import { useState } from "react";
import Link from 'next/link';

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processCount, setProcessCount] = useState(0);
  const [temperature, setTemperature] = useState(25); // Default temperature

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOutputImage(null); // Reset the output image when a new image is uploaded
      setProcessCount(0); // Reset process count
    }
  };

  const handleReplaceWithProcessed = () => {
    if (outputImage) {
      fetch(outputImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "processed-image.png", {
            type: "image/png",
          });
          setImage(file);
          setPreview(outputImage);
          setOutputImage(null); // Clear output image for new processing
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("temperature", temperature); // Send temperature as well

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/24hours`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setOutputImage(imageUrl);
        setProcessCount((prev) => prev + 1); // Increment process count
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-center p-6 relative">
      <div className="bg-white text-yellow-700 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">🍌 Future Banana 🍌</h1>
        <p className="text-lg mb-8">Upload a banana image and see its future in 24 hours! 🕰️</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-2"
            >
              Select an Image:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>

          {/* Temperature input field */}
          <div className="mb-4">
            <label
              htmlFor="temperature"
              className="block text-gray-700 font-medium mb-2"
            >
              Enter Temperature (°C):
            </label>
            <input
              type="number"
              id="temperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="block w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 text-center text-3xl"
              min="0"
              step="0.1"
            />
          </div>

          {preview && (
            <div className="mb-4">
              <h2 className="font-bold text-gray-700 mb-2">Original Image:</h2>
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg border border-gray-300 shadow-md w-full"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-bold rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-700 ring-2 ring-yellow-500"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {outputImage && (
          <div className="mt-6">
            <h2 className="font-bold text-gray-700 mb-2">Processed Image:</h2>
            <img
              src={outputImage}
              alt="Processed"
              className="rounded-lg border border-gray-300 shadow-md w-full mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleReplaceWithProcessed}
                className="w-full py-2 px-4 text-white font-bold bg-green-600 hover:bg-green-700 rounded-lg transition ring-2 ring-green-500"
              >
                Use Processed Image
              </button>
              <button
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                  setOutputImage(null);
                  setProcessCount(0);
                }}
                className="w-full py-2 px-4 text-white font-bold bg-red-600 hover:bg-red-700 rounded-lg transition ring-2 ring-red-500"
              >
                Choose New Image
              </button>
            </div>
          </div>
        )}

        {processCount > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Image processed <span className="font-bold">{processCount} days</span>.
            </p>
          </div>
        )}
      </div>
      <Link href="/" className="absolute top-4 right-4 text-sm opacity-80 underline transition-transform transform hover:scale-110 hover:text-yellow-300 bg-black p-2 rounded-lg">
        Back to Home
      </Link>
    </div>
  );
}
