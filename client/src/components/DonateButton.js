'use client';
import { useRouter } from 'next/navigation';
import { Button } from "@mui/material";

export default function DonateButton({ image }) {
    const router = useRouter();

    const handleDonate = () => {
        // Store the image in sessionStorage
        if (image) {
            router.push('/food-share/new');
            
        }
    };

    return (
        <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleDonate}
            className="mt-4"
        >
            Donate This Banana
        </Button>
    );
}