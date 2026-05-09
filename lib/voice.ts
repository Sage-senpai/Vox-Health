/**
 * ElevenLabs Voice API Integration Stubs
 * These are placeholder functions for voice recording, transcription, and TTS.
 * In production, these would integrate with the ElevenLabs API.
 */

export interface VoiceResponse {
  transcript?: string;
  audioUrl?: string;
  duration: number;
  success: boolean;
  timestamp: Date;
}

/**
 * Record audio using browser MediaRecorder
 */
export async function recordAudio(): Promise<VoiceResponse> {
  console.log('[VoxHealth] Voice: recording audio...');
  // Placeholder - actual recording handled by useVoiceRecorder hook
  return {
    duration: 0,
    success: true,
    timestamp: new Date(),
  };
}

/**
 * Transcribe audio blob using ElevenLabs
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log('[VoxHealth] Voice: transcribing audio, size:', audioBlob.size);
  // Placeholder: In production, would call ElevenLabs API
  // const formData = new FormData();
  // formData.append('audio', audioBlob);
  // const response = await fetch('https://api.elevenlabs.io/v1/transcribe', {
  //   method: 'POST',
  //   headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
  //   body: formData,
  // });
  // const data = await response.json();
  // return data.transcript;

  return `[Transcribed Audio: ${Math.floor(audioBlob.size / 1024)}KB]`;
}

/**
 * Generate voice response from text using ElevenLabs TTS
 */
export async function generateVoiceResponse(text: string): Promise<string> {
  console.log('[VoxHealth] Voice: generating voice response for text:', text);
  // Placeholder: In production, would call ElevenLabs TTS API
  // const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/..', {
  //   method: 'POST',
  //   headers: {
  //     'xi-api-key': process.env.ELEVENLABS_API_KEY,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ text }),
  // });
  // return response.url;

  return 'placeholder-audio-' + Date.now() + '.mp3';
}

/**
 * Analyze symptom text for keywords
 */
export function analyzeSymptomKeywords(transcript: string): string[] {
  const symptoms = [
    'pain',
    'fatigue',
    'headache',
    'fever',
    'nausea',
    'dizziness',
    'weakness',
    'anxiety',
  ];
  const words = transcript.toLowerCase().split(' ');
  return symptoms.filter((symptom) =>
    words.some((word) => word.includes(symptom))
  );
}

/**
 * Generate follow-up questions based on symptoms
 */
export function generateFollowUpQuestions(symptoms: string[]): string[] {
  const questionMap: Record<string, string> = {
    pain: 'On a scale of 1-10, how severe is your pain?',
    fatigue: 'When did this fatigue start?',
    headache: 'Have you taken any pain relievers?',
    fever: 'What is your body temperature?',
    nausea: 'Have you eaten anything today?',
    dizziness: 'Are you sitting or standing?',
    anxiety: 'What triggered this feeling?',
  };

  return symptoms
    .filter((symptom) => questionMap[symptom])
    .map((symptom) => questionMap[symptom])
    .slice(0, 3); // Return max 3 questions
}

/**
 * Calculate symptom severity based on keywords
 */
export function calculateSymptomSeverity(transcript: string): number {
  const severeWords = ['severe', 'worst', 'unbearable', 'critical', 'extreme'];
  const moderateWords = ['moderate', 'uncomfortable', 'painful', 'concerning'];

  const lowerTranscript = transcript.toLowerCase();

  if (severeWords.some((word) => lowerTranscript.includes(word))) {
    return Math.min(10, 8 + Math.random() * 2);
  }
  if (moderateWords.some((word) => lowerTranscript.includes(word))) {
    return Math.min(7, 5 + Math.random() * 2);
  }

  return Math.max(1, Math.random() * 5);
}
