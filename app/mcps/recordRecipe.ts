import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const recordRecipeSchema = z.object({
  data: z.object({
    title: z.string(),
    method: z.array(z.string()),
    ingredients: z.array(z.object({
      id: z.number(),
      quantity: z.string()
    })),
    labels: z.array(z.string()),
    author: z.string(),
    cooking_time: z.string(),

  })
});
export const recordSchema = async (input:string) => {
  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    prompt: input,
    schema: recordRecipeSchema,
    system: "You are a very good chef who can convert recipes into english from multiple languages. You know how to extract ingredients and methods from a voice recording describing the recipe."
  });
  return object.data;
}