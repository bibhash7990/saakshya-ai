import React, { useEffect, useRef, useState } from 'react';
import { useMediaCapture } from '@/hooks/useMediaCapture';
import { Button } from '../ui/Button';
import { Camera, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const { stream, startCamera, stopStream } = useMediaCapture();
  const [photoCaptured, setPhotoCaptured] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  useEffect(() => {
    const initCamera = async () => {
      setLoading(true);
      try {
        const activeStream = await startCamera();
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        toast.danger('Could not access camera. Please check permissions.');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    initCamera();

    return () => {
      stopStream();
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size matching video viewport
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add a visible system timestamp metadata overlay on the image itself!
        // This is a common legal evidence practice to prove capture context.
        context.fillStyle = 'rgba(15, 23, 42, 0.75)';
        context.fillRect(10, canvas.height - 40, canvas.width - 20, 30);
        context.fillStyle = '#f1f5f9';
        context.font = '12px Courier New, monospace';
        const timestampText = `SAAKSHYA-AI VERIFIED | TIME: ${new Date().toUTCString()} | OS: LOCAL`;
        context.fillText(timestampText, 20, canvas.height - 20);

        // Export as JPEG blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setPhotoCaptured(url);
              setCapturedBlob(blob);
            }
          },
          'image/jpeg',
          0.9
        );
      }
    }
  };

  const handleSave = () => {
    if (capturedBlob) {
      const file = new File([capturedBlob], `CameraCapture_${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      onCapture(file);
    }
  };

  const handleRetake = () => {
    setPhotoCaptured(null);
    setCapturedBlob(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-bg-secondary p-4 rounded-xl border border-border">
      <div className="flex justify-between items-center w-full pb-2 border-b border-border">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5 select-none">
          <Camera className="w-4 h-4 text-primary-400" />
          <span>Secure Camera Capture</span>
        </h3>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-border/50 flex items-center justify-center">
        {loading && <span className="text-xs text-text-secondary">Connecting feed...</span>}

        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${photoCaptured ? 'hidden' : 'block'}`}
        />

        {/* Preview captured photo */}
        {photoCaptured && (
          <img src={photoCaptured} alt="Captured preview" className="w-full h-full object-cover" />
        )}

        {/* Canvas for snapshot drawing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex items-center gap-3">
        {!photoCaptured ? (
          <Button variant="primary" onClick={handleCapture} leftIcon={<Camera className="w-4 h-4" />}>
            Capture Photo
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleRetake} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Retake
            </Button>
            <Button variant="success" onClick={handleSave} leftIcon={<ShieldCheck className="w-4 h-4" />}>
              Lock & Upload
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
export default CameraCapture;
