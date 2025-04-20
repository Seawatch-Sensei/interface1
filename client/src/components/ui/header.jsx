'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import SignOut from '@/components/SignOut';


const AppHeader = () => {
  return (
    <motion.header 
        className="bg-white backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-yellow-600 flex items-center">
            <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="h-8 w-8 mr-2" 
            >
            <source src="/logo.mp4" type="video/mp4" />
            </video>
            BananAI
        </Link>
        <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
            <Link href="/">
                <Home className="mr-1 h-4 w-4" />
                Dashboard
            </Link>
            </Button>
            <SignOut />
        </div>
        </div>
    </motion.header>
  );
};

export default AppHeader;
