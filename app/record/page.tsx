import React from 'react';
import Card from '../components/Card';
import Ingredient from '../components/Ingredient';

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

function Record() {
  return (
    <div className='mx-[12px] my-[12px] flex gap-[8px] flex-col'>
      <Card>
        <div className=''>
          Record a Recipe
        </div>
        <p className=''>Recollect your memories and narrate the recipe to an imaginery friend. I will take care of documenting it.</p>
        <button className='rounded border border-solid px-[4px]'>Record</button>
      </Card>
      <Card>
        <div className='flex w-full justify-between items-center'>
          <h1 className='text-2xl'>{RECIPE.title}</h1>
          <button className='text-gray-500 border border-solid px-2 rounded-full shadow-2 bg-orange-400 text-white hover:bg-orange-400 dark:hover:bg-orange-500 cursor-pointer'>Share</button>
        </div>
        <p className='flex w-full justify-between'><span className='text-gray-300'>{RECIPE.cooking_time}</span><span>By: {RECIPE.author}</span></p>
        <p className='mt-2 font-semibold'>Ingredients:</p>
        <div className=''>{RECIPE.ingredients.map(ingre => {
          return <Ingredient key={ingre.name} name={ingre.name} quantity={ingre.quantity} />
        })}</div>
        <p className='mt-2 font-semibold'>Preparation:</p>
        <div className=''>{RECIPE.preparation.map((prep, index) => <div key={index}>{prep}</div>)}</div>
      </Card>
    </div>
  )
}

export default Record;