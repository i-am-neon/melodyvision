"use client";

import React, { useRef, useEffect } from "react";
import { captureImage, getMusicFromImage } from "../utils/api";

interface CameraComponentProps {
  onNewAudio: (src: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onNewAudio }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    };

    startCamera();

    intervalRef.current = setInterval(async () => {
      if (videoRef.current) {
        const imageBlob = await captureImage(videoRef.current);
        const audioSrc = await getMusicFromImage(imageBlob);
        onNewAudio(audioSrc);
      }
    }, 30000); // Capture every 30 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [onNewAudio]);

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ display: "none" }} />
    </div>
  );
};

export default CameraComponent;
