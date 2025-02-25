'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import FoodItemCard from '@/components/food-share/FoodItemCard';

export default function MyPosts() {
    const [items, setItems] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        document.title = 'BananAI - My Food Posts';
    }, []);

    useEffect(() => {
        if (session) {
            fetchMyItems();
        }
    }, [session]);

    const fetchMyItems = async () => {
        const response = await fetch('/api/food-share/my-posts');
        const data = await response.json();
        setItems(data);
    };

    const handleDelete = async (itemId) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const response = await fetch(`/api/food-share/${itemId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchMyItems();
            }
        }
    };

    const markAsDonated = async (itemId) => {
        if (confirm('Are you sure you want to mark this item as donated?')) {
            const response = await fetch('/api/food-share', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId })
            });
            if (response.ok) {
                fetchMyItems();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">My Food Postings</h1>
                    <Link href="/food-share" className="bg-white text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-100">
                        Back to All Items
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <FoodItemCard
                            key={item._id}
                            item={item}
                            onMarkDonated={markAsDonated}
                            onDelete={handleDelete}
                            showActions={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}