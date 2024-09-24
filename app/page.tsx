/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import { uploadImage, generatePrompt, generateMusic } from "@/utils/api";

const HomePage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState<boolean>(false);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const imgFile = event.target.files[0];
        setImage(imgFile);
        setIsUploadingImage(true);

        try {
          const desc = await uploadImage(imgFile);
          setDescription(desc);
        } catch (error: any) {
          console.error(error);
          alert(error.message || "Failed to describe image");
        } finally {
          setIsUploadingImage(false);
        }
      }
    },
    []
  );

  const handleGeneratePrompt = useCallback(async () => {
    if (description) {
      setIsGeneratingPrompt(true);
      try {
        const promptResult = await generatePrompt(description);
        setGeneratedPrompt(promptResult);
      } catch (error: any) {
        console.error(error);
        alert(error.message || "Failed to generate prompt");
      } finally {
        setIsGeneratingPrompt(false);
      }
    }
  }, [description]);

  const handleGenerateMusic = useCallback(async () => {
    if (prompt) {
      setIsGeneratingMusic(true);
      try {
        const audioUrl = await generateMusic(prompt);
        setAudioSrc(audioUrl);
      } catch (error: any) {
        console.error(error);
        alert(error.message || "Failed to generate music");
      } finally {
        setIsGeneratingMusic(false);
      }
    }
  }, [prompt]);

  return (
    <div>
      <h1>API Testing Ground</h1>

      {/* Test /api/describe-image */}
      <section>
        <h2>1. Describe Image</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {isUploadingImage ? (
          <p>Uploading image...</p>
        ) : (
          description && (
            <p>
              <strong>Description:</strong> {description}
            </p>
          )
        )}
      </section>

      {/* Test /api/generate-prompt */}
      <section>
        <h2>2. Generate Prompt</h2>
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          cols={50}
        />
        <button
          onClick={handleGeneratePrompt}
          disabled={isGeneratingPrompt || !description}
        >
          {isGeneratingPrompt ? "Generating Prompt..." : "Generate Prompt"}
        </button>
        {generatedPrompt && (
          <p>
            <strong>Generated Prompt:</strong> {generatedPrompt}
          </p>
        )}
      </section>

      {/* Test /api/generate-music */}
      <section>
        <h2>3. Generate Music</h2>
        <textarea
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          cols={50}
        />
        <button
          onClick={handleGenerateMusic}
          disabled={isGeneratingMusic || !prompt}
        >
          {isGeneratingMusic ? "Generating Music..." : "Generate Music"}
        </button>
        {audioSrc && (
          <div>
            <audio controls src={audioSrc} />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

