'use client';

import { useEffect, useRef, useState } from 'react';

export function VoiceOrb() {
  const [isRecording, setIsRecording] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setIsRecording(true);

      // Animate amplitude
      const updateAmplitude = () => {
        if (dataArrayRef.current && analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
          setAmplitude(Math.min(average / 255, 1));
        }
        animationIdRef.current = requestAnimationFrame(updateAmplitude);
      };

      updateAmplitude();
    } catch (error) {
      console.error('[VoxHealth] Mic access denied:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setAmplitude(0);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };

  const scale = isRecording ? 1 + amplitude * 0.15 : 1;
  const breatheScale = prefersReducedMotion.current ? 1 : 1.02;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* VoiceOrb - 160px mobile, 200px desktop */}
      <div className="relative flex items-center justify-center">
        {/* Orb outer glow - breathing animation if no recording */}
        {!isRecording && !prefersReducedMotion.current && (
          <div
            className="absolute rounded-full bg-sage opacity-20 blur-3xl"
            style={{
              width: '280px',
              height: '280px',
              animation: 'breathe 4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        )}

        {/* Waveform ring - visible when recording */}
        {isRecording && (
          <svg
            className="absolute w-40 h-40 md:w-52 md:h-52"
            viewBox="0 0 200 200"
            fill="none"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const radius = 90 + amplitude * 20;
              const x = 100 + Math.cos(angle) * radius;
              const y = 100 + Math.sin(angle) * radius;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={4 + amplitude * 4}
                  fill="currentColor"
                  className="text-sage"
                  opacity={0.6}
                />
              );
            })}
          </svg>
        )}

        {/* Main orb */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="relative z-10 w-40 h-40 md:w-52 md:h-52 rounded-full bg-sage hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg"
          style={{
            transform: `scale(${scale})`,
            transitionDuration: isRecording ? '0ms' : '200ms',
            minHeight: '240px',
            minWidth: '240px',
          }}
          aria-pressed={isRecording}
          aria-label={isRecording ? 'Stop recording' : 'Tap to speak'}
        >
          <div className="text-center">
            {isRecording ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white">Recording</span>
              </div>
            ) : (
              <svg
                className="w-12 h-12 text-white mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17.3 11.61c-.63-.59-1.55-.89-2.3-.89-.75 0-1.67.3-2.3.89.35.35.58.82.58 1.34 0 1.07-.93 1.94-2.08 1.94s-2.08-.87-2.08-1.94c0-.52.23-.99.58-1.34-.63-.59-1.55-.89-2.3-.89-.75 0-1.67.3-2.3.89C4.97 12.5 4.25 13.9 4.25 15.5 4.25 18.21 6.59 20.25 9.5 20.25s5.25-2.04 5.25-4.75c0-1.6-.72-3-1.7-4.14z" />
              </svg>
            )}
          </div>
        </button>

        {/* Tap target label */}
        {!isRecording && (
          <p className="absolute top-full mt-4 text-base font-medium text-ink">
            Tap to speak
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes breathe {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1);
            }
          }
        }
      `}</style>
    </div>
  );
}
