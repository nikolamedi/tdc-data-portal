import { PlayIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";

export default function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  return (
    <>
      <video
        ref={videoRef}
        className={`h-[405px] w-full ${isPlaying ? "" : "hidden"}`}
        controls
        onEnded={() => setIsPlaying(false)}
      >
        <source src="your-video-url.mp4" type="video/mp4" />
      </video>
      {!isPlaying && (
        <div
          className="relative flex aspect-[4/3] h-[405px] w-full items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: "url(./images/video-thumbnail.png)",
          }}
        >
          <button
            onClick={handlePlay}
            className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.5)]"
          >
            <PlayIcon className="w-[40px] text-white" />
          </button>
        </div>
      )}
    </>
  );
}