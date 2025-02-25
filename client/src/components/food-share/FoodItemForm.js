'use client';
import { useState, useEffect } from 'react';
import { uploadImage } from '@/utils/imageUpload';
import Image from 'next/image';

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
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div>
                <label className="block mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block mb-1">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full p-2 border rounded"
                    rows="4"
                />
            </div>
            <div>
                <label className="block mb-1">Location</label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block mb-1">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                    required={!initialData}
                />
                {imagePreview && (
                    <div className="mt-2">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                            unoptimized
                        />
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={uploading}
                className={`w-full p-2 text-white rounded ${
                    uploading 
                        ? 'bg-gray-400' 
                        : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
            >
                {uploading ? 'Uploading...' : buttonText}
            </button>
        </form>
    );
}