import { useState, useRef, useCallback } from 'react';

export const useMediaCapture = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.error('Camera access failed:', error);
      throw error;
    }
  }, []);

  // Stop Camera/Audio Stream
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start Audio Recording
  const startRecordingAudio = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Audio access failed:', error);
      throw error;
    }
  }, []);

  // Stop Audio Recording
  const stopRecordingAudio = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    stopStream();
  }, [recording, stopStream]);

  return {
    stream,
    recording,
    audioUrl,
    audioBlob,
    startCamera,
    stopStream,
    startRecordingAudio,
    stopRecordingAudio,
    clearAudio: () => {
      setAudioUrl(null);
      setAudioBlob(null);
    },
  };
};
export default useMediaCapture;
