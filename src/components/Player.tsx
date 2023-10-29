import React from "react";
import videojs from "video.js";
import "@videojs/http-streaming";
// @ts-ignore
import "videojs-contrib-eme";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";

interface EME extends Player {
  qualityLevels(): unknown;
  eme(): unknown;
}

export function VideoJS(props: any) {
  const videoRef = React.useRef<any>(null);
  const playerRef = React.useRef<any>(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    try {
      // Make sure Video.js player is only initialized once
      if (!playerRef.current) {
        // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
        const videoElement = document.createElement("video-js");

        videoElement.classList.add("vjs-big-play-centered");
        videoRef.current.appendChild(videoElement);
        const player = videojs(
          videoElement,
          {
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            nativeControlsForTouch: true,
            liveui: true,
          },
          () => {
            videojs.log("player is ready");
            onReady && onReady(player);
          }
        ) as EME;

        playerRef.current = player;
        player.eme();
        player.qualityLevels();

        player.src(options);
      } else {
        const player = playerRef.current;
        
        player.autoplay(options.autoplay);
        player.eme();
        player.qualityLevels();
        player.src(options.sources);
      }
    } catch (error) {
      console.log(error);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}

export default VideoJS;
