import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import hlsQualitySelector from "videojs-hls-quality-selector";

videojs.registerPlugin("hlsQualitySelector", hlsQualitySelector);

export const VideoPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // Add the HLS Quality Selector plugin
      player.hlsQualitySelector = hlsQualitySelector;
      player.hlsQualitySelector();

      player.on('loadedmetadata', () => {
        const qualities = player.qualityLevels();
        for (let i = 0; i < qualities.length; i++) {
          const quality = qualities[i];
          quality.enabled = true; // Enable all quality levels for auto mode
        }
      });

      player.on('hlsqualityselector:change', function(event, newQuality) {
        if (newQuality === 'auto') {
          player.qualityLevels().forEach((quality) => (quality.enabled = true));
        } else {
          player.qualityLevels().forEach((quality) => (quality.enabled = quality.height === newQuality.height));
        }
      });

    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player style={{ width: "90rem" }}>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
