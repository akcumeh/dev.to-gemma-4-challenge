import { GoogleGenAI } from '@google/genai';
import { uploadImgToSupabase } from '../services/supabase';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function generateImage(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseModalities: ['IMAGE', 'TEXT'] } as any,
    });

    const imagePart = response.candidates?.[0]?.content?.parts
        ?.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart?.inlineData?.data) {
        throw new Error('No image returned from generation model.');
    }

    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    return uploadImgToSupabase(imageBuffer, imagePart.inlineData.mimeType);
}