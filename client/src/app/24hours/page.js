'use client';
import { useState, useEffect } from "react";
import Image from 'next/image';
import DonateButton from '@/components/DonateButton';
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Upload, Thermometer, RefreshCw, X } from "lucide-react";

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
  const [funnyMessage, setFunnyMessage] = useState("Calculating banana ripeness...");

  useEffect(() => {
    if (loading) {
      const messages = [
        "Predicting banana's future...",
        "Consulting with banana experts...",
        "Calculating ripeness algorithms...",
        "Analyzing banana DNA...",
        "Time traveling 24 hours ahead...",
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen  flex flex-col items-center justify-center p-6 text-center"
    >
      <Card className="w-full max-w-5xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-600">🍌 Future Banana 🍌</CardTitle>
          <CardDescription className="text-lg">
            Upload a banana image and see its future in 24 hours! 🕰️
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Input */}
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image-upload"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-dashed border-2"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Banana Image
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-yellow-600" />
                <Slider
                  value={[temperature]}
                  min={25}
                  max={55}
                  step={5}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="flex-1"
                />
                <span className="font-medium text-gray-700 min-w-[60px]">{temperature}°C</span>
              </div>
              
              {preview && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-lg overflow-hidden"
                >
                  <h3 className="font-medium mb-2 text-gray-700">Original Image:</h3>
                  <div className="relative h-[300px] w-full">
                    <Image 
                      src={preview} 
                      alt="Preview" 
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-lg border border-gray-200 shadow-md" 
                    />
                  </div>
                </motion.div>
              )}
              
              <Button
                onClick={handleSubmit}
                disabled={loading || !image}
                className={`w-full py-2 ${loading ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"}`}
              >
                {loading ? "Processing..." : "Predict 24 Hours Later"}
              </Button>
              
              {loading && (
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-gray-700 font-medium"
                >
                  {funnyMessage}
                </motion.p>
              )}
            </div>
            
            {/* Right Column - Output */}
            <div className="flex flex-col space-y-4">
              {outputImage ? (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="font-medium text-gray-700">After 24 Hours:</h3>
                  <div className="relative h-[300px] w-full">
                    <Image
                      src={outputImage}
                      alt="Processed"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-lg border border-gray-200 shadow-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      className="flex items-center justify-center"
                      onClick={handleReplaceWithProcessed}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Use as Input
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center justify-center"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                        setOutputImage(null);
                        setProcessCount(0);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  
                  {processCount > 0 && (
                    <p className="text-sm text-gray-500">
                      Image processed <span className="font-bold">{processCount} times</span>
                    </p>
                  )}
                  
                  {image && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <DonateButton image={image} />
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 italic">Processed image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
