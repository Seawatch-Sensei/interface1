from gradio_client import Client, handle_file

def predict(path):
    client = Client("rwankhalifa/Fruits_Class")
    result = client.predict(
            image=handle_file(path),
            api_name="/predict"
    )
    return result

