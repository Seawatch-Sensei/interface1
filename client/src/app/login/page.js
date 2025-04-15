'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  useEffect(() => {
    document.title = 'BananAI - Login';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Banana Predictor?</CardTitle>
            <CardDescription className="text-lg mt-2">Sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthButton />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
