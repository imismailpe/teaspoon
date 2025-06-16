import { transformToRecipe } from "../../mcps/recordRecipe";


export async function POST(req: Request, res: Response) {
    async function readableStreamToBlob(stream: ReadableStream, mimeType = 'audio/wav'): Promise<Blob> {
        const response = new Response(stream);
        const blob = await response.blob();
        return new Blob([blob], { type: mimeType });
    }
    const voiceInput = req.body;
    if (!voiceInput) {
        return new Response("No voice input provided", { status: 400 });
    }
    const blob = await readableStreamToBlob(req.body);
    const result = await transformToRecipe(blob);
    return new Response(JSON.stringify(result));
}