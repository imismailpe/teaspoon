import { NextResponse } from "next/server";
import { transformToRecipe } from "../../mcps/recordRecipe";
import { createClient } from "@deepgram/sdk";

export async function POST(req: Request) {
  //   async function readableStreamToBlob(
  //     stream: ReadableStream,
  //     mimeType = "audio/wav"
  //   ): Promise<Blob> {
  //     const response = new Response(stream);
  //     const blob = await response.blob();
  //     return blob;
  //     // return new Blob([blob], { type: mimeType });
  //   }
  const voiceInput = req.body;
  if (!voiceInput) {
    return new Response("No voice input provided", { status: 400 });
  }

  const blob = await new Response(req.body!).blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    buffer,
    {
      model: "nova-3",
      smart_format: true,
      language: "en",
      punctuate: true,
      diarize: false,
      //   translate: true, // only if you want English translation
    }
  );

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const data =
    result?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";

  const resultData = await transformToRecipe(data);
  return NextResponse.json({ result: resultData });
}
