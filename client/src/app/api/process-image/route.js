import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { pipeline } from "@xenova/transformers";

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");

export async function POST(req) {
  try {
    // Parse the image from the request body
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Convert the image file to a buffer
    const buffer = await image.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Save the image file locally
    const fileName = `upload-${Date.now()}-${image.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, uint8Array);
    console.log(`File saved: ${filePath}`);

    // Load the Hugging Face pipeline
    console.log("Loading the Hugging Face image classification pipeline...");
    const classifier = await pipeline("image-classification", "Aryaman9999/Freshness-Fruit_Vegies");

    // Perform classification on the saved image
    console.log("Classifying the image...");
    const results = await classifier(filePath);

    console.log("Classification results:", results);

    // Return the classification results
    return NextResponse.json(
      {
        message: "Image uploaded, saved, and classified successfully",
        filePath: filePath,
        classification: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process the image. Please check server logs for details." },
      { status: 500 }
    );
  }
}
