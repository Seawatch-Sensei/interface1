import multer from 'multer';
import { predict } from '../../../lib/utilities.js';
import fs from 'fs';
import { promisify } from 'util';

// Configure multer for temporary file storage in serverless environment
const upload = multer({ dest: '/tmp/' });
const unlinkAsync = promisify(fs.unlink);

// Disable Next.js body parsing for multipart form handling
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
        // Handle file upload with multer
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
                // Extract and validate uploaded file
                const formData = await request.formData();
                const file = formData.get('image');

                if (!file) {
                    return resolve(Response.json({ error: "No file uploaded" }, { status: 400 }));
                }

                // Save file to temporary storage
                const filePath = `/tmp/${file.name}`;
                const fileBuffer = Buffer.from(await file.arrayBuffer());
                await fs.promises.writeFile(filePath, fileBuffer);

                // Process image through classification model
                const result = await predict(filePath);

                // Cleanup and return results
                await unlinkAsync(filePath);
                resolve(Response.json({ classification: result }, { status: 200 }));
            } catch (error) {
                console.error("Error processing image:", error);
                resolve(Response.json({ error: "Failed to process image" }, { status: 500 }));
            }
        });
    });
}