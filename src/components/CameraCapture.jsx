import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false 
      });
      setStream(mediaStream);
      setIsStreaming(true); // Set this first to ensure video element renders
      setError(null);
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      console.error(err);
    }
  };

  // Effect to attach stream once video element is rendered
  React.useEffect(() => {
    if (isStreaming && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isStreaming, stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg');
      onCapture(photoData);
      stopCamera();
    }
  };


  // Cleanup handled by manual stop button
  // stream should ideally be cleaned up on unmount too

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border-4 border-white">
        {!isStreaming ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-4">
            <Camera size={48} />
            <button 
              onClick={startCamera}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Enable Camera
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <button 
                onClick={capturePhoto}
                className="bg-white p-4 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition-all text-blue-600"
              >
                <Check size={32} />
              </button>
              <button 
                onClick={stopCamera}
                className="bg-red-500 p-4 rounded-full shadow-xl hover:bg-red-600 active:scale-95 transition-all text-white"
              >
                <RefreshCw size={24} />
              </button>
            </div>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500">Ensure your face is clearly visible for the audit photo</p>
    </div>
  );
};

export default CameraCapture;
