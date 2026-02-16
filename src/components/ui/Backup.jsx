import React from "react";
import { Zap, Shield, Globe, Clock } from "lucide-react";
import Header from "../Header";
import RecordButton from "../RecordButton";
import AudioWaveform from "../AudioWaveform";
import TranscriptionDisplay from "../TranscriptionDisplay";
import StatusIndicator from "../StatusIndicator";
import FeatureCard from "../FeatureCard";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const {
    isRecording,
    transcription,
    status,
    audioData,
    error,
    startRecording,
    stopRecording,
    clearTranscription,
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Low Latency",
      description: "Near-instantaneous transcription under 500ms delay",
    },
    {
      icon: Clock,
      title: "Real-Time",
      description: "See words appear as you speak them",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Support for multiple languages and accents",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All processing happens locally in your browser",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Federated Real-Time</span>
            <br />
            <span className="text-foreground">Speech-to-Text</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your voice into text instantly with our low-latency
            transcription system. Powered by advanced streaming ASR technology.
          </p>
          <StatusIndicator status={status} />
        </section>

        {/* Recording Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="glass-card p-8 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="relative z-10">
              {/* Waveform */}
              <AudioWaveform isRecording={isRecording} audioData={audioData} />

              {/* Record Button */}
              <div className="flex justify-center mb-8">
                <RecordButton
                  isRecording={isRecording}
                  onClick={handleRecordClick}
                  disabled={status === "connecting"}
                />
              </div>

              {/* Instructions */}
              <p className="text-center text-sm text-muted-foreground">
                {isRecording
                  ? "Speak clearly into your microphone. Click to stop."
                  : "Click the microphone to start real-time transcription"}
              </p>
            </div>
          </div>
        </section>

        {/* Transcription Display */}
        <section className="max-w-4xl mx-auto mb-16">
          <TranscriptionDisplay
            transcription={transcription}
            isRecording={isRecording}
            onClear={clearTranscription}
          />
        </section>

        {/* Features Grid */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Why Choose VoiceScribe?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>
            Batch 5 Project • Dhanekula Institute of Engineering & Technology
          </p>
          <p className="mt-1 text-xs">
            Department of Computer Science and Engineering - AI&ML
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
