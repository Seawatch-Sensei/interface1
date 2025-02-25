export async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

    try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            console.log('Image uploaded successfully:', data.data.url);
            return data.data.url;
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}