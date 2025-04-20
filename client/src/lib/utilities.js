import { Client, handle_file } from "@gradio/client";

async function predict(path) {
    const client = await Client.connect("rwankhalifa/Fruits_Class");
    const result = await client.predict("/predict",{
        image: handle_file(path),
    });
    return result.data[0];
}

async function HFApi(path, temperature) {
    const client = await Client.connect("AlaaAbbas/banana1");
    const result = await client.predict("/predict",{
        image: handle_file(path),
        temperature: temperature,
        
    });
    return result.data[0].url;
}

export { predict, HFApi };