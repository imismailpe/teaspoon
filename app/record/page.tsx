"use client";
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
  const [recording, setRecording] = React.useState(false);
  const [recordedAudio, setRecordedAudio] = React.useState<Blob[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);


  const onShare = () => {
    // Logic to share the recipe
    if (!navigator.clipboard) {
      alert("Clipboard API not supported in your browser. Please copy the recipe manually.");
      return;
    }
    const recipeText = `Title: ${RECIPE.title}\nAuthor: ${RECIPE.author}\nCooking Time: ${RECIPE.cooking_time}\nIngredients:\n${RECIPE.ingredients.map(ing => `${ing.name}: ${ing.quantity}`).join('\n')}\nPreparation:\n${RECIPE.preparation.join('\n')}`;
    navigator.clipboard.writeText(recipeText)
      .then(() => {
        console.log("Recipe copied to clipboard: ", recipeText);
      }
      )
      .catch(err => {
        console.error("Failed to copy recipe: ", err);
      }
      );
  }
  const onStartRecording = async () => {
    setRecording(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const audioChunks: Blob[] = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      }
      mediaRecorderRef.current.onstop = () => {
        console.log("Recording stopped");
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setRecordedAudio(prevData => [...prevData, audioBlob]);
        console.log("Audio recorded", audioBlob);
        onSubmitRecording(audioBlob)
      }
      mediaRecorderRef.current.start();
      console.log("Recording started");
    }
  }
  const onStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setRecording(false);
    } else {
      console.warn("No recording in progress to stop.");
    }
  }
  const onRecordClick = () => {
    if (recording) {
      onStopRecording();
    }
    else {
      onStartRecording();
    }
  }
  const onSubmitRecording = async (record: Blob) => {
    // Logic to submit the recorded audio for processing
    console.log("Submitting recording for processing", record);
    await fetch('/api/convert_recipe', { method: 'POST', body: record });
  }
  return (
    <div className='mx-[12px] my-[12px] flex gap-[8px] flex-col'>
      <Card>
        <div className=''>
          Record a Recipe
        </div>
        <p className=''>Recollect your memories and narrate the recipe to an imaginery friend. I will take care of documenting it.</p>
        <button onClick={onRecordClick} className='rounded border border-solid px-3 w-fit bg-red-500 cursor-pointer'>{recording ? "Stop" : "Record"}</button>

      </Card>
      <Card>
        <div className='flex w-full justify-between items-center'>
          <h1 className='text-2xl'>{RECIPE.title}</h1>
          <button onClick={onShare} className='text-gray-500 border border-solid px-2 rounded-full shadow-2 bg-orange-400 text-white hover:bg-orange-400 dark:hover:bg-orange-500 cursor-pointer'>Share</button>
        </div>
        <p className='flex w-full justify-between text-gray-500 dark:text-gray-300'><span className=''>{RECIPE.cooking_time}</span><span>By: {RECIPE.author}</span></p>
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