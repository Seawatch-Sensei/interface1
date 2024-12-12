

import { NextResponse } from 'next/server'
import { pipeline } from '@huggingface/transformers';

export async function GET(request) {
    const text = request.nextUrl.searchParams.get('text');
    if (!text) {
        return NextResponse.json({
            error: 'Missing text parameter',
        }, { status: 400 });
    }

    const task = 'text-classification';
    const model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
   
    const instance = await pipeline(task, model);
        
    // Get the classification pipeline. When called for the first time,
    // this will load the pipeline and cache it for future use.
    const classifier = instance

    // Actually perform the classification
    const result = await classifier(text);

    return NextResponse.json(result);
}