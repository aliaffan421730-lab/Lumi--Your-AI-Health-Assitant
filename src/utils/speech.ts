// Web Speech API Voice synthesis and Speech Recognition helper

export const speakText = (text: string, langCode: string = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop ongoing speech

  // Strip disclaimer or formatting for speech if needed, or speak clean text
  const cleanText = text.replace(/[*#_]/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Set voice language
  const langMap: Record<string, string> = {
    en: 'en-US',
    ur: 'ur-PK',
    hi: 'hi-IN',
    pa: 'pa-IN',
    sd: 'sd-PK',
    ps: 'ps-AF',
    bal: 'fa-IR',
    ar: 'ar-SA',
  };

  utterance.lang = langMap[langCode] || 'en-US';
  utterance.rate = 0.95; // Slightly calmer speaking rate
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export function startSpeechRecognition(
  onResult: (text: string) => void,
  onError: (err: any) => void,
  langCode: string = 'en'
) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  const langMap: Record<string, string> = {
    en: 'en-US',
    ur: 'ur-PK',
    hi: 'hi-IN',
    pa: 'pa-IN',
    sd: 'sd-PK',
    ps: 'ps-AF',
    bal: 'fa-IR',
    ar: 'ar-SA',
  };

  recognition.lang = langMap[langCode] || 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.start();
  return recognition;
}
