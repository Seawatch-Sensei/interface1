'use client';
import { useEffect } from 'react';
import AuthButton from "@/components/AuthButton";

export default function Home() {
    useEffect(() => {
        document.title = 'BananAI - Login';
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
            <div className="bg-white text-yellow-700 rounded-3xl shadow-2xl p-10 max-w-md text-center">
                <h1 className="text-4xl font-bold mb-6">Banana Predictor?</h1>
                <p className="mb-8">Sign in to continue</p>
                <AuthButton />
            </div>
        </div>
    );
}
