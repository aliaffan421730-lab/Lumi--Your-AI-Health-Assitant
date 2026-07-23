export type LanguageCode = 'en' | 'ur' | 'hi' | 'pa' | 'sd' | 'ps' | 'bal' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  isRtl?: boolean;
}

export type TabType = 
  | 'home'
  | 'prescriptions'
  | 'lab-reports'
  | 'medicines'
  | 'interactions'
  | 'alternatives'
  | 'health-wallet'
  | 'reminders'
  | 'ask-lumi'
  | 'profile'
  | 'settings'
  | 'dictionary'
  | 'emergency'
  | 'landing';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string;
  age: number;
  gender: string;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicineSchedule {
  morning: boolean;
  afternoon: boolean;
  night: boolean;
}

export interface MedicineWarnings {
  food?: string;
  alcohol?: string;
  pregnancy?: string;
  driving?: string;
  storage?: string;
}

export interface GenericAlternative {
  name: string;
  price: string;
  savings: string;
  manufacturer?: string;
  similarityScore?: string;
}

export interface PrescriptionMedicine {
  id: string;
  brandName: string;
  genericName: string;
  medicineType: string;
  purpose: string;
  dosage: string;
  schedule: MedicineSchedule;
  foodTiming: 'before_food' | 'after_food' | 'with_food' | 'anytime';
  durationDays: number;
  instructions: string;
  commonSideEffects: string[];
  seriousSideEffects?: string[];
  warnings: MedicineWarnings;
  estimatedPrice: string;
  genericAlternatives: GenericAlternative[];
  takenToday?: {
    morning?: boolean;
    afternoon?: boolean;
    night?: boolean;
  };
}

export interface PrescriptionRecord {
  id: string;
  date: string;
  doctorName: string;
  hospital: string;
  patientName: string;
  ocrConfidence: number;
  imageUrl?: string;
  status: 'Analyzed' | 'Processing' | 'Pending';
  medicines: PrescriptionMedicine[];
  generalAdvice?: string;
}

export interface LabParameter {
  id: string;
  parameterName: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high';
  aiExplanation: string;
  causes?: string[];
  recommendations?: string[];
}

export interface LabReportRecord {
  id: string;
  reportType: string;
  labName: string;
  date: string;
  patientName: string;
  status: 'Analyzed' | 'Processing';
  imageUrl?: string;
  parameters: LabParameter[];
  summary: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string; // e.g. "8:00 AM" or "5:00 PM"
  repeat: 'daily' | 'hourly' | 'weekly' | 'custom';
  type: 'medicine' | 'appointment' | 'water' | 'lab';
  subtext?: string;
  isActive: boolean;
  dosageInfo?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface HealthInsight {
  id: string;
  type: 'warning' | 'success' | 'info';
  icon: string; // 'sparkles' | 'droplet' | 'sun'
  color: string;
  title: string;
  actionText?: string;
}

export interface MedicalTermDefinition {
  term: string;
  definition: string;
  category: string;
  simpleExample: string;
}
