"use client";
import React from "react";
import Card from "../components/Card";
import RecipeCard from "../components/RecipeCard";

type RecipeType = {
  title: string;
  preparation: string[];
  ingredients: { name: string; quantity: string }[];
  cooking_time: string;
  author: string;
};

export default function WriteRecipe() {
  const [recipeReady, setRecipeReady] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [recipe, setRecipe] = React.useState<RecipeType>({} as RecipeType);
  const [dish, setDish] = React.useState("");
  const [showNotification, setShowNotification] = React.useState(false);
  const onSubmitDish = async () => {
    if (!dish) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return;
    }
    setProcessing(true);
    try {
      const response = await fetch("/api/create_recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dish }),
      });

      const data = await response.json();
      console.log("Recipe created:", data);
      if (data.success) {
        setRecipe(data);
        setRecipeReady(true);
      } else {
        setRecipeReady(false);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    } finally {
      setProcessing(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-start">
      <Card>
        <div className="flex flex-col items-center justify-start">
          <input
            onChange={(e) => setDish(e.target.value)}
            type="text"
            placeholder="Wish for a dish"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={onSubmitDish}
            className="mt-4 w-fit bg-blue-500 text-white px-2 rounded-md hover:bg-blue-600"
          >
            {processing ? "Loading.." : "Generate Recipe"}
          </button>
        </div>
      </Card>
      {recipeReady ? (
        <div className="m-auto w-fit">
          <RecipeCard recipe={recipe} />
        </div>
      ) : null}
      {showNotification ? (
        <div className="fixed bottom-12 right-12 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          Is that a real dish? Please try again with a different name.
        </div>
      ) : null}
    </div>
  );
}
