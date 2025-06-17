import { writeRecipe } from "@/app/mcps/createRecipe";

export async function POST(req: Request) {
  const body = await req.json();
  const { dish } = body;
  if (!dish) {
    return new Response("No dish provided", { status: 400 });
  }
  const response = await writeRecipe(dish);
  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}