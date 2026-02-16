import { useState, useRef, useCallback, useEffect } from "react";

const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [status, setStatus] = useState("idle");
  const [audioData, setAudioData] = useState(null); // For visualization
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Audio visualization refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // 1. Setup Audio Visualization (Same as before, visual only)
  const startAudioVisualization = useCallback((stream) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualization = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioData([...dataArray]);
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      };

      updateVisualization();
    } catch (err) {
      console.error("Visualization error:", err);
    }
  }, []);

  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioData(null);
  }, []);

  // 2. Start Recording & WebSocket Connection
  const startRecording = useCallback(async () => {
    setError(null);
    setTranscription(""); // Optional: Clear previous text on new start
    setStatus("connecting");

    try {
      // A. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Start visualization
      startAudioVisualization(stream);

      // B. Open WebSocket to your Backend
      const ws = new WebSocket("ws://localhost:8000/ws/asr");
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to backend");
        setStatus("recording");
        setIsRecording(true);

        // Send start event config
        ws.send(JSON.stringify({ event: "start", sample_rate: 16000 }));

        // C. Start MediaRecorder (sends chunks to WS)
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            // Send binary audio chunk directly
            ws.send(event.data);
          }
        };

        // Send chunks every 250ms (adjust for latency vs overhead)
        mediaRecorder.start(250);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "partial") {
            // Update partial text logic if needed (or just overwrite)
            // Here we assume backend sends full cumulative text or just the new part.
            // Based on your backend logic: "final_text + partial_text"
            setTranscription(data.text);
          } else if (data.type === "final") {
            setTranscription(data.text);
            ws.close();
          } else if (data.type === "error") {
            setError(data.error);
            setStatus("error");
          }
        } catch (e) {
          console.error("Error parsing WS message", e);
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        setError("WebSocket connection failed");
        setStatus("error");
        stopRecording(); // Cleanup
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setStatus("idle");
      };
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Unable to access microphone. Please check permissions.");
      setStatus("error");
    }
  }, [status, startAudioVisualization]); // Added dependencies to avoid stale closures if needed, though mostly using refs

  // 3. Stop Recording
  const stopRecording = useCallback(() => {
    // Stop Media Recorder
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Stop Stream (Microphone)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Stop Visualization
    stopAudioVisualization();

    // Close WebSocket
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ event: "end" }));
      }
      socketRef.current = null;
    }

    setIsRecording(false);
    setStatus("idle");
  }, [stopAudioVisualization]);

  const clearTranscription = useCallback(() => {
    setTranscription("");
    setStatus("idle");
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return {
    isRecording,
    transcription,
    status,
    audioData,
    error,
    startRecording,
    stopRecording,
    clearTranscription,
  };
};

export default useSpeechRecognition;
