import { motion } from 'motion/react';
import { useRef, useEffect } from 'react';
import { Message, ALL_MODELS } from '../types';

interface RoundTableViewProps {
  messages: Message[];
  limit: {
    type: 'time' | 'tokens' | 'rounds';
    indices: { time: number; tokens: number; rounds: number };
  };
}

const LIMIT_OPTIONS = {
  time: ['30 sec', '1 min', '1.5 min', '2 min', '3 min'],
  tokens: ['10K', '15K', '20K', '30K', '50K'],
  rounds: ['7', '10', '15', '20', '25']
};

export const RoundTableView = ({ messages, limit }: RoundTableViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const currentLimitDisplay = `${LIMIT_OPTIONS[limit.type][limit.indices[limit.type]]} ${limit.type}`;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs text-white font-bold tracking-tight">AI Debate Arena</span>
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Limit: {currentLimitDisplay}</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide"
      >
        {messages.map((msg, idx) => {
          const model = ALL_MODELS.find(m => m.id === msg.model);
          const colorBase = model?.color.split('-')[1] || 'gray';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'ai' && (
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ml-4 ${model?.color}`}>
                    {model?.name}
                  </span>
                )}
                <div className={`p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-white text-black rounded-tr-none' 
                    : `bg-${colorBase}-500/10 border border-${colorBase}-500/20 text-${colorBase}-100 rounded-tl-none`
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
