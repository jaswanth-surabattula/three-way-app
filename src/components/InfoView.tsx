import { motion } from 'motion/react';
import { Layers, MessagesSquare, Columns3, Info, Github, Linkedin } from 'lucide-react';

export const InfoView = () => {
  const cards = [
    {
      title: 'Comparison Mode',
      icon: Columns3,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      description: 'The ultimate side-by-side arena. Send one prompt to three different models simultaneously and compare their responses, latency, and cost in real-time. Ideal for choosing the right model for your specific task.',
      details: [
        'Real-time response streaming from 3 providers.',
        'Detailed latency and token usage metrics.',
        'Side-by-side visual comparison layout.',
        'One-click session report generation.'
      ]
    },
    {
      title: 'Round Table Debate',
      icon: MessagesSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      description: 'Watch three AI models engage in a multi-turn debate on a topic of your choice. Set limits by time, tokens, or rounds to control the depth of the discussion. A unique way to explore conflicting perspectives.',
      details: [
        'Autonomous AI-to-AI conversation flow.',
        'Customizable debate limits (Rounds, Time, Tokens).',
        'Dynamic turn-taking between models.',
        'Full debate transcript export.'
      ]
    },
    {
      title: 'Prompt Strategy',
      icon: Layers,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      description: 'Analyze a single model across five distinct prompt strategies: Creative, Technical, Concise, Analytical, and Persuasive. Perfect for fine-tuning your prompts and understanding model behavior under different constraints.',
      details: [
        'Five strategic personas for one model.',
        'Persona-specific response tailoring.',
        'Comparative analysis of prompt engineering.',
        'Strategy-focused session reporting.'
      ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-8 scrollbar-hide">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl mb-6 border border-white/10 shadow-2xl"
          >
            <Info size={40} className="text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-6">Information Center</h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Welcome to <span className="text-white font-bold">Three-Way</span>. Our platform is designed to push the boundaries of how you interact with and compare the world's most advanced AI models.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-[40px] border ${card.border} ${card.bg} flex flex-col h-full hover:bg-white/[0.07] transition-all duration-500 group`}
            >
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} w-fit mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {card.description}
              </p>
              <ul className="space-y-3 mt-auto">
                {card.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start text-[11px] text-gray-500 font-medium">
                    <span className={`mr-2 mt-1 w-1 h-1 rounded-full ${card.color.replace('text', 'bg')}`} />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="p-10 bg-white/5 rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Session Management</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Three-Way implements a unified session flow to ensure your data is always protected. Switching modes or models will prompt a session reset to maintain consistency across comparisons.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-300 font-medium">Automatic session warning on mode switch</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-300 font-medium">Comprehensive HTML report generation</span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white/5 rounded-[40px] border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Model Providers</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              We integrate with the industry's leading AI providers to give you a diverse range of perspectives and capabilities.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-emerald-400 font-bold text-xs mb-1">OpenAI</span>
                <span className="text-[10px] text-gray-500">ChatGPT</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-blue-400 font-bold text-xs mb-1">Google</span>
                <span className="text-[10px] text-gray-500">Gemini</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-amber-400 font-bold text-xs mb-1">Anthropic</span>
                <span className="text-[10px] text-gray-500">Claude</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 pb-12 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm mb-8 pt-12">Built for the future of AI exploration.</p>
          <div className="flex items-center justify-center gap-8 mb-12">
            <a href="#" className="p-4 bg-white/5 hover:bg-white/10 rounded-3xl transition-all text-gray-400 hover:text-white border border-white/5 group">
              <Github size={28} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="p-4 bg-white/5 hover:bg-white/10 rounded-3xl transition-all text-gray-400 hover:text-white border border-white/5 group">
              <Linkedin size={28} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
          <div className="flex flex-col items-center gap-2">
             <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Version 1.0.0</span>
             <span className="text-[10px] text-gray-700 font-medium">© 2026 Three-Way AI Arena</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
