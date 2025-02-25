'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import FoodItemCard from '@/components/food-share/FoodItemCard';

export default function FoodShare() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const { data: session } = useSession();

    useEffect(() => {
        document.title = 'BananAI - Food Sharing';
    }, []);

    useEffect(() => {
        fetchItems();
    }, [search]);

    const fetchItems = async () => {
        const response = await fetch(`/api/food-share?search=${encodeURIComponent(search)}`);
        const data = await response.json();
        setItems(data);
    };

    const markAsDonated = async (itemId) => {
        const response = await fetch('/api/food-share', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId })
        });
        if (response.ok) {
            fetchItems();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Food Sharing</h1>
                    {session && (
                        <div className="flex gap-4">
                            <Link href="/food-share/my-posts" className="bg-white text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-100">
                                My Postings
                            </Link>
                            <Link href="/food-share/new" className="bg-white text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-100">
                                Share Food Item
                            </Link>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 rounded-lg mb-6"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items?.map((item) => (
                        <FoodItemCard
                            key={item._id}
                            item={item}
                            onMarkDonated={markAsDonated}
                            showContact={!!session}
                            showActions={session?.user.email === item.postedBy}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}