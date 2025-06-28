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
function Record() {
  const [recording, setRecording] = React.useState(false);
  const [recordedAudio, setRecordedAudio] = React.useState<Blob[]>([]);
  const [recipe, setRecipe] = React.useState<RecipeType>({} as RecipeType);
  const [recipeReady, setRecipeReady] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);

  const onStartRecording = async () => {
    setRecordedAudio([]);
    setRecording(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const audioChunks: Blob[] = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setRecordedAudio((prevData) => [...prevData, audioBlob]);
        onSubmitRecording(audioBlob);
        // console.log("Audio recorded", audioBlob);
      };
      mediaRecorderRef.current.start();
      console.log("Recording started");
    }
  };
  const onStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setRecording(false);
    } else {
      console.warn("No recording in progress to stop.");
    }
  };
  const onRecordClick = () => {
    if (recording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };
  const onSubmitRecording = async (record: Blob) => {
    // Logic to submit the recorded audio for processing
    setProcessing(true);
    // console.log("Submitting recording for processing", record);
    const response = await fetch("/api/convert_recipe", {
      method: "POST",
      body: record,
    });
    if (response.ok) {
      const data = await response.json();
      // console.log("Recipe data received:", data.result);
      setRecipe(data.result);
      setRecipeReady(true);
    }
    setProcessing(false);
  };

  return (
    <div className="mx-[12px] my-[12px] flex gap-[8px] flex-col">
      {recipeReady ? (
        <>
          <RecipeCard recipe={recipe} />
          <div className="flex gap-4 items-center justify-center mt-4">
            <audio controls src={URL.createObjectURL(recordedAudio[0])} />
            <button
              onClick={() => setRecipeReady(false)}
              className="text-gray-500 border border-solid px-2 rounded-full shadow-2 bg-red-400 text-white hover:bg-red-500 dark:hover:bg-red-600 cursor-pointer w-fit"
            >
              Record new
            </button>
          </div>
        </>
      ) : (
        <Card>
          <div className="">Record a Recipe</div>
          <p className="">
            Recollect your memories and narrate the recipe to an imaginery
            friend. I will take care of documenting it. Maximum is 60 seconds.
          </p>
          <button
            onClick={onRecordClick}
            className="rounded border border-solid px-3 w-fit bg-red-500 cursor-pointer"
            disabled={processing}
          >
            {recording ? "Stop" : processing ? "Loading.." : "Record"}
          </button>
        </Card>
      )}
    </div>
  );
}

export default Record;
