'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

export default function DonateButton({ image }) {
    const router = useRouter();

    const handleDonate = () => {
        if (image) {
            router.push('/food-share/new');
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4"
        >
            <Button
                onClick={handleDonate}
                variant="default"
                className="w-full"
            >
                Donate This Banana
            </Button>
        </motion.div>
    );
}