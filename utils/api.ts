export const captureImage = (videoElement: HTMLVideoElement): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/jpeg");
  });
};

export const getMusicFromImage = async (imageBlob: Blob): Promise<string> => {
  // Send image to /api/describe-image
  const formData = new FormData();
  formData.append("image", imageBlob);

  const descriptionRes = await fetch("/api/describe-image", {
    method: "POST",
    body: formData,
  });
  const { description } = await descriptionRes.json();

  // Send description to /api/generate-prompt
  const promptRes = await fetch("/api/generate-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });
  const { prompt } = await promptRes.json();

  // Send prompt to /api/generate-music
  const musicRes = await fetch("/api/generate-music", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const { audioUrl } = await musicRes.json();

  return audioUrl;
};

export const uploadImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch("/api/describe-image", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  if (response.ok) {
    return data.description;
  } else {
    throw new Error(data.error || "Failed to describe image");
  }
};

export const generatePrompt = async (description: string): Promise<string> => {
  const response = await fetch("/api/generate-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });
  const data = await response.json();

  if (response.ok) {
    return data.prompt;
  } else {
    throw new Error(data.error || "Failed to generate prompt");
  }
};

export const generateMusic = async (prompt: string): Promise<string> => {
  const response = await fetch("/api/generate-music", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();

  if (response.ok) {
    // Reconstruct the audio URL from base64
    const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
    return audioUrl;
  } else {
    throw new Error(data.error || "Failed to generate music");
  }
};

