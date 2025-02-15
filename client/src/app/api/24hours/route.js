import multer from 'multer';
import { lstmApi } from '../utilities.js';
import fs from 'fs';
import { promisify } from 'util';
import fetch from 'node-fetch'; // To fetch the image from the URL
import sharp from 'sharp'; // For handling image transformations and format conversion

const upload = multer({ dest: 'uploads/' });
const unlinkAsync = promisify(fs.unlink);

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function GET() {
    return Response.json({ message: "This is a GET request" }, { status: 200 });
}

export async function POST(request) {
    return new Promise((resolve) => {
        upload.single('image')(request, {
            status: (code) => ({
                json: (data) => resolve(Response.json(data, { status: code })),
                send: (data) => resolve(new Response(data, { status: code })),
                setHeader: () => {} // No-op, Next.js handles headers internally
            }),
            json: async () => request.formData()
        }, async (err) => {
            if (err) {
                return resolve(Response.json({ error: "Failed to upload image" }, { status: 500 }));
            }

            try {
                const formData = await request.formData();
                const file = formData.get('image');
                const temperature = parseFloat(formData.get('temperature')) || 25;

                if (!file) {
                    return resolve(Response.json({ error: "No file uploaded" }, { status: 400 }));
                }

                const filePath = `uploads/${file.name}`;
                await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

                console.log("Temperature:", temperature);
                const originalImage = await sharp(filePath).metadata();
                const originalWidth = originalImage.width;
                const originalHeight = originalImage.height;

                console.log("Processing the image...");
                const imageUrl = await lstmApi(filePath, temperature); // Get the image URL from lstmApi
                
                // Fetch the image from the URL
                const response = await fetch(imageUrl);
                const buffer = await response.arrayBuffer();

                // Use sharp to process the image (conversion, resizing, etc.)
                const processedImageBuffer = await sharp(Buffer.from(buffer))
                    .resize(originalWidth, originalHeight)  // Resize to original dimensions
                    .toFormat('png')  // Convert the image to PNG format
                    .toBuffer();  // Return the image as a buffer

                await unlinkAsync(filePath); // Cleanup uploaded file

                console.log("Image processed successfully.");
                resolve(new Response(processedImageBuffer, {
                    status: 200,
                    headers: { 'Content-Type': 'image/png' }
                }));
            } catch (error) {
                console.error("Error processing image:", error);
                resolve(Response.json({ error: "Failed to process image" }, { status: 500 }));
            }
        });
    });
}
