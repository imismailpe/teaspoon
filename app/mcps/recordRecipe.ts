import { google } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { z } from "zod";

const recordRecipeSchema = z.object({
  data: z.object({
    success: z.boolean(),
    title: z.string(),
    preparation: z.array(z.string()),
    ingredients: z.array(z.object({
      // id: z.number(),
      name: z.string(),
      quantity: z.string()
    })),
    labels: z.array(z.string()),
    author: z.string(),
    cooking_time: z.string(),
  })
});
export const transformToRecipe = async (input: Blob) => {
  const arrayBuffer = await input.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const model = google("gemini-2.5-flash-preview-04-17");

  const transcribe = await generateText({
    model,
    prompt: `Transcribe the following audio recording into a recipe in English. The audio is a voice recording describing a recipe. Please extract the ingredients, preparation steps, cooking time, and author if mentioned. The audio is in wav format.\n\nAudio:\n${uint8Array}`,
    system: "You are a very good chef who can convert recipes into english from multiple languages. You know how to extract ingredients and methods from a voice recording describing the recipe.",
  });

  const { object } = await generateObject({
    model: model,
    schema: recordRecipeSchema,
    system: "You are a very good chef who can convert recipes into english from multiple languages. You know how to extract ingredients and methods from the recipe.",
    prompt: transcribe.text,
    // prompt: "Boil water, add salt, and cook pasta for 10 minutes. Drain and serve with sauce.",
  });
  return object.data;
}