'use client'
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
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

    try {
      const response = await fetch("http://127.0.0.1:4000/process-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = (await response.json()).classification;
        console.log(data)
        setOutput(data);
      } else {
        setOutput("Something went wrong. Please try again.");
      }
    } catch (error) {
      setOutput("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Upload an Image
        </h1>
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
          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg border border-gray-300 shadow-md"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-bold rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
        {output && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-gray-800 shadow-inner">
            <h2 className="font-bold text-lg">Result:</h2>
            <p>{output}</p>
          </div>
        )}
      </div>
    </div>
  );
}

