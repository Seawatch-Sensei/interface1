'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button, CircularProgress, TextField, Card } from "@mui/material";
import DonateButton from '@/components/DonateButton';

export default function Home() {
    useEffect(() => {
        document.title = 'BananAI - 24 Hours Prediction';
    }, []);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processCount, setProcessCount] = useState(0);
  const [temperature, setTemperature] = useState(25);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOutputImage(null);
      setProcessCount(0);
    }
  };

  const handleReplaceWithProcessed = () => {
    if (outputImage) {
      fetch(outputImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "processed-image.png", { type: "image/png" });
          setImage(file);
          setPreview(outputImage);
          setOutputImage(null);
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
    formData.append("temperature", temperature);

    try {
      const response = await fetch(`api/24hours`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setOutputImage(imageUrl);
        setProcessCount((prev) => prev + 1);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white p-6 relative">
      <Card className="bg-white text-yellow-700 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">🍌 Future Banana 🍌</h1>
        <p className="text-lg mb-8 text-center">Upload a banana image and see its future in 24 hours! 🕰️</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField fullWidth label="Select an Image" type="file" inputProps={{ accept: "image/*" }} onChange={handleImageChange} variant="outlined" />
          <TextField fullWidth label="Enter Temperature (°C)" type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} variant="outlined" />
          {preview && (
            <div className="mb-4 text-center">
              <h2 className="font-bold text-gray-700 mb-2">Original Image:</h2>
              <Image src={preview} alt="Preview" className="rounded-lg border border-gray-300 shadow-md" width={500} height={500} />
            </div>
          )}
          <Button type="submit" fullWidth variant="contained" color="warning" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </form>

        {outputImage && (
          <div className="mt-6 text-center">
            <h2 className="font-bold text-gray-700 mb-2">Processed Image:</h2>
            <Image src={outputImage} alt="Processed" className="rounded-lg border border-gray-300 shadow-md" width={500} height={500} />
            <div className="flex gap-4 mt-4">
              <Button fullWidth variant="contained" color="success" onClick={handleReplaceWithProcessed}>
                Use Processed Image
              </Button>
              <Button fullWidth variant="contained" color="error" onClick={() => {
                setImage(null);
                setPreview(null);
                setOutputImage(null);
                setProcessCount(0);
              }}>
                Choose New Image
              </Button>
            </div>
            {image && <DonateButton image={image} />}
          </div>
        )}

        {processCount > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-700">Image processed <span className="font-bold">{processCount} times</span>.</p>
          </div>
        )}
      </Card>
      <Link href="/" className="absolute top-4 right-4 text-sm opacity-80 underline transition-transform transform hover:scale-110 hover:text-yellow-300 bg-black p-2 rounded-lg">
        Back to Home
      </Link>
    </div>
  );
}
