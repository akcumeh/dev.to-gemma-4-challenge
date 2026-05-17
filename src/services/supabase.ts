import { createClient } from "@supabase/supabase-js";
import { SuitAnalysis } from "../types";

const supabase = createClient(
    process.env.SUPABASE_PROJECT_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 
 * @param imageBuffer - a buffer file representing the user's image
 * @param mimeType - the file type uploaded
 * @returns the link to the uploaded image in the supabase bucket
 */
export async function uploadImgToSupabase (
    imageBuffer: Buffer,
    mimeType: string
): Promise<string> {
    const ext = mimeType.split('/')[1] ?? 'jpg';
    const filename = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
    .from('ff-ai')
    .upload(filename, imageBuffer, { contentType: mimeType });

    if (error) {
        // throw error;
        console.error('Failed to upload image: ' + error)
    };

    const { data } = supabase.storage
    .from('ff-ai')
    .getPublicUrl(filename);

    return data.publicUrl;
}

export async function saveGeneration(params: {
    waId: string;
    suitAnalysis: SuitAnalysis;
    userCaption: string;
    gemmaPrompt: string;
    outputImgURL: string;
}): Promise<void> {
   await supabase.from('ff-ai').insert({
    wa_id: params.waId,
    suit_analysis: params.suitAnalysis,
    user_caption: params.userCaption,
    gemma_prompt: params.gemmaPrompt,
    output_img_url: params.outputImgURL,
   });
}