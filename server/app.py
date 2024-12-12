import os
import time
from flask import Flask, request, jsonify
from transformers import pipeline
from PIL import Image
import io
from flask_cors import CORS
from utilities import predict

# Create a Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Ensure the 'uploads' folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Setup the image classification pipeline (Hugging Face)
# classifier = pipeline("image-classification", model="Aryaman9999/Freshness-Fruit_Vegies")
# http://127.0.0.1:4000/process-image
@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Check if an image was uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        image_file = request.files['image']

        # Save the image to the uploads directory
        file_name = f"upload-{image_file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        image_file.save(file_path)

        # Open the image using PIL
        # image = Image.open(image_file)

        # Perform image classification
        print("Classifying the image...")
        results = predict(file_path)

        # Log the results for debugging
        print("Classification results:", results)

        # Return the classification results as a JSON response
        return jsonify({
            "message": "Image uploaded, saved, and classified successfully",
            "file_path": file_path,
            "classification": results
        })

    except Exception as e:
        print("Error processing image:", e)
        return jsonify({
            "error": "Failed to process the image. Please check server logs for details."
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=4000)
