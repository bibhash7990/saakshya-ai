import React, { useEffect, useState } from 'react';
import { useMediaCapture } from '@/hooks/useMediaCapture';
import { Button } from '../ui/Button';
import { Mic, Square, Play, Trash2, X, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface AudioRecorderProps {
  onRecordComplete: (file: File) => void;
  onClose: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordComplete, onClose }) => {
  const { recording, audioUrl, audioBlob, startRecordingAudio, stopRecordingAudio, clearAudio } =
    useMediaCapture();
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const toast = useToast();

  // Track recording timer
  useEffect(() => {
    let interval: any;
    if (recording) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handleStart = async () => {
    try {
      clearAudio();
      await startRecordingAudio();
    } catch (err) {
      toast.danger('Microphone access failed. Please verify permissions.');
      onClose();
    }
  };

  const handleStop = () => {
    stopRecordingAudio();
  };

  const handleSave = () => {
    if (audioBlob) {
      const file = new File([audioBlob], `AudioEvidence_${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      onRecordComplete(file);
    }
  };

  const handlePlayPreview = () => {
    if (audioUrl) {
      if (isPlaying && audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        const audio = new Audio(audioUrl);
        setAudioElement(audio);
        audio.play();
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-bg-secondary p-4 rounded-xl border border-border">
      <div className="flex justify-between items-center w-full pb-2 border-b border-border">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5 select-none">
          <Mic className="w-4 h-4 text-primary-400" />
          <span>Secure Voice Recorder</span>
        </h3>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-bg-primary/50 border border-border/50 rounded-lg w-full gap-4 text-center">
        {recording ? (
          <div className="flex flex-col items-center gap-2">
            <span className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger animate-pulse border border-danger/20">
              <Mic className="w-6 h-6" />
            </span>
            <span className="text-xl font-bold font-mono text-text-primary">
              {formatTime(timer)}
            </span>
            <span className="text-[10px] text-text-secondary select-none font-bold uppercase tracking-wider animate-pulse">
              Recording live feed...
            </span>
          </div>
        ) : audioUrl ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-success uppercase tracking-wider bg-success/10 px-2 py-0.5 border border-success/20 rounded-full">
              Voice note captured
            </span>
            <Button
              variant="secondary"
              onClick={handlePlayPreview}
              leftIcon={<Play className="w-4 h-4" />}
            >
              {isPlaying ? 'Pause Preview' : 'Play Preview'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary border border-border">
              <Mic className="w-5 h-5" />
            </span>
            <p className="text-xs text-text-secondary">Capture oral agreements, meetings or statements safely.</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!recording && !audioUrl && (
          <Button variant="primary" onClick={handleStart} leftIcon={<Mic className="w-4 h-4" />}>
            Start Recording
          </Button>
        )}

        {recording && (
          <Button variant="danger" onClick={handleStop} leftIcon={<Square className="w-4 h-4" />}>
            Stop Recording
          </Button>
        )}

        {audioUrl && !recording && (
          <>
            <Button variant="ghost" onClick={clearAudio} className="text-danger hover:bg-danger/5" leftIcon={<Trash2 className="w-4 h-4" />}>
              Discard
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
export default AudioRecorder;
