"use client";

import React from "react";

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return (
    <div>
      <audio controls src={src} />
    </div>
  );
};

export default AudioPlayer;
