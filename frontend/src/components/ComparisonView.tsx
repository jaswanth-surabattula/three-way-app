import { motion, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Message, ALL_MODELS, SessionMetrics } from '../types';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ComparisonViewProps {
  messages: Message[];
  selectedModels: string[];
  metrics: Record<string, SessionMetrics>;
}

export const ComparisonView = ({ messages, selectedModels, metrics }: ComparisonViewProps) => {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [expandedMetrics, setExpandedMetrics] = useState<Record<number, boolean>>({});

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

  const toggleMetrics = (idx: number) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-hidden p-4">
      {selectedModels.map((modelId, idx) => {
        const model = ALL_MODELS.find(m => m.id === modelId) || ALL_MODELS[0];
        const modelMessages = messages.filter(m => m.model === modelId || m.role === 'user');
        const isExpanded = expandedMetrics[idx];
        const modelMetrics = metrics[modelId] || { latency: 0, tokens: 0, cost: 0 };
        const colorBase = model.color.split('-')[1]; // e.g., 'emerald', 'blue', 'amber'

        return (
          <motion.div
            key={`${modelId}-${idx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold tracking-tighter ${model.color}`}>{model.name}</span>
                <button 
                  onClick={() => toggleMetrics(idx)}
                  className="flex items-center space-x-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                  <span>{isExpanded ? 'Hide info' : 'More info'}</span>
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
              
              {/* Collapsible Metrics Row */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 pt-2 pb-1">
                      <div className="group relative flex items-center space-x-1 cursor-help">
                        <div className="flex flex-col">
                          <span className="mb-1">avg. latency</span>
                          <span className="text-white text-xs">{modelMetrics.latency}ms</span>
                        </div>
                        <Info size={10} className="text-gray-600 mt-[-14px]" />
                        <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-neutral-900 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 normal-case tracking-normal font-normal text-gray-300 shadow-2xl">
                          Average time taken for the model to generate a response.
                        </div>
                      </div>
                      <div className="group relative flex items-center space-x-1 cursor-help">
                        <div className="flex flex-col items-center">
                          <span className="mb-1">total tokens</span>
                          <span className="text-white text-xs">{modelMetrics.tokens}</span>
                        </div>
                        <Info size={10} className="text-gray-600 mt-[-14px]" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-neutral-900 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 normal-case tracking-normal font-normal text-gray-300 shadow-2xl text-center">
                          Total number of tokens processed in this session.
                        </div>
                      </div>
                      <div className="group relative flex items-center space-x-1 cursor-help">
                        <div className="flex flex-col items-end">
                          <span className="mb-1">Est. Cost</span>
                          <span className="text-emerald-400 text-xs">${modelMetrics.cost.toFixed(4)}</span>
                        </div>
                        <Info size={10} className="text-gray-600 mt-[-14px]" />
                        <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-neutral-900 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 normal-case tracking-normal font-normal text-gray-300 shadow-2xl text-right">
                          Estimated cost based on token usage and model pricing.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div 
              ref={el => scrollRefs.current[idx] = el}
              className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide"
            >
              {modelMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[90%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-none' 
                      : `bg-${colorBase}-500/10 text-${colorBase}-100 border border-${colorBase}-500/20 rounded-tl-none`
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
