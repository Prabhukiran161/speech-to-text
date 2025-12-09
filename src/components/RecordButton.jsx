import React from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from './ui/button';

const RecordButton = ({ isRecording, onClick, disabled }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Pulsing ring effect when recording */}
      {isRecording && (
        <>
          <span className="absolute w-24 h-24 rounded-full bg-primary/20 animate-pulse-ring" />
          <span className="absolute w-24 h-24 rounded-full bg-primary/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        </>
      )}
      
      <Button
        variant={isRecording ? "stop" : "record"}
        size="icon-xl"
        onClick={onClick}
        disabled={disabled}
        className="relative z-10"
      >
        {isRecording ? (
          <Square className="w-8 h-8 fill-current" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </Button>
    </div>
  );
};

export default RecordButton;
