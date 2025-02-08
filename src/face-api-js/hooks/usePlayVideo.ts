import * as faceApi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';

const videoWidth = 640;
const videoHeight = 480;

export function usePlayVideo({ modelsLoaded }: { modelsLoaded: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const startVideo = async () => {
      if (videoRef.current && modelsLoaded) {
        try {
          videoRef.current.srcObject =
            await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: { width: videoWidth, height: videoHeight },
            });
          setVideoPlaying(true);
        } catch (err) {
          console.error('Error accessing webcam:', err);
        }
      }
    };

    startVideo();
  }, [modelsLoaded]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const detectFaces = async function () {
      if (
        !videoRef.current ||
        videoRef.current.srcObject === null ||
        !canvasRef.current
      )
        return;

      const displaySize = { width: videoWidth, height: videoHeight };
      faceApi.matchDimensions(canvasRef.current, displaySize);

      intervalId = setInterval(async () => {
        let detections;
        if (videoRef.current) {
          try {
            detections = await faceApi
              .detectAllFaces(
                videoRef.current,
                new faceApi.TinyFaceDetectorOptions()
              )
              .withFaceLandmarks()
              .withFaceExpressions()
              .withAgeAndGender();
          } catch (err) {
            console.error('Error during face detection:', err);
            return;
          }
        }

        const resizedDetections = faceApi.resizeResults(
          detections,
          displaySize
        );

        if (canvasRef.current) {
          // Clear the canvas
          canvasRef.current
            .getContext('2d')
            .clearRect(0, 0, videoWidth, videoHeight);

          // Draw the detections
          faceApi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceApi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceApi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections
          );

          // Draw age and gender
          resizedDetections.forEach((detection) => {
            const box = detection.detection.box;
            const drawBox = new faceApi.draw.DrawBox(box, {
              label: `Age: ${Math.round(detection.age)} | Gender: ${detection.gender}`,
            });
            drawBox.draw(canvasRef.current);
          });
        }
      }, 1000);
    };

    detectFaces();

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [videoPlaying]);

  return [videoRef, canvasRef, videoHeight, videoWidth] as const;
}
