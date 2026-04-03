import { Image as ImageIcon, Send, Settings, X, Timer, Zap, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { AppMode, PROVIDERS } from '../types';

interface ChatInputProps {
  onSend: (text: string) => void;
  isStarted: boolean;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
  strategyModel: string;
  setStrategyModel: (modelId: string) => void;
  onModelChange: (idx: number, modelId: string) => void;
  instruction: string;
  mode: AppMode;
  roundTableLimit: {
    type: 'time' | 'tokens' | 'rounds';
    indices: { time: number; tokens: number; rounds: number };
  };
  setRoundTableLimit: React.Dispatch<React.SetStateAction<{
    type: 'time' | 'tokens' | 'rounds';
    indices: { time: number; tokens: number; rounds: number };
  }>>;
  setActivePopup: (type: 'time' | 'tokens' | 'rounds' | null) => void;
}

const LIMIT_OPTIONS = {
  time: ['30 sec', '1 min', '1.5 min', '2 min', '3 min'],
  tokens: ['10K', '15K', '20K', '30K', '50K'],
  rounds: ['7', '10', '15', '20', '25']
};

export const ChatInput = ({ 
  onSend, 
  isStarted, 
  selectedModels, 
  setSelectedModels, 
  strategyModel,
  setStrategyModel,
  onModelChange,
  instruction, 
  mode,
  roundTableLimit,
  setRoundTableLimit,
  setActivePopup
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  const playTuckSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        width: isStarted ? "100%" : "80%",
        maxWidth: isStarted ? "900px" : "800px",
      }}
      className={`mx-auto transition-all duration-500 ease-in-out ${isStarted ? "pb-8" : ""}`}
    >
      <div className="relative group">
        {/* Blinking Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
        
        <div className="relative bg-[#1a1b1e] border border-white/10 rounded-[32px] p-4 shadow-2xl">
          <div className="flex flex-col space-y-4">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'comparison' ? "Ask all three models..." : mode === 'roundtable' ? "Start a debate topic..." : "Ask anything..."}
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-2 text-xl resize-none max-h-60 overflow-y-auto scrollbar-hide"
            />
            
            <div className="h-px bg-white/5 w-full"></div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 py-1">
                {mode === 'roundtable' && !isStarted ? (
                  <div className="relative shrink-0 z-[60]" ref={settingsRef}>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      }}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all relative z-[70] whitespace-nowrap ${
                        showSettings 
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <motion.div
                        animate={{ rotate: showSettings ? 90 : 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <Settings size={14} />
                      </motion.div>
                      <div className="flex items-center space-x-1.5">
                        {roundTableLimit.type === 'time' && <Timer size={10} />}
                        {roundTableLimit.type === 'tokens' && <Zap size={10} />}
                        {roundTableLimit.type === 'rounds' && <Hash size={10} />}
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {LIMIT_OPTIONS[roundTableLimit.type][roundTableLimit.indices[roundTableLimit.type]]} {roundTableLimit.type}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {showSettings && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: -5, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-3 w-64 bg-[#1a1b1e] border border-white/10 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60]"
                        >
                          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 px-2">Set debate limit by</h4>
                          <div className="space-y-1">
                            {(['time', 'tokens', 'rounds'] as const).map(t => (
                              <button 
                                key={t}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRoundTableLimit(prev => ({ ...prev, type: t }));
                                  setActivePopup(t);
                                  setShowSettings(false);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm group ${
                                  roundTableLimit.type === t ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {t === 'time' && <Timer size={16} className={roundTableLimit.type === t ? 'text-blue-400' : 'text-gray-500'} />}
                                  {t === 'tokens' && <Zap size={16} className={roundTableLimit.type === t ? 'text-amber-400' : 'text-gray-500'} />}
                                  {t === 'rounds' && <Hash size={16} className={roundTableLimit.type === t ? 'text-purple-400' : 'text-gray-500'} />}
                                  <span className="capitalize font-medium group-hover:text-white">{t}</span>
                                </div>
                                <span className={`text-[10px] font-bold ${roundTableLimit.type === t ? 'text-white' : 'text-gray-600'}`}>
                                  {LIMIT_OPTIONS[t][roundTableLimit.indices[t]]}
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button type="button" className="p-2 text-blue-400 hover:bg-white/5 rounded-xl transition-colors shrink-0">
                    <ImageIcon size={22} />
                  </button>
                )}

                {mode === 'strategy' ? (
                  <div className="relative flex items-center shrink-0">
                    {(() => {
                      const selectedModel = PROVIDERS.flatMap(p => p.models).find(m => m.id === strategyModel) || PROVIDERS[1].models[0];
                      const provider = PROVIDERS.find(p => p.models.some(m => m.id === strategyModel)) || PROVIDERS[1];
                      const colorBase = provider.color.split('-')[1] || 'blue';
                      const borderColors: Record<string, string> = {
                        emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
                        blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
                        amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                      };
                      
                      return (
                        <>
                          <div className="invisible px-3 py-1.5 pr-8 text-[11px] font-bold whitespace-nowrap">
                            {selectedModel.name}
                          </div>
                          <select 
                            value={strategyModel}
                            onChange={(e) => setStrategyModel(e.target.value)}
                            className={`absolute inset-0 appearance-none border rounded-full px-3 py-1.5 pr-8 text-[11px] font-bold focus:ring-0 cursor-pointer transition-all w-full ${borderColors[colorBase]}`}
                          >
                            {PROVIDERS.flatMap(p => p.models).map(m => (
                              <option key={m.id} value={m.id} className="bg-[#1a1b1e]">{m.name}</option>
                            ))}
                          </select>
                          <div className={`absolute right-2.5 pointer-events-none ${borderColors[colorBase].split(' ')[1]}`}>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  PROVIDERS.map((provider, idx) => {
                    const colorBase = provider.color.split('-')[1];
                    const borderColors: Record<string, string> = {
                      emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
                      blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
                      amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                    };

                    const currentModelId = selectedModels[idx] || provider.models[0].id;
                    const currentModel = provider.models.find(m => m.id === currentModelId) || provider.models[0];

                    return (
                      <div key={provider.id} className="relative flex items-center shrink-0">
                        <div className="invisible px-3 py-1.5 pr-8 text-[11px] font-bold whitespace-nowrap">
                          {currentModel.name}
                        </div>
                        <select 
                          value={currentModelId}
                          onChange={(e) => onModelChange(idx, e.target.value)}
                          className={`absolute inset-0 appearance-none border rounded-full px-3 py-1.5 pr-8 text-[11px] font-bold focus:ring-0 cursor-pointer transition-all w-full ${borderColors[colorBase]}`}
                        >
                          {provider.models.map(m => (
                            <option key={m.id} value={m.id} className="bg-[#1a1b1e]">{m.name}</option>
                          ))}
                        </select>
                        <div className={`absolute right-2.5 pointer-events-none ${borderColors[colorBase].split(' ')[1]}`}>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <AnimatePresence>
                {input.trim() && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleSubmit()}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all shadow-lg"
                  >
                    <Send size={18} fill="currentColor" className="-translate-x-0.5 translate-y-0.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {!isStarted && (
        <p className="text-center text-gray-500 text-xs mt-6 font-light max-w-md mx-auto leading-relaxed">
          {instruction}
        </p>
      )}
    </motion.div>
  );
};
