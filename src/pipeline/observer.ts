import { GoogleGenAI } from '@google/genai';
import { SuitAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function observeSuit(imageBuffer: Buffer): Promise<SuitAnalysis | { error: string }> {
    console.log('[observer] sending image to gemini-2.5-flash for analysis...');
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: imageBuffer.toString('base64'),
                        },
                    },
                    {
                        text: `Analyze this suit garment carefully.
Return ONLY valid JSON — no markdown, no explanation.

SUIT TYPES:
- "skirt-suit": jacket + separate skirt
- "gown-suit": jacket + attached full-length dress panel

SKIRT LENGTH (skirt-suit only):
- "knee":  hem at or just above the knee
- "3/4":   hem between knee and ankle, closer to mid-calf
- "full":  hem at or near the ankle

GOWN LENGTH (gown-suit only):
- "3/4":   hem between knee and ankle, closer to mid-calf
- "full":  hem at or near the ankle

SLEEVE LENGTH:
- "3/4":   sleeve ends between elbow and wrist, closer to the wrist
- "full":  sleeve ends at the wrist; a watch or bangle would be partially visible

Return this JSON structure:
{
  "color": string,
  "pattern": string (e.g. "solid", "striped", "lace overlay"),
  "texture": string (e.g. "satin", "crepe", "brocade"),
  "type": "skirt-suit" | "gown-suit",

  // include only if type is "skirt-suit":
  "skirtLength": "knee" | "3/4" | "full",
  "hasCamisole": boolean,

  // include only if type is "gown-suit":
  "gownLength": "3/4" | "full",
  "hasBelt": boolean,
  "hasNoJacket": boolean,

  // always include:
  "sleeveLength": "3/4" | "full",
  "notes": string
}

If you cannot clearly see a suit, return: { "error": "no_suit_detected" }`,
                    },
                ],
            },
        ],
    });

    const raw = response.text ?? '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
}