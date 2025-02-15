import multer from 'multer';
import { predict } from '../utilities.js';
import fs from 'fs';
import { promisify } from 'util';

// Directly set upload destination to tmp folder
const upload = multer({ dest: '/tmp/' });  // Use /tmp for serverless environments
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
                setHeader: () => {}, // No-op, Next.js handles headers internally
            }),
            json: async () => request.formData(),
        }, async (err) => {
            if (err) {
                return resolve(Response.json({ error: "Failed to upload image" }, { status: 500 }));
            }

            try {
                const formData = await request.formData();
                const file = formData.get('image');

                if (!file) {
                    return resolve(Response.json({ error: "No file uploaded" }, { status: 400 }));
                }

                const filePath = `/tmp/${file.name}`;  // Directly store the file in /tmp
                const fileBuffer = Buffer.from(await file.arrayBuffer());

                // Write the file directly to the /tmp folder without creating a folder structure
                await fs.promises.writeFile(filePath, fileBuffer);

                console.log("Processing the image...");

                // Process the image using predict
                const result = await predict(filePath); // Get the prediction result

                await unlinkAsync(filePath); // Cleanup uploaded file

                console.log("Image processed successfully.");
                resolve(Response.json({ classification: result }, { status: 200 }));
            } catch (error) {
                console.error("Error processing image:", error);
                resolve(Response.json({ error: "Failed to process image" }, { status: 500 }));
            }
        });
    });
}