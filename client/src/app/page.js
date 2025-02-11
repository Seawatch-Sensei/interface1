
'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-center p-6">
      <h1 className="text-4xl font-extrabold mb-4">🍌 Banana Prediction Lab 🍌</h1>
      <p className="text-lg mb-8">Upload a banana image and let AI predict its future! Will it survive? Will it rot? Will it still be delicious? 🤔</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <Link href="/24hours">
          <div className="bg-white text-yellow-700 p-6 rounded-lg shadow-lg hover:scale-105 transition cursor-pointer">
            <h2 className="text-2xl font-bold">🍌 Future Banana</h2>
            <p>Predict what your banana will look like in 24 hours (or longer)! 🕰️</p>
          </div>
        </Link>
        
        <Link href="/temperatures">
          <div className="bg-white text-yellow-700 p-6 rounded-lg shadow-lg hover:scale-105 transition cursor-pointer">
            <h2 className="text-2xl font-bold">🔥 Temperature Effect</h2>
            <p>See how different temperatures change your banana’s shape in 24 hours! 🌡️</p>
          </div>
        </Link>
        
        <Link href="/rotten-check">
          <div className="bg-white text-yellow-700 p-6 rounded-lg shadow-lg hover:scale-105 transition cursor-pointer">
            <h2 className="text-2xl font-bold">☠️ Rotten or Not?</h2>
            <p>Find out if your banana is still edible or if it has joined the dark side! 🍂</p>
          </div>
        </Link>
      </div>
      
      <p className="mt-12 text-sm opacity-80">🍌 AI-powered banana analysis – because science. 🔬</p>
    </div>
  );
}
