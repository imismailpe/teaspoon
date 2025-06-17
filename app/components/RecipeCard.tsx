import React from 'react'
import Card from './Card'
import Ingredient from './Ingredient';
const RECIPE = {
  title: "Spanish Omlette",
  preparation: ["lorem ipsum dolor lorem lorem", "Cook well", "Serve hot"],
  ingredients: [
    { name: "Egg", quantity: "3" },
    { name: "Onion", quantity: "2 big" },
    { name: "Tomato", quantity: "2 small" },
    { name: "salt", quantity: "a pinch" }
  ],
  cooking_time: "5 mins",
  author: "Ismail"
}
type RecipeType = typeof RECIPE;

export default function RecipeCard({ recipe }: { recipe: RecipeType }) {
  const [showNotification, setShowNotification] = React.useState(false);
  const onShare = () => {
    // Logic to share the recipe
    if (!navigator.clipboard) {
      alert("Clipboard API not supported in your browser. Please copy the recipe manually.");
      return;
    }
    const recipeText = `Title: ${recipe?.title}\nAuthor: ${recipe?.author}\nCooking Time: ${recipe?.cooking_time}\nIngredients:\n${recipe?.ingredients.map(ing => `${ing.name}: ${ing.quantity}`).join('\n')}\nPreparation:\n${recipe?.preparation.join('\n')}`;
    navigator.clipboard.writeText(recipeText)
      .then(() => {
        console.log("Recipe copied to clipboard: ", recipeText);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      }
      )
      .catch(err => {
        console.error("Failed to copy recipe: ", err);
      }
      );
  }
  return (
    <>
      <Card>
        <div className='flex w-full justify-between items-center'>
          <h1 className='text-2xl'>{recipe?.title}</h1>
          <button onClick={onShare} className='text-gray-500 border border-solid px-2 rounded-full shadow-2 bg-orange-400 text-white hover:bg-orange-400 dark:hover:bg-orange-500 cursor-pointer'>Share</button>
        </div>
        <p className='flex w-full justify-between text-gray-500 dark:text-gray-300'><span className=''>{recipe?.cooking_time}</span><span>By: {recipe?.author}</span></p>
        <p className='mt-2 font-semibold'>Ingredients:</p>
        <div className=''>{recipe?.ingredients.map(ingre => {
          return <Ingredient key={ingre.name} name={ingre.name} quantity={ingre.quantity} />
        })}</div>
        <p className='mt-2 font-semibold'>Preparation:</p>
        <div className=''>{recipe?.preparation.map((prep, index) => <div key={index}>{prep}</div>)}</div>
      </Card>
      {showNotification ? <div className='fixed bottom-12 right-12 bg-green-600 p-4 rounded-lg shadow-lg'>
        Copied to clipboard
      </div> : null}
    </>
  )
}
