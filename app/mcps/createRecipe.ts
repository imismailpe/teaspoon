import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const writeRecipeSchema = z.object({
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
export const writeRecipe = async (input: string) => {
  const model = google("gemini-2.5-flash-preview-04-17");

  const { object } = await generateObject({
    model: model,
    schema: writeRecipeSchema,
    system: "You are a very good chef who can write recipes in english for any dish. if the dish is not known or invalid, return false in success and an empty recipe.",
    prompt: input + "Author: Ismail",
  });
  return object.data;
}