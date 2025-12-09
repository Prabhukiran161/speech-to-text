import React, { useEffect, useRef } from 'react';

const AudioWaveform = ({ isRecording, audioData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const barCount = 40;
      const barWidth = width / barCount - 4;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight;
        
        if (isRecording && audioData && audioData.length > 0) {
          const dataIndex = Math.floor((i / barCount) * audioData.length);
          barHeight = (audioData[dataIndex] / 255) * (height * 0.8);
        } else if (isRecording) {
          barHeight = Math.random() * (height * 0.6) + 10;
        } else {
          barHeight = 4;
        }

        const x = i * (barWidth + 4);
        const gradient = ctx.createLinearGradient(x, centerY - barHeight / 2, x, centerY + barHeight / 2);
        gradient.addColorStop(0, 'hsl(160, 84%, 50%)');
        gradient.addColorStop(0.5, 'hsl(180, 84%, 55%)');
        gradient.addColorStop(1, 'hsl(200, 95%, 60%)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 2);
        ctx.fill();

        if (isRecording) {
          ctx.shadowColor = 'hsl(160, 84%, 50%)';
          ctx.shadowBlur = 10;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, audioData]);

  return (
    <div className="w-full flex items-center justify-center py-8">
      <canvas
        ref={canvasRef}
        width={600}
        height={120}
        className="w-full max-w-2xl h-24 opacity-80"
      />
    </div>
  );
};

export default AudioWaveform;
