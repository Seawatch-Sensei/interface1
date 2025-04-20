import multer from 'multer';
import { HFApi } from '../../../lib/utilities.js';
import fs from 'fs';
import { promisify } from 'util';
import fetch from 'node-fetch';
import sharp from 'sharp';

// Configure multer to use temporary directory for file uploads
// Important: /tmp is used for serverless environments like Vercel
const upload = multer({ dest: '/tmp/' });
const unlinkAsync = promisify(fs.unlink);

// Disable Next.js body parsing as we're handling multipart form data
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
        // Handle multipart form data upload using multer middleware
        upload.single('image')(request, {
            status: (code) => ({
                json: (data) => resolve(Response.json(data, { status: code })),
                send: (data) => resolve(new Response(data, { status: code })),
                setHeader: () => {},
            }),
            json: async () => request.formData(),
        }, async (err) => {
            if (err) {
                return resolve(Response.json({ error: "Failed to upload image" }, { status: 500 }));
            }

            try {
                // Extract image and temperature from form data
                const formData = await request.formData();
                const file = formData.get('image');
                const temperature = parseFloat(formData.get('temperature')) || 25;

                if (!file) {
                    return resolve(Response.json({ error: "No file uploaded" }, { status: 400 }));
                }

                // Save uploaded file to temporary storage
                const filePath = `/tmp/${file.name}`;
                const fileBuffer = Buffer.from(await file.arrayBuffer());
                await fs.promises.writeFile(filePath, fileBuffer);

                // Preserve original image dimensions for consistent output
                const originalImage = await sharp(filePath).metadata();
                const { width: originalWidth, height: originalHeight } = originalImage;

                // Process image through Hugging Face API and get result URL
                const imageUrl = await HFApi(filePath, temperature);
                const response = await fetch(imageUrl);
                const buffer = await response.arrayBuffer();

                // Post-process the AI-generated image:
                // - Resize to match original dimensions
                // - Convert to PNG format for consistency
                const processedImageBuffer = await sharp(Buffer.from(buffer))
                    .resize(originalWidth, originalHeight, {
                        fit: 'fill',
                        withoutEnlargement: false
                    })
                    .toFormat('png')
                    .toBuffer();

                // Cleanup temporary file
                await unlinkAsync(filePath);

                // Return processed image as PNG
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
