import { WAMsg } from "../types";
import { downloadMedia, sendText, sendImage } from "../services/wa";
import { observeSuit } from "../pipeline/observer";
import { buildPrompt } from "../pipeline/artDirector";
import { generateImage } from "../pipeline/artist";
import { saveGeneration } from "../services/supabase";
import { withRetry } from "../utils";
import { generatePrime } from "node:crypto";

export async function handleInboundMessage(
    message: WAMsg,
    phoneNumId: string
): Promise<void> {
    const sender = message.from;

    if (message.type !== 'image') {
        await sendText(sender, "Send me a picture of a suit and I'll style it for you.");
        return;
    }

    await sendText(sender, "Got it! Generating your model now, give me about 15 seconds...");

    try {
        const imageBuffer = await withRetry(() => downloadMedia(message.image!.id));
        const caption = message.image?.caption ?? '';

        const suit = await withRetry(() => observeSuit(imageBuffer));

        if ('error' in suit) {
            await sendText(sender, "I couldn't see a suit clearlt in the photo. Can you try a clearer shot or a different picture?");
            return;
        }

        const prompt = await withRetry(() => buildPrompt(suit, caption));
        const outputImgURL = await withRetry(() => generateImage(prompt));

        await saveGeneration({
            waId: sender,
            suitAnalysis: suit,
            userCaption: caption,
            gemmaPrompt: prompt,
            outputImgURL,
        });

        await sendImage(sender, outputImgURL);
    } catch (err) {
        console.error('[handleInboundMessage error]', err);
        await sendText(sender, 'Something went wrong. Please try again in a moment.');
    }
}