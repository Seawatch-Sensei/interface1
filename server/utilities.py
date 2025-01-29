from gradio_client import Client, handle_file
import torch
from torchvision import transforms
from PIL import Image
from load_LSTM import ModelWrapper
import matplotlib.pyplot as plt


def predict(path):
    client = Client("rwankhalifa/Fruits_Class")
    result = client.predict(
            image=handle_file(path),
            api_name="/predict"
    )
    return result


def preprocess_image(image_path: str):
    """
    Preprocesses the input image to be compatible with the model.

    Args:
        image_path (str): Path to the input image.

    Returns:
        torch.Tensor: Preprocessed image tensor.
    """
    transform = transforms.Compose([
        transforms.Resize((256, 256)),  # Default size as per training
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    image = Image.open(image_path).convert("RGB")
    image = transform(image)
    image = image.unsqueeze(0)  # Add batch dimension
    image = image.permute(1, 0, 2, 3)  # Rearrange dimensions as per training setup
    return image.unsqueeze(0)


def preprocess_image_no_normalize(image_path: str):
    """
    Preprocesses the input image to be compatible with the model.

    Args:
        image_path (str): Path to the input image.

    Returns:
        torch.Tensor: Preprocessed image tensor.
    """
    transform = transforms.Compose([
        transforms.Resize((256, 256)),  # Default size as per training
        transforms.ToTensor(),
    ])

    image = Image.open(image_path).convert("RGB")
    image = transform(image)
    image = image.unsqueeze(0)  # Add batch dimension
    image = image.permute(1, 0, 2, 3)  # Rearrange dimensions as per training setup
    return image.unsqueeze(0)


def denormalize_image(output_image: torch.Tensor):
    """
    Denormalizes the output image from model predictions.

    Args:
        output_image (torch.Tensor): The model's raw output image tensor in shape (H, W, C).

    Returns:
        torch.Tensor: The denormalized image tensor in shape (H, W, C).
    """
    # Check if the input image is in HWC format and convert to CHW format
    if output_image.ndimension() == 3 and output_image.shape[2] == 3:
        output_image = output_image.permute(2, 0, 1)  # Convert to C x H x W format

    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)  # Shape (3, 1, 1)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)  # Shape (3, 1, 1)

    # Reverse normalization: output_image * std + mean
    denormalized_image = output_image * std + mean

    # Convert back to HWC format for visualization
    denormalized_image = denormalized_image.permute(1, 2, 0)  # Convert back to H x W x C
    return denormalized_image





def load_model(model_path: str, device: str):
    """
    Load the trained NextFramePredictionModel from the specified path.

    Args:
        model_path (str): Path to the saved model file (e.g., mode.pth).
        device (str): Device to load the model on (e.g., 'cpu' or 'cuda').

    Returns:
        torch.nn.Module: The loaded model in evaluation mode.
    """


    # Initialize the model
    model = ModelWrapper()
    model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
    model.eval()  # Set the model to evaluation mode
    return model


def calculate_time_steps(temperature: float, base_temperature: float = 25, Q10: float = 2):
    """
    Calculates the equivalent time steps needed based on the given temperature.

    Args:
        temperature (float): The current temperature.
        base_temperature (float): The temperature for which the model is calibrated (default is 25).
        Q10 (float): The Q10 coefficient (default is 2).

    Returns:
        int: The number of prediction steps needed.
    """
    k1 = 1  # Original spoilage rate at base_temperature (1 step per day at 25°C)
    k2 = k1 * Q10 ** ((temperature - base_temperature) / 10)
    return max(1, round(k2))  # Ensure at least 1 step


def predict_next_frame(image_path: str, model: torch.nn.Module, num_steps: int = 1):
    """
    Predicts the next frame(s) based on the input image and temperature-adjusted steps.

    Args:
        image_path (str): Path to the input image.
        model (torch.nn.Module): Loaded PyTorch model.
        num_steps (int): Number of prediction steps to perform.

    Returns:
        np.ndarray: Predicted frame as a NumPy array after `num_steps` iterations.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    # Preprocess the input image
    input_tensor = preprocess_image(image_path).to(device)

    # Iteratively predict the next frame
    for _ in range(num_steps):
        with torch.no_grad():
            output_tensor = model(input_tensor)
        # Update input_tensor for the next prediction
        if _ == num_steps-1:
            output_frame = output_tensor.permute(0, 2, 3, 4, 1)[0][0].detach().cpu().numpy()
        input_tensor = output_tensor

    # Postprocess the final output
    return torch.tensor(output_frame)


def load_and_predict(image_path: str, temperature: float=25, model_path: str = 'models\model.pth'):
    """
    Loads the model, calculates time steps, and predicts the next frame for the given image and temperature.

    Args:
        image_path (str): Path to the input image.
        temperature (float): The current temperature.
        model_path (str): Path to the saved model file.

    Returns:
        np.ndarray: Predicted frame as a NumPy array.
    """
    # Determine the device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load the model
    model = load_model(model_path, device)

    # Calculate the number of steps based on temperature
    num_steps = calculate_time_steps(temperature)
    print(num_steps)
    # Predict the next frame(s)
    return predict_next_frame(image_path, model, num_steps=num_steps)



r'''
# Create subplots for visualization
fig, axes = plt.subplots(2, 2, figsize=(20, 5))  # 1 row, 4 columns of subplots

# Input frame
axes[0, 0].imshow(denormalize_image(preprocess_image(r'C:\Users\alaao\Desktop\Image1.png').permute(0, 2, 3, 4, 1)[0][0]))
axes[0, 0].set_title("Input Frame")

A = load_and_predict(r'C:\Users\alaao\Desktop\Image1.png', r"E:\Internships\AI Lab\server\models\model.pth")

# Input frame
axes[0, 1].imshow(denormalize_image(A))
axes[0, 1].set_title("Output Frame")


# Input frame
axes[1, 0].imshow(preprocess_image(r'C:\Users\alaao\Desktop\Image1.png').permute(0, 2, 3, 4, 1)[0][0])
axes[1, 0].set_title("Input Frame")


# Input frame
axes[1, 1].imshow(A)
axes[1, 1].set_title("Output Frame")

plt.show()
'''
