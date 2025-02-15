from gradio_client import Client, handle_file
from PIL import Image


def predict(path):
    client = Client("rwankhalifa/Fruits_Class")
    result = client.predict(
            image=handle_file(path),
            api_name="/predict"
    )
    return result

from gradio_client import Client, handle_file

def lstm_api(path, temperature):
    client = Client("AlaaAbbas/banana1")
    result = client.predict(
            image=handle_file(path),
            temperature=temperature,
            api_name="/predict"
    )    
    return Image.open(result).convert("RGB")

