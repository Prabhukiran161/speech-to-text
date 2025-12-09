import React from 'react';
import { Mic, MicOff, Loader2, CheckCircle2 } from 'lucide-react';

const StatusIndicator = ({ status }) => {
  const statusConfig = {
    idle: {
      icon: MicOff,
      text: 'Ready to record',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
    },
    recording: {
      icon: Mic,
      text: 'Recording...',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    processing: {
      icon: Loader2,
      text: 'Processing...',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    complete: {
      icon: CheckCircle2,
      text: 'Transcription complete',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    error: {
      icon: MicOff,
      text: 'Error occurred',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  };

  const config = statusConfig[status] || statusConfig.idle;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor}`}>
      <Icon 
        className={`w-4 h-4 ${config.color} ${status === 'processing' ? 'animate-spin' : ''}`} 
      />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

export default StatusIndicator;
