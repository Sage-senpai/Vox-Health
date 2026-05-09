'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { MedicalEntry, RecordingContextType } from '@/types';

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined
);

export function RecordingProvider({ children }: { children: React.ReactNode }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [entries, setEntries] = useState<MedicalEntry[]>([]);

  const startRecording = useCallback(async () => {
    setIsRecording(true);
    setAudioBlob(null);
    setTranscript('');
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
  }, []);

  const saveEntry = useCallback(
    async (entry: Partial<MedicalEntry>) => {
      // Placeholder: In real app, save to database
      console.log('[VoxHealth] Recording: saving entry', entry);
      const newEntry: MedicalEntry = {
        id: 'entry-' + Date.now(),
        userId: 'user-1',
        type: 'symptom',
        title: entry.title || 'Health Entry',
        description: entry.description || '',
        severity: entry.severity || 5,
        symptoms: entry.symptoms || [],
        timestamp: new Date(),
        tags: entry.tags || [],
        audioUrl: entry.audioUrl,
        transcript: entry.transcript,
      };
      setEntries((prev) => [newEntry, ...prev]);
      setIsRecording(false);
      setAudioBlob(null);
      setTranscript('');
    },
    []
  );

  const value: RecordingContextType = {
    isRecording,
    audioBlob,
    transcript,
    duration: 0,
    startRecording,
    stopRecording,
    saveEntry,
  };

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecording() {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error('useRecording must be used within RecordingProvider');
  }
  return context;
}
