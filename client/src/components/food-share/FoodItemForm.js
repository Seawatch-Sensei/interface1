'use client';
import { useState, useEffect } from 'react';
import { uploadImage } from '@/utils/imageUpload';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

export default function FoodItemForm({ initialData, onSubmit, buttonText = 'Submit' }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        imageUrl: '',
        ...initialData
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setImagePreview(initialData.imageUrl);
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = formData.imageUrl;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            onSubmit({ ...formData, imageUrl });
        } catch (error) {
            alert('Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="4"
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Location</label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-md"
                    required={!initialData}
                />
                {imagePreview && (
                    <motion.div 
                        className="mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                            unoptimized
                        />
                    </motion.div>
                )}
            </div>
            <Button
                type="submit"
                disabled={uploading}
                className="w-full"
                variant={uploading ? "outline" : "default"}
            >
                {uploading ? 'Uploading...' : buttonText}
            </Button>
        </motion.form>
    );
}