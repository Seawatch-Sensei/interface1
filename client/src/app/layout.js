'use client';
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import Template from "./template";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute min-w-full min-h-full object-cover"
          >
            <source src="/bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <SessionProvider session={children.session}>
          <Template className="relative z-10">
            {children}
          </Template>
        </SessionProvider>
        
        <div className="fixed bottom-2 right-2 text-xs text-white/60 z-50">
          Video by <a href="https://pixabay.com/users/savagegraphics-21685451/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=209022" className="hover:text-white/80 transition-colors">Sree Nand</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=209022" className="hover:text-white/80 transition-colors">Pixabay</a>
        </div>
      </body>
    </html>
  );
}
