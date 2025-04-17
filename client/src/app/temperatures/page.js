'use client';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Upload, Thermometer, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const testImageUrl = "https://i.postimg.cc/XvGPr2Ss/Screenshot-2025-02-11-115727.png";

  // Function to load test image
  const handleAddTestImage = async () => {
    try {
      const response = await fetch(testImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "test-banana.png", { type: blob.type });
      
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setImages({});
    } catch (error) {
      console.error("Error loading test image:", error);
      alert("Failed to load test image. Please try again.");
    }
  };

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
    >
      <Card className="w-full max-w-5xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-600">🔥 Temperature Effect</CardTitle>
          <CardDescription className="text-lg">
            Upload a banana image and see how different temperatures change its shape in 24 hours! 🌡️
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Input */}
            <div className="flex flex-col space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
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
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="default" 
                        className="h-12 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-md"
                        onClick={handleAddTestImage}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Test Image
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-0 overflow-hidden rounded-md border-0">
                      <div className="relative w-[200px] h-[150px]">
                        <Image 
                          src={testImageUrl} 
                          alt="Test banana image" 
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-md"
                        />
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                onClick={handleProcessImage}
                disabled={loading || !image}
                className={`w-full py-2 ${loading || !image ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"}`}
              >
                {loading ? "Cooking your pixels... 🍳" : "Start Processing"}
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
              {Object.keys(images).length > 0 ? (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="font-medium text-gray-700">Processed Image:</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-yellow-600" />
                    <Slider
                      value={[temperature]}
                      min={25}
                      max={55}
                      step={10}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="flex-1"
                    />
                    <span className="font-medium text-gray-700 min-w-[60px]">{temperature}°C</span>
                  </div>
                  
                  {images[temperature] && (
                    <div className="relative h-[300px] w-full">
                      <Image
                        src={images[temperature]}
                        alt="Processed"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-lg border border-gray-200 shadow-md"
                      />
                    </div>
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
