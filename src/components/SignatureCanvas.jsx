import React, { useRef, useState, useEffect } from 'react';
import { Eraser } from 'lucide-react';

const SignatureCanvas = ({ onUpdate, photo }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.strokeStyle = '#000000';
      context.lineWidth = 3;
      context.lineCap = 'round';
      setCtx(context);
    }
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Support both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (isDrawing) {
      ctx.closePath();
      setIsDrawing(false);
      // Callback with canvas element for merging
      onUpdate(canvasRef.current);
    }
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onUpdate(null);
  };

  return (
    <div className="relative group">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={clear}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-500 transition-colors shadow-sm"
          title="Clear Signature"
        >
          <Eraser size={20} />
        </button>
      </div>

      <div className="relative border-4 border-dashed border-gray-300 rounded-2xl overflow-hidden bg-gray-50 aspect-video">
        {photo && (
          <img 
            src={photo} 
            alt="Captured" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        {!isDrawing && (!canvasRef.current || canvasRef.current.toDataURL().length < 100) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400 font-medium">Draw your signature here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureCanvas;
