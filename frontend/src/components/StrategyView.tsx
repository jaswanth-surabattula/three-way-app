import { motion } from 'motion/react';
import { useRef, useEffect } from 'react';
import { Message, ALL_MODELS } from '../types';

interface StrategyViewProps {
  messages: Message[];
  selectedModel: string;
}

export const StrategyView = ({ messages, selectedModel }: StrategyViewProps) => {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    scrollRefs.current.forEach(ref => {
      if (ref) {
        ref.scrollTo({
          top: ref.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }, [messages]);

  const strategies = [
    { id: 'creative', label: 'Creative' },
    { id: 'technical', label: 'Technical' },
    { id: 'concise', label: 'Concise' },
    { id: 'analytical', label: 'Analytical' },
    { id: 'persuasive', label: 'Persuasive' },
  ];

  const model = ALL_MODELS.find(m => m.id === selectedModel) || ALL_MODELS[0];
  const colorBase = model.color.split('-')[1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-full overflow-hidden p-2">
      {strategies.map((strategy, idx) => {
        return (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-3 border-b border-white/5 bg-white/5 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Strategy</span>
              <span className="font-bold text-sm text-white">{strategy.label}</span>
            </div>
            
            <div 
              ref={el => scrollRefs.current[idx] = el}
              className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-full p-3 rounded-xl text-xs ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white' 
                      : `bg-${colorBase}-500/10 text-${colorBase}-100 border border-${colorBase}-500/20`
                  }`}>
                    <p className="leading-relaxed">
                      {msg.role === 'user' ? msg.content : `[${strategy.label} Response] ${msg.content}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
