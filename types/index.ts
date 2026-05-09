// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  medicalConditions: string[];
  emergencyContact: string;
  emergencyPhone: string;
  primaryDoctor: string;
  insuranceProvider?: string;
  createdAt: Date;
}

// Medical Entry (Symptom/Health Record)
export interface MedicalEntry {
  id: string;
  userId: string;
  type: 'symptom' | 'medication' | 'note' | 'vital';
  title: string;
  description: string;
  audioUrl?: string;
  transcript?: string;
  severity?: number; // 1-10
  symptoms: string[];
  timestamp: Date;
  tags: string[];
  attachments?: string[];
}

// Medication
export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: Date;
  notes?: string;
  reminders: boolean;
  adherenceRate?: number;
  isActive: boolean;
}

// Doctor Access
export interface DoctorAccess {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  accessLevel: 'view' | 'comment' | 'full';
  grantedDate: Date;
  expiryDate: Date;
  accessToken: string;
  notes?: string;
}

// Timeline Entry Display
export interface TimelineEntry extends MedicalEntry {
  formattedDate: string;
  daysAgo: string;
  severityLabel?: string;
}

// Authentication State
export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// Wallet State
export interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// Recording State
export interface RecordingContextType {
  isRecording: boolean;
  audioBlob: Blob | null;
  transcript: string;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  saveEntry: (entry: Partial<MedicalEntry>) => Promise<void>;
}
