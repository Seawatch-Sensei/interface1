'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import DonateButton from '@/components/DonateButton';

export default function TemperatureSliderPage() {
    useEffect(() => {
        document.title = 'BananAI - Temperature Effects';
    }, []);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [images, setImages] = useState({});
  const [funnyMessage, setFunnyMessage] = useState("Calculating quantum heat fluctuations...");

  useEffect(() => {
    if (loading) {
      const messages = [
        "Summoning the heat spirits...",
        "Converting Celsius to Fahrenheit... and back again...",
        "Negotiating with the sun for better results...",
        "AI is thinking... even harder than usual!",
        "Bribing the pixels to align perfectly...",
      ];
      let index = 0;
      const interval = setInterval(() => {
        setFunnyMessage(messages[index]);
        index = (index + 1) % messages.length;
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setImages({}); // Reset images for new upload
    }
  };

  const handleProcessImage = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    const temperatures = [25, 35, 45, 55];
    const tempImages = {};

    for (const temp of temperatures) {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("temperature", temp);

      try {
        const response = await fetch(`api/24hours`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          tempImages[temp] = URL.createObjectURL(blob);
        } else {
          tempImages[temp] = null;
        }
      } catch (error) {
        tempImages[temp] = null;
      }
    }

    setImages(tempImages);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-white text-yellow-700 shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 className="text-2xl font-bold">🔥 Temperature Effect</h1>
            <p className="mt-2">Upload a banana image and see how different temperatures change its shape in 24 hours! 🌡️</p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
    
            {preview && (
              <div className="mt-4">
                <h2 className="font-bold text-gray-700">Original Image:</h2>
                <Image src={preview} alt="Preview" width={300} height={200} className="rounded-lg border border-gray-300 shadow-md" />
              </div>
            )}
    
            <button
              onClick={handleProcessImage}
              disabled={loading}
              className={`mt-4 w-full py-2 px-4 text-white font-bold rounded-lg transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}`}
            >
              {loading ? "Cooking your pixels... 🍳" : "Start Processing"}
            </button>
    
            {loading && (
              <p className="mt-4 text-gray-700 font-bold">{funnyMessage}</p>
            )}
    
            {Object.keys(images).length > 0 && (
                <div className="mt-6">
                    <h2 className="font-bold text-gray-700">Processed Images:</h2>
                    <input
                      type="range"
                      min="25"
                      max="55"
                      step="10"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                    <p className="text-gray-700 font-bold mt-2">Temperature: {temperature}°C</p>
                    {images[temperature] && (
                      <Image
                        src={images[temperature]}
                        alt="Processed"
                        width={300}
                        height={200}
                        className="rounded-lg border border-gray-300 shadow-md mt-4"
                      />
                    )}
                    {image && <DonateButton image={image} />}
                </div>
            )}
        </div>
    </div>
  );
}
