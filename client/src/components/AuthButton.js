'use client';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const AuthButton = () => {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center">
      {!session ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleSignIn}
            variant="outline"
            className="flex items-center justify-center gap-2 px-6 py-5 rounded-full"
          >
            <Image
              src="/google.png"
              alt="Google Logo"
              width={24}
              height={24}
            />
            Sign in with Google
          </Button>
        </motion.div>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-4">Welcome, {session.user.name}!</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => signOut()}
              variant="destructive"
              className="px-6 py-2 rounded-full"
            >
              Sign out
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SessionProvider>
      <AuthButton />
    </SessionProvider>
  );
}
