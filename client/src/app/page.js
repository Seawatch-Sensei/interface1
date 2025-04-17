'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  useEffect(() => {
    document.title = 'BananAI - Home';
  }, []);

  const { data: session } = useSession();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold mb-4">Hi, {session?.user.name} 🍌</h1>
      </motion.div>
      
      <motion.p 
        className="text-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Upload a banana image and let AI predict its future! Will it survive? Will it rot? Will it still be delicious? 🤔
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Link href="/24hours" className="block">
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">🍌 Future Banana</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Predict what your banana will look like in 24 hours (or longer)! 🕰️
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        
        <motion.div variants={item}>
          <Link href="/temperatures" className="block">
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">🔥 Temperature Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  See how different temperatures change your banana's shape in 24 hours! 🌡️
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        
        <motion.div variants={item}>
          <Link href="/rotten-check" className="block">
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">☠️ Rotten or Not?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Find out if your banana is still edible or if it has joined the dark side! 🍂
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        
        <motion.div variants={item}>
          <Link href="/food-share" className="block">
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">🥘 Food Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Share or find food items in your community! 🤝
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.p 
        className="mt-12 text-sm opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        🍌 AI-powered banana analysis – because science. 🔬
      </motion.p>
    </div>
  );
}