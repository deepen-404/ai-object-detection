'use client';

import { useLoadModels } from '../hooks/useLoadModels';
import { usePlayVideo } from '../hooks/usePlayVideo';

function WebCamVideo() {
  const modelsLoaded = useLoadModels();

  const [videoRef, canvasRef, videoHeight, videoWidth] = usePlayVideo({
    modelsLoaded,
  });

  return (
<div style={{ minHeight: '100vh', maxHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
  <video
    ref={videoRef}
    width={videoWidth}
    height={videoHeight || undefined}
    playsInline
    autoPlay
  />
  <canvas
    ref={canvasRef}
    width={videoWidth}
    height={videoHeight || undefined}
    style={{ border: '1px solid red' }}
  />
</div>

  );
}

export default WebCamVideo;
