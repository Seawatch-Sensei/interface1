import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from utilities import predict, load_and_predict
import numpy as np
from io import BytesIO
import matplotlib.pyplot as plt
from PIL import Image

# Create a Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Ensure the 'uploads' folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route('/classify-image', methods=['POST'])
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

        # Perform image classification
        print("Classifying the image...")
        results = predict(file_path)

        # Log the results for debugging
        print("Classification results:", results)

        # Delete the image after processing
        os.remove(file_path)

        # Return the classification results as a JSON response
        return jsonify({
            "message": "Image uploaded, saved, and classified successfully",
            "classification": results
        })

    except Exception as e:
        print("Error processing image:", e)
        return jsonify({
            "error": "Failed to process the image. Please check server logs for details."
        }), 500


@app.route('/24hours', methods=['POST'])
def hours24():
    try:
        # Check if an image was uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        image_file = request.files['image']

        # Save the image to the uploads directory
        file_name = f"upload-{image_file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        image_file.save(file_path)
        
        # Get temperature from request, default to 25 if not provided
        temperature = request.form.get('temperature', 25, type=float)

        # Load the original image to get dimensions
        original_image = Image.open(file_path)
        original_width, original_height = original_image.size

        # Perform image processing to get a NumPy array (RGB)
        print("Processing the image...")
        rgb_image = load_and_predict(file_path, temperature).numpy()  # Process the image with temperature adjustment
        normalized_image = (rgb_image) / (max(np.max(rgb_image), 1))  # Normalize the image
        
        # Resize the normalized image back to original dimensions
        resized_image = Image.fromarray((normalized_image * 255).astype(np.uint8))
        resized_image = resized_image.resize((original_width, original_height), Image.LANCZOS)

        # Create a BytesIO buffer
        buffer = BytesIO()

        # Save the image to the buffer in PNG format
        resized_image.save(buffer, format="PNG")

        # Move the buffer's cursor to the beginning
        buffer.seek(0)

        # Delete the image after processing
        os.remove(file_path)

        # Log the results for debugging
        print("Image processed successfully.")

        # Return the processed image as a response with the appropriate content type
        return send_file(buffer, mimetype='image/png')

    except Exception as e:
        print("Error processing image:", e)
        return jsonify({
            "error": "Failed to process the image. Please check server logs for details."
        }), 500

@app.route('/ping', methods=['GET'])
def pinging():
    return "pong"

if __name__ == '__main__':
    app.run(debug=True, port=4000)
