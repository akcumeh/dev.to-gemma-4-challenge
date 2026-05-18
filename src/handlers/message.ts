import { WAMsg } from "../types";
import { downloadMedia, sendText, sendImage } from "../services/wa";
import { observeSuit } from "../pipeline/observer";
import { buildPrompt } from "../pipeline/artDirector";
import { generateImage } from "../pipeline/artist";
import { saveGeneration } from "../services/supabase";
import { withRetry } from "../utils";

export async function handleInboundMessage(
    message: WAMsg,
    phoneNumId: string
): Promise<void> {
    const sender = message.from;
    console.log(`[message] inbound from ${sender}, type=${message.type}`);

    if (message.type !== 'image') {
        await sendText(sender, "Send me a picture of a suit and I'll style it for you.");
        return;
    }

    await sendText(sender, "Got it! Generating your model now, give me about 15 seconds...");

    try {
        console.log('[message] downloading media...');
        const imageBuffer = await withRetry(() => downloadMedia(message.image!.id));
        const caption = message.image?.caption ?? '';
        console.log(`[message] media downloaded (${imageBuffer.length} bytes), caption="${caption}"`);

        console.log('[message] running suit analysis...');
        const suit = await withRetry(() => observeSuit(imageBuffer));
        console.log('[message] suit analysis complete:', suit);

        if ('error' in suit) {
            await sendText(sender, "I couldn't see a suit clearlt in the photo. Can you try a clearer shot or a different picture?");
            return;
        }

        console.log('[message] building image prompt...');
        const prompt = await withRetry(() => buildPrompt(suit, caption));
        console.log('[message] prompt built:', prompt);

        console.log('[message] generating image...');
        const outputImgURL = await withRetry(() => generateImage(prompt));
        console.log('[message] image generated:', outputImgURL);

        console.log('[message] saving to database...');
        await saveGeneration({
            waId: sender,
            suitAnalysis: suit,
            userCaption: caption,
            gemmaPrompt: prompt,
            outputImgURL,
        });

        console.log('[message] sending image to user...');
        await sendImage(sender, outputImgURL);
        console.log('[message] done.');
    } catch (err) {
        console.error('[handleInboundMessage error]', err);
        await sendText(sender, 'Something went wrong. Please try again in a moment.');
    }
}