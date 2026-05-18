import { GoogleGenAI } from "@google/genai";
import { SuitAnalysis } from "../types";
import { STYLE_VARIANTS, STYLE_WEIGHTS, FashionStyle, PickedVariant } from "../config/styleVariants";
import { SUIT_ANATOMY } from "../config/suitAnatomy";
import { pickRandom, weightedPick } from "../utils";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

function pickVariant(hasCaption: boolean) {
    const fashionWeights = hasCaption
        ? STYLE_WEIGHTS.fashion.withCaption
        : STYLE_WEIGHTS.fashion.freeform;

    const fashion = weightedPick(fashionWeights as Record<FashionStyle, number>);
    const headwearPool = STYLE_VARIANTS.headwear[fashion as keyof typeof STYLE_VARIANTS.headwear] as readonly string[];

    return {
        fashion,
        headwear: pickRandom(headwearPool),
        hair: pickRandom(STYLE_VARIANTS.hair),
        skinTone: pickRandom(STYLE_VARIANTS.skinTone),
        age: weightedPick(STYLE_WEIGHTS.age as Record<string, number>),
        background: pickRandom(STYLE_VARIANTS.background),
        accessories: pickRandom(STYLE_VARIANTS.accessories),
    };
}

export async function buildPrompt(
    suit: SuitAnalysis,
    userCaption: string
) {
    const hasCaption = userCaption.trim().length > 0;
    const variant = pickVariant(hasCaption);



    const lengthDesc = suit.type === 'skirt-suit'
        ? `skirt: ${suit.skirtLength ? SUIT_ANATOMY.skirtLength[suit.skirtLength] : 'unknown'}`
        : `gown: ${suit.gownLength ? SUIT_ANATOMY.gownLength[suit.gownLength] : 'unknown'}`;

    const sleeveDesc = SUIT_ANATOMY.sleeveLength[suit.sleeveLength];

    const structureNotes: string[] = [];
    if (suit.hasCamisole) structureNotes.push(SUIT_ANATOMY.hasCamisole);
    if (suit.hasBelt) structureNotes.push(SUIT_ANATOMY.hasBelt);
    if (suit.hasNoJacket) structureNotes.push(SUIT_ANATOMY.hasNoJacket);

    console.log(`[artDirector] picked variant: ${JSON.stringify(variant)}`);
    console.log('[artDirector] sending to gemma-4-31b-it for prompt engineering...');
    const response = await ai.models.generateContent({
        model: 'gemma-4-31b-it',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `You are a fashion photography art director.
Write a single, dense, photorealistic image generation prompt.

SUIT ANALYSIS (from vision model):
- Color: ${suit.color}
- Pattern: ${suit.pattern}
- Texture: ${suit.texture}
- Type: ${suit.type}
- Length: ${lengthDesc}
- Sleeve: ${sleeveDesc}
${structureNotes.length > 0 ? `- Structure: ${structureNotes.join('; ')}` : ''}
${suit.notes ? `- Additional details: ${suit.notes}` : ''}

USER INSTRUCTION (overrides the analysis on any conflict):
"${userCaption || 'No caption provided.'}"

STYLE VARIANT FOR THIS GENERATION:
- Fashion context: ${variant.fashion}
- Headwear: ${variant.headwear}
- Hair: ${variant.hair}
- Skin tone: ${variant.skinTone}
- Age: ${variant.age}
- Background: ${variant.background}
- Accessories: ${variant.accessories}

RULES:
1. The model is ALWAYS plus-sized (XL–4XL body type). Non-negotiable. Do not soften it.
2. If fashion context is "muslim", describe the headwear coordinating with the suit without altering its cut.
3. If fashion context is "nigerian", describe the gele or headtie coordinating with the suit in color and formality. Do not alter the suit's cut.
4. If age is "50s" or "60s", the model should appear dignified and polished — not exaggerated or frail.
5. Shot style: editorial fashion photography, DSLR, 85mm lens, soft natural shadows, no overprocessing.
6. The suit's color, pattern, and texture must be preserved exactly as described.
7. The user's caption overrides the suit analysis on any conflicting point.

NEGATIVES: No flared or puffed skirts. No cartoonish rendering. No plastic or oversmoothed skin. No warped hands or face. No unrealistic body shaping.

Output only the prompt text — nothing else.`,
                    },
                ],
            },
        ],
    });

    return response.text ?? '';
}