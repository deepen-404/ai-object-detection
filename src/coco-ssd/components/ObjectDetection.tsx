import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad, ObjectDetection as CocoModel, DetectedObject } from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { renderPredictions } from "../../utils/render-predictions";

let detectInterval: NodeJS.Timeout | undefined;

const ObjectDetection: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function runObjectDetection(net: CocoModel): Promise<void> {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      const detectedObjects: DetectedObject[] = await net.detect(
        video,
        undefined,
        0.6
      );

      const uniqueItems = Array.from(new Set(detectedObjects.map(obj => obj.class)));
      setDetectedItems(uniqueItems);

      const context = canvasRef.current.getContext("2d");
      if (context) {
        renderPredictions(detectedObjects, context);
      }
    }
  }

  const showmyVideo = (): void => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;
      video.width = video.videoWidth;
      video.height = video.videoHeight;
    }
  };

  useEffect(() => {
    async function runCoco(): Promise<void> {
      setIsLoading(true);
      const net = await cocoSSDLoad();
      setIsLoading(false);
  
      detectInterval = setInterval(() => {
        runObjectDetection(net);
      }, 10);
    }

    runCoco();
    showmyVideo();
    
    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    marginTop: '2rem'
  };

  const contentContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };


  const webcamStyle: React.CSSProperties = {
    width: '100%',
    height: '30rem',
    borderRadius: '0.375rem'
  };


  const webcamContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.375rem',
    borderRadius: '0.375rem',
    height: '30rem',
    width: "100%",
  };
  
  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    height: '30rem',
    zIndex: 99999
  };

  const detectedObjectsContainerStyle: React.CSSProperties = {
    backgroundColor: '#1f2937',
    padding: '1rem',
    borderRadius: '0.375rem'
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'white'
  };

  const tagsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  };

  const tagStyle: React.CSSProperties = {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '9999px',
    fontSize: '0.875rem'
  };

  const noObjectsStyle: React.CSSProperties = {
    color: '#9ca3af'
  };

  return (
    <div style={containerStyle}>
      {isLoading ? (
        <div>Loading AI Model...</div>
      ) : (
        <div style={contentContainerStyle}>
          <div style={webcamContainerStyle}>
            <Webcam
              ref={webcamRef}
              style={webcamStyle}
              muted
            />
            <canvas
              ref={canvasRef}
              style={canvasStyle}
            />
          </div>
          
          <div style={detectedObjectsContainerStyle}>
            <h2 style={headingStyle}>Detected Objects</h2>
            {detectedItems.length > 0 ? (
              <div style={tagsContainerStyle}>
                {detectedItems.map((item, index) => (
                  <span 
                    key={index}
                    style={tagStyle}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p style={noObjectsStyle}>No objects detected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;