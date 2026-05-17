const BASE_URL = 'https://graph.facebook.com/v19.0';
const TOKEN = () => process.env.META_ACCESS_TOKEN!;

export async function downloadMedia(mediaId: string): Promise<Buffer> {
    const metaRes = await fetch(`${BASE_URL}/${mediaId}`, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
    });
    const { url } = await metaRes.json() as { url: string };

    const fileRes = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
    });
    const arrayBuffer = await fileRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export async function sendText(to: string, text: string): Promise<void> {
    await fetch(`${BASE_URL}/${process.env.META_PHONE_NUM_ID}/messages`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: { body: text },
        }),
    });
}

export async function sendImage(to: string, imageUrl: string, caption = ''): Promise<void> {
    await fetch(`${BASE_URL}/${process.env.META_PHONE_NUM_ID}/messages`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to,
            type: 'image',
            image: { link: imageUrl, caption },
        }),
    });
}