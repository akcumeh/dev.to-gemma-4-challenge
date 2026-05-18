import { Router, Request, Response } from "express";
import { handleInboundMessage } from "../handlers/message";

const router = Router();

router.get('/webhook', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
        console.log('Webhook verified.');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

router.post('/webhook', async (req: Request, res: Response) => {
    res.sendStatus(200);

    const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];
    if (!message) return;

    await handleInboundMessage(message, entry.metadata.phone_number_id);
});

router.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

export default router;