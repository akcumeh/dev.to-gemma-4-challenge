import { GoogleGenAI } from '@google/genai';
import { uploadImgToSupabase } from '../services/supabase';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function generateImage(prompt: string): Promise<string> {
    console.log('[artist] generating image with imagen-4.0-generate-001...');

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: { numberOfImages: 1 },
    });

    const b64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (!b64) throw new Error('No image returned from Imagen 4.');

    console.log('[artist] image received, uploading to Supabase...');
    const imageBuffer = Buffer.from(b64, 'base64');
    return uploadImgToSupabase(imageBuffer, 'image/png');
}
