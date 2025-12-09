import React from 'react';
import { Copy, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const TranscriptionDisplay = ({ transcription, isRecording, onClear }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!transcription) return;
    
    try {
      await navigator.clipboard.writeText(transcription);
      toast({
        title: "Copied!",
        description: "Transcription copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!transcription) return;

    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Transcription saved as text file",
    });
  };

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Transcription</h2>
          {isRecording && (
            <span className="flex items-center gap-2 text-sm text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
        
        {transcription && (
          <div className="flex items-center gap-2">
            <Button variant="icon" size="icon" onClick={handleCopy} title="Copy">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="icon" size="icon" onClick={handleDownload} title="Download">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="icon" size="icon" onClick={onClear} title="Clear">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Transcription content */}
      <div className="relative z-10 min-h-[200px] max-h-[400px] overflow-y-auto">
        {transcription ? (
          <p className="text-foreground/90 text-lg leading-relaxed font-mono whitespace-pre-wrap">
            {transcription}
            {isRecording && (
              <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
            )}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <p className="text-center">
              {isRecording 
                ? "Listening... Start speaking" 
                : "Press the microphone button to start transcribing"}
            </p>
          </div>
        )}
      </div>

      {/* Word count */}
      {transcription && (
        <div className="mt-4 pt-4 border-t border-border/50 relative z-10">
          <p className="text-sm text-muted-foreground">
            {transcription.split(/\s+/).filter(Boolean).length} words • {transcription.length} characters
          </p>
        </div>
      )}
    </div>
  );
};

export default TranscriptionDisplay;
