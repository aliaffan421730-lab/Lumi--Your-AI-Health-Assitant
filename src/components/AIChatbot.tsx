import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Loader2,
  ShieldAlert,
  Bot,
  User,
  Paperclip
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakText, stopSpeech, startSpeechRecognition } from '../utils/speech';

export const AIChatbot: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    clearChat,
    userProfile,
    language,
    showToast
  } = useApp();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const promptChips = [
    'Can I take metformin with milk?',
    'What if I miss a dose of Amlodipine?',
    'Can I drive while taking my medicines?',
    'What foods help improve low hemoglobin?',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() && !selectedImage) return;

    const userText = textToSend.trim();
    const imageToSend = selectedImage;

    addChatMessage({
      role: 'user',
      text: userText || 'Uploaded document for analysis',
      imageUrl: imageToSend || undefined,
    });

    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages,
          userProfile,
          language,
          imageBase64: imageToSend,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.reply) {
        addChatMessage({
          role: 'assistant',
          text: resData.reply,
        });

        // Auto read out loud if voice mode preferred
        speakText(resData.reply, language);
        setIsSpeaking(true);
      } else {
        throw new Error(resData.error);
      }
    } catch (err) {
      showToast('Error communicating with Lumi AI', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      startSpeechRecognition(
        (transcript) => {
          setInput(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        (err) => {
          showToast('Voice input error: ' + err, 'warning');
          setIsListening(false);
        },
        language
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      speakText(text, language);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-display">
              Ask Lumi - AI Health Assistant
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask about prescriptions, side effects, food timing, or lab reports in plain words.
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 custom-scrollbar">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'bg-gradient-to-br from-slate-100 to-blue-50 text-blue-700 dark:from-slate-800 dark:to-blue-950 dark:text-blue-300 ring-1 ring-blue-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-3xl p-4 text-xs space-y-2 leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Attached"
                    className="max-h-48 rounded-2xl object-cover mb-2 border border-white/20"
                  />
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div
                  className={`flex items-center justify-between pt-2 text-[10px] ${
                    isUser ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleTextToSpeech(msg.text)}
                      className="p-1 hover:text-blue-600 transition-colors"
                      title="Read out loud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Lumi is analyzing your query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-bold whitespace-nowrap transition-all border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-300"
          >
            ✨ {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-lg space-y-2">
        {selectedImage && (
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xs text-slate-500 flex-1 truncate">Image attached</span>
            <button onClick={() => setSelectedImage(null)} className="text-red-500 p-1">
              &times;
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File attachment */}
          <label className="p-2.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <Paperclip className="w-5 h-5" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          {/* Voice Microphone */}
          <button
            onClick={handleMicToggle}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Voice Assistant Mode"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Lumi anything about your health or medications..."
            className="flex-1 text-xs bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none px-2"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-2xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
