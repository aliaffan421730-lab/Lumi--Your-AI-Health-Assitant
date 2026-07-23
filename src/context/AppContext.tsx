import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TabType,
  UserProfile,
  PrescriptionRecord,
  LabReportRecord,
  ReminderItem,
  ChatMessage,
  LanguageCode
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_REMINDERS,
  HEALTH_INSIGHTS
} from '../data/mockData';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  
  isAuthenticated: boolean;
  login: (email: string, pass: string, name?: string) => void;
  signup: (fullName: string, email: string, phone: string, pass: string, bloodGroup?: string) => void;
  logout: () => void;

  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  prescriptions: PrescriptionRecord[];
  addPrescription: (record: PrescriptionRecord) => void;
  
  labReports: LabReportRecord[];
  addLabReport: (report: LabReportRecord) => void;

  loadSampleData: () => void;
  
  reminders: ReminderItem[];
  toggleReminder: (id: string) => void;
  addReminder: (item: Omit<ReminderItem, 'id'>) => void;
  deleteReminder: (id: string) => void;
  
  toggleMedicineTaken: (prescriptionId: string, medicineId: string, timeOfDay: 'morning' | 'afternoon' | 'night') => void;
  
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  isEmergencyOpen: boolean;
  setIsEmergencyOpen: (open: boolean) => void;
  
  dictionaryTerm: string | null;
  setDictionaryTerm: (term: string | null) => void;
  
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  
  healthScore: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'lumi_auth_state',
  PROFILE: 'lumi_user_profile',
  PRESCRIPTIONS: 'lumi_prescriptions',
  LAB_REPORTS: 'lumi_lab_reports',
  REMINDERS: 'lumi_reminders',
  CHAT: 'lumi_chat_messages',
  LANG: 'lumi_language',
  DARK: 'lumi_dark_mode',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as LanguageCode) || 'en';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.DARK) === 'true';
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Default to empty arrays for fresh sessions, unless loaded from localStorage!
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [labReports, setLabReports] = useState<LabReportRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAB_REPORTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [dictionaryTerm, setDictionaryTerm] = useState<string | null>(null);
  
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [healthScore] = useState<number>(85);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        text: `Hello ${userProfile.fullName || 'Ali'}! I'm Lumi, your AI Health Assistant. You can upload a prescription, analyze your lab report, check drug prices in PKR, or ask any health question in simple words.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAB_REPORTS, JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync RTL attributes for Arabic / Urdu / Sindhi / Pashto / Balochi
  useEffect(() => {
    const isRtl = ['ur', 'sd', 'ps', 'bal', 'ar'].includes(language);
    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const login = (email: string, pass: string, name?: string) => {
    setIsAuthenticated(true);
    if (name) {
      setUserProfile((prev) => ({ ...prev, fullName: name, email }));
    }
    showToast(`Welcome back, ${name || userProfile.fullName}!`, 'success');
  };

  const signup = (fullName: string, email: string, phone: string, pass: string, bloodGroup = 'B+') => {
    const newProf: UserProfile = {
      ...userProfile,
      fullName,
      email,
      bloodGroup,
      emergencyContacts: [
        { id: 'c1', name: 'Family Contact', relationship: 'Emergency', phone },
      ]
    };
    setUserProfile(newProf);
    setIsAuthenticated(true);
    showToast(`Account created for ${fullName}!`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out successfully.', 'info');
  };

  const loadSampleData = () => {
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setLabReports(INITIAL_LAB_REPORTS);
    showToast('Sample prescription & lab report loaded!', 'success');
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    showToast('Profile updated successfully', 'success');
  };

  const addPrescription = (record: PrescriptionRecord) => {
    setPrescriptions((prev) => [record, ...prev]);
    showToast(`Prescription from ${record.doctorName} added!`, 'success');
  };

  const addLabReport = (report: LabReportRecord) => {
    setLabReports((prev) => [report, ...prev]);
    showToast(`Lab Report (${report.reportType}) added!`, 'success');
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const addReminder = (item: Omit<ReminderItem, 'id'>) => {
    const newRem: ReminderItem = {
      ...item,
      id: 'rem_' + Date.now(),
    };
    setReminders((prev) => [...prev, newRem]);
    showToast('New reminder created!', 'success');
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder removed', 'info');
  };

  const toggleMedicineTaken = (prescriptionId: string, medicineId: string, timeOfDay: 'morning' | 'afternoon' | 'night') => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id !== prescriptionId) return rx;
        return {
          ...rx,
          medicines: rx.medicines.map((m) => {
            if (m.id !== medicineId) return m;
            const current = m.takenToday || {};
            return {
              ...m,
              takenToday: {
                ...current,
                [timeOfDay]: !current[timeOfDay],
              },
            };
          }),
        };
      })
    );
    showToast('Medication log updated', 'success');
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: 'chat_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const clearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: 'msg_welcome_' + Date.now(),
      role: 'assistant',
      text: `Hello ${userProfile.fullName}! Chat history cleared. How can Lumi assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([welcomeMsg]);
    showToast('Chat history reset', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        isAuthenticated,
        login,
        signup,
        logout,
        userProfile,
        updateUserProfile,
        prescriptions,
        addPrescription,
        labReports,
        addLabReport,
        loadSampleData,
        reminders,
        toggleReminder,
        addReminder,
        deleteReminder,
        toggleMedicineTaken,
        chatMessages,
        addChatMessage,
        clearChat,
        searchQuery,
        setSearchQuery,
        isEmergencyOpen,
        setIsEmergencyOpen,
        dictionaryTerm,
        setDictionaryTerm,
        toasts,
        showToast,
        healthScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
