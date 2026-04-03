import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { ChatInput } from './components/ChatInput';
import { ComparisonView } from './components/ComparisonView';
import { StrategyView } from './components/StrategyView';
import { RoundTableView } from './components/RoundTableView';
import { SettingsModal } from './components/SettingsModal';
import { InfoView } from './components/InfoView';
import { AppMode, Message, SessionMetrics, MODELS, PROVIDERS, ALL_MODELS } from './types';
import { AlertCircle, Download, RefreshCw, X, Timer, Zap, Hash, AlertTriangle, FileText } from 'lucide-react';

const MODE_CONFIG = {
  comparison: {
    label: 'Comparison Mode',
    color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20',
    subtexts: [
      "3 Models, 1 Question. Let us see who wins.",
      "The ultimate AI comparison arena.",
      "Decide which intelligence serves you best.",
      "One prompt, three perspectives, zero compromise."
    ],
    instruction: "Enter a prompt to compare responses from three different AI models simultaneously."
  },
  strategy: {
    label: 'Prompt Strategy',
    color: 'bg-blue-500/20 text-blue-500 border-blue-500/20',
    subtexts: [
      "One Model, Five Strategies.",
      "Optimize your prompts with Prompt Strategy mode.",
      "See how different personas handle your request.",
      "Creative, Technical, Concise - all in one view."
    ],
    instruction: "Enter a prompt to see one model respond using five distinct strategic personas."
  },
  roundtable: {
    label: 'Round Table',
    color: 'bg-purple-500/20 text-purple-500 border-purple-500/20',
    subtexts: [
      "AI-to-AI Debate Mode.",
      "Watch models discuss and refine ideas.",
      "Collaborative intelligence in action.",
      "Set the topic and let the debate begin."
    ],
    instruction: "Enter a topic to start an AI-to-AI debate. Configure limits in the control bar above."
  },
  info: {
    label: 'Information Center',
    color: 'bg-white/10 text-white border-white/10',
    subtexts: [
      "Learn about Three-Way.",
      "Explore the different modes.",
      "Witness the power of modern AI."
    ],
    instruction: "Explore the different modes designed to help you compare, analyze, and witness the power of modern AI."
  }
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [mode, setMode] = useState<AppMode>('comparison');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-3.5-turbo', 'gemini-1.5-flash', 'claude-3-haiku']);
  const [strategyModel, setStrategyModel] = useState<string>('gemini-1.5-flash');
  const [metrics, setMetrics] = useState<Record<string, SessionMetrics>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [activePopup, setActivePopup] = useState<'time' | 'tokens' | 'rounds' | null>(null);
  const [currentSubtext, setCurrentSubtext] = useState(MODE_CONFIG.comparison.subtexts[0]);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'mode' | 'new' | 'model', value?: any } | null>(null);
  const [showReportPrompt, setShowReportPrompt] = useState(false);
  const [roundTableLimit, setRoundTableLimit] = useState({
    type: 'rounds' as 'time' | 'tokens' | 'rounds',
    indices: { time: 1, tokens: 2, rounds: 0 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isStarted) {
        setCurrentSubtext(prev => {
          const subtexts = MODE_CONFIG[mode].subtexts;
          const idx = subtexts.indexOf(prev);
          return subtexts[(idx + 1) % subtexts.length];
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isStarted, mode]);

  // Reset subtext when mode changes
  useEffect(() => {
    if (!isStarted) {
      setCurrentSubtext(MODE_CONFIG[mode].subtexts[0]);
    }
  }, [mode, isStarted]);

  const handleSend = (text: string) => {
    if (!isStarted) setIsStarted(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);

    // Simulate AI responses
    setTimeout(() => {
      const modelsToUse = mode === 'strategy' ? [strategyModel] : selectedModels;
      
      const aiResponses: Message[] = modelsToUse.map((mId, idx) => {
        const model = ALL_MODELS.find(m => m.id === mId);
        return {
          id: (Date.now() + idx + 1).toString(),
          role: 'ai',
          model: mId,
          content: `This is a simulated response from ${model?.name || mId} regarding: "${text}"`,
          timestamp: Date.now() + idx + 1
        };
      });

      setMessages(prev => [...prev, ...aiResponses]);
      
      // Update dummy metrics for each model
      setMetrics(prev => {
        const next = { ...prev };
        modelsToUse.forEach(mId => {
          const current = next[mId] || { latency: 0, tokens: 0, cost: 0 };
          next[mId] = {
            latency: Math.floor(Math.random() * 1500) + 500,
            tokens: current.tokens + Math.floor(Math.random() * 500) + 100,
            cost: current.cost + (Math.random() * 0.01)
          };
        });
        return next;
      });
    }, 1000);
  };

  const handleNewSession = () => {
    if (isStarted && messages.length > 0) {
      setPendingAction({ type: 'new' });
      setShowSessionWarning(true);
    } else {
      resetSession();
      if (mode === 'info') setMode('comparison');
    }
  };

  const resetSession = () => {
    setMessages([]);
    setIsStarted(false);
    setMetrics({});
  };

  const generateComparisonReport = () => {
    const reportHtml = `
      <html>
        <head><title>Comparison Session Report</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #f4f4f4;">
          <h1>Comparison Session Report</h1>
          <p>Date: ${new Date().toLocaleString()}</p>
          <h2>Models Compared</h2>
          <ul>
            ${selectedModels.map(mId => `<li>${ALL_MODELS.find(m => m.id === mId)?.name}</li>`).join('')}
          </ul>
          <h2>Metrics</h2>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <tr><th>Model</th><th>Avg Latency</th><th>Total Tokens</th><th>Est. Cost</th></tr>
            ${selectedModels.map(mId => {
              const m = metrics[mId] || { latency: 0, tokens: 0, cost: 0 };
              return `<tr><td>${ALL_MODELS.find(mod => mod.id === mId)?.name}</td><td>${m.latency}ms</td><td>${m.tokens}</td><td>$${m.cost.toFixed(4)}</td></tr>`;
            }).join('')}
          </table>
          <h2>Conversation</h2>
          ${messages.map(m => `<p><strong>${m.role === 'user' ? 'User' : ALL_MODELS.find(mod => mod.id === m.model)?.name}:</strong> ${m.content}</p>`).join('')}
        </body>
      </html>
    `;
    downloadReport(reportHtml, 'comparison-report.html');
    skipReport();
  };

  const generateStrategyReport = () => {
    const reportHtml = `
      <html>
        <head><title>Prompt Strategy Report</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #f4f4f4;">
          <h1>Prompt Strategy Report</h1>
          <p>Date: ${new Date().toLocaleString()}</p>
          <p>Model: ${ALL_MODELS.find(m => m.id === strategyModel)?.name}</p>
          <h2>Metrics</h2>
          <p>Avg Latency: ${metrics[strategyModel]?.latency || 0}ms</p>
          <p>Total Tokens: ${metrics[strategyModel]?.tokens || 0}</p>
          <p>Est. Cost: $${(metrics[strategyModel]?.cost || 0).toFixed(4)}</p>
          <h2>Strategies Analyzed</h2>
          ${messages.filter(m => m.role === 'ai').map((m, i) => `<h3>Strategy ${i + 1}</h3><p>${m.content}</p>`).join('')}
        </body>
      </html>
    `;
    downloadReport(reportHtml, 'strategy-report.html');
    skipReport();
  };

  const generateRoundTableReport = () => {
    const reportHtml = `
      <html>
        <head><title>Round Table Debate Report</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #f4f4f4;">
          <h1>Round Table Debate Report</h1>
          <p>Date: ${new Date().toLocaleString()}</p>
          <p>Limit: ${roundTableLimit.indices[roundTableLimit.type]} ${roundTableLimit.type}</p>
          <h2>Debate Participants</h2>
          <ul>
            ${selectedModels.map(mId => `<li>${ALL_MODELS.find(m => m.id === mId)?.name}</li>`).join('')}
          </ul>
          <h2>Transcript</h2>
          ${messages.map(m => `<p><strong>${m.role === 'user' ? 'Topic' : ALL_MODELS.find(mod => mod.id === m.model)?.name}:</strong> ${m.content}</p>`).join('')}
        </body>
      </html>
    `;
    downloadReport(reportHtml, 'roundtable-report.html');
    skipReport();
  };

  const downloadReport = (html: string, filename: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleModeChange = (newMode: AppMode) => {
    if (isStarted && messages.length > 0) {
      setPendingAction({ type: 'mode', value: newMode });
      setShowSessionWarning(true);
    } else {
      setMode(newMode);
    }
  };

  const handleModelChange = (idx: number, modelId: string) => {
    if (isStarted && messages.length > 0) {
      setPendingAction({ type: 'model', value: { idx, modelId } });
      setShowSessionWarning(true);
    } else {
      setSelectedModels(prev => {
        const next = [...prev];
        next[idx] = modelId;
        return next;
      });
    }
  };

  const handleStrategyModelChange = (modelId: string) => {
    if (isStarted && messages.length > 0) {
      setPendingAction({ type: 'model', value: { idx: -1, modelId } });
      setShowSessionWarning(true);
    } else {
      setStrategyModel(modelId);
    }
  };

  const confirmAction = () => {
    setShowSessionWarning(false);
    setShowReportPrompt(true);
  };

  const skipReport = () => {
    setShowReportPrompt(false);
    executePendingAction();
  };

  const executePendingAction = () => {
    if (!pendingAction) return;
    
    resetSession();
    
    if (pendingAction.type === 'mode') {
      setMode(pendingAction.value);
    } else if (pendingAction.type === 'new') {
      if (mode === 'info') setMode('comparison');
    } else if (pendingAction.type === 'model') {
      const { idx, modelId } = pendingAction.value;
      if (idx === -1) {
        setStrategyModel(modelId);
      } else {
        setSelectedModels(prev => {
          const next = [...prev];
          next[idx] = modelId;
          return next;
        });
      }
    }
    
    setPendingAction(null);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        mode={mode} 
        setMode={handleModeChange}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="p-6 flex justify-between items-center z-30">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
              <span className="text-xl font-bold tracking-tighter">Three-Way</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${MODE_CONFIG[mode].color}`}
              >
                {MODE_CONFIG[mode].label}
              </motion.div>
            </AnimatePresence>
          </div>
          <button 
            onClick={handleNewSession}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
          >
            <RefreshCw size={16} />
            <span>New Session</span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {mode === 'info' ? (
              <motion.div
                key="info-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full w-full"
              >
                <InfoView />
              </motion.div>
            ) : !isStarted ? (
              <div key="landing" className="flex flex-col items-center justify-center w-full max-w-4xl">
                <Hero subtext={currentSubtext} />
                <div className="w-full px-6">
                  <ChatInput 
                    onSend={handleSend} 
                    isStarted={isStarted} 
                    selectedModels={selectedModels}
                    setSelectedModels={setSelectedModels}
                    strategyModel={strategyModel}
                    setStrategyModel={handleStrategyModelChange}
                    onModelChange={handleModelChange}
                    instruction={MODE_CONFIG[mode].instruction}
                    mode={mode}
                    roundTableLimit={roundTableLimit}
                    setRoundTableLimit={setRoundTableLimit}
                    setActivePopup={setActivePopup}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                key="active-chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full w-full flex flex-col"
              >
                <div className="flex-1 overflow-hidden">
                  {mode === 'comparison' && <ComparisonView messages={messages} selectedModels={selectedModels} metrics={metrics} />}
                  {mode === 'strategy' && <StrategyView messages={messages} selectedModel={strategyModel} />}
                  {mode === 'roundtable' && <RoundTableView messages={messages} limit={roundTableLimit} />}
                  {mode === 'info' && <InfoView />}
                </div>
                
                {mode !== 'roundtable' && mode !== 'info' && (
                  <div className="p-6 z-30 relative">
                    <ChatInput 
                      onSend={handleSend} 
                      isStarted={isStarted} 
                      selectedModels={selectedModels}
                      setSelectedModels={setSelectedModels}
                      strategyModel={strategyModel}
                      setStrategyModel={handleStrategyModelChange}
                      onModelChange={handleModelChange}
                      instruction={MODE_CONFIG[mode].instruction}
                      mode={mode}
                      roundTableLimit={roundTableLimit}
                      setRoundTableLimit={setRoundTableLimit}
                      setActivePopup={setActivePopup}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Round Table Limit Popup */}
      <AnimatePresence mode="wait">
        {activePopup && (
          <div key="popup-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setActivePopup(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-neutral-900 border border-white/10 rounded-[40px] p-8 w-full max-w-sm shadow-2xl"
            >
              <button 
                onClick={() => setActivePopup(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mb-10">
                <div className={`p-4 rounded-3xl mb-4 ${
                  activePopup === 'time' ? 'bg-blue-500/20 text-blue-400' :
                  activePopup === 'tokens' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {activePopup === 'time' && <Timer size={32} />}
                  {activePopup === 'tokens' && <Zap size={32} />}
                  {activePopup === 'rounds' && <Hash size={32} />}
                </div>
                <h3 className="text-xl font-bold capitalize mb-1">Set {activePopup} Limit</h3>
                <p className="text-gray-500 text-sm">Choose your preferred debate length</p>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between px-2">
                  {['30 sec', '1 min', '1.5 min', '2 min', '3 min'].map((opt, i) => {
                    const options = activePopup === 'time' ? ['30 sec', '1 min', '1.5 min', '2 min', '3 min'] :
                                   activePopup === 'tokens' ? ['10K', '15K', '20K', '30K', '50K'] :
                                   ['7', '10', '15', '20', '25'];
                    const currentOpt = options[i];
                    if (!currentOpt) return null;
                    
                    return (
                      <div key={currentOpt} className="flex flex-col items-center">
                        <div className={`w-1 h-1 rounded-full mb-2 ${roundTableLimit.indices[activePopup] === i ? 'bg-white' : 'bg-white/20'}`} />
                        <span className={`text-[10px] font-bold ${roundTableLimit.indices[activePopup] === i ? 'text-white' : 'text-gray-600'}`}>
                          {currentOpt}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="relative h-12 flex items-center">
                  <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full" />
                  <input 
                    type="range" 
                    min="0" 
                    max="4"
                    step="1"
                    value={roundTableLimit.indices[activePopup]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val !== roundTableLimit.indices[activePopup]) {
                        setRoundTableLimit(prev => ({
                          ...prev,
                          indices: { ...prev.indices, [activePopup]: val }
                        }));
                        // Sound/Haptic feedback logic moved to a separate function if needed, 
                        // but keeping it simple here for now.
                      }
                    }}
                    className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <motion.div 
                    className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none"
                    animate={{ left: `${(roundTableLimit.indices[activePopup] / 4) * 100}%` }}
                    style={{ x: '-50%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <div className="w-1 h-3 bg-black/20 rounded-full" />
                  </motion.div>
                </div>

                <button 
                  onClick={() => setActivePopup(null)}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all shadow-lg"
                >
                  Confirm Limit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Session Warning Modal */}
      <AnimatePresence>
        {showSessionWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-neutral-900 border border-white/10 p-8 rounded-[32px] max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">End Current Session?</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Doing this ends the current session and starts a new one. Do you still want to continue?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSessionWarning(false)}
                  className="flex-1 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                >
                  No, Cancel
                </button>
                <button 
                  onClick={confirmAction}
                  className="flex-1 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-bold transition-all"
                >
                  Yes, Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Prompt Modal */}
      <AnimatePresence>
        {showReportPrompt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-neutral-900 border border-white/10 p-8 rounded-[32px] max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Generate Session Report?</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Would you like to download a summary report of this session before it ends?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={skipReport}
                  className="flex-1 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                >
                  No, Skip
                </button>
                <button 
                  onClick={() => {
                    if (mode === 'comparison') generateComparisonReport();
                    else if (mode === 'strategy') generateStrategyReport();
                    else if (mode === 'roundtable') generateRoundTableReport();
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
                >
                  Yes, Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
