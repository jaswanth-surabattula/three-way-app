import { 
  PanelLeftClose, 
  Columns3, 
  Layers, 
  MessagesSquare, 
  Settings2,
  Info,
  Github,
  Linkedin
} from 'lucide-react';
import { AppMode } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onOpenSettings: () => void;
}

export const Sidebar = ({ isOpen, setIsOpen, mode, setMode, onOpenSettings }: SidebarProps) => {
  const menuItems = [
    { id: 'comparison', icon: Columns3, label: 'Comparison Mode' },
    { id: 'roundtable', icon: MessagesSquare, label: 'Round Table' },
    { id: 'strategy', icon: Layers, label: 'Prompt Strategy' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 240 : 80,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 1
      }}
      className="h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col relative z-40"
    >
      <div className="p-6 flex items-center justify-between overflow-hidden">
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
          transition={{ duration: 0.2 }}
          className="flex items-center min-w-0"
        >
          {isOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">Three-Way</span>}
        </motion.div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors shrink-0"
        >
          <PanelLeftClose size={20} className={isOpen ? "" : "rotate-180"} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as AppMode)}
            className={`w-full flex items-center p-3 rounded-xl transition-colors group relative ${
              mode === item.id 
                ? "bg-white/10 text-white shadow-lg shadow-white/5" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon size={24} className="shrink-0" />
            <motion.span
              animate={{ 
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -10,
                display: isOpen ? "block" : "none"
              }}
              transition={{ duration: 0.2 }}
              className="ml-4 font-medium whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2 overflow-hidden">
        <button
          onClick={() => setMode('info')}
          className={`w-full flex items-center p-3 rounded-xl transition-colors group ${
            mode === 'info' 
              ? "bg-white/10 text-white shadow-lg shadow-white/5" 
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Info size={24} className="shrink-0" />
          <motion.span
            animate={{ 
              opacity: isOpen ? 1 : 0,
              x: isOpen ? 0 : -10,
              display: isOpen ? "block" : "none"
            }}
            transition={{ duration: 0.2 }}
            className="ml-4 font-medium whitespace-nowrap"
          >
            Information
          </motion.span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors group"
        >
          <Settings2 size={24} className="shrink-0" />
          <motion.span
            animate={{ 
              opacity: isOpen ? 1 : 0,
              x: isOpen ? 0 : -10,
              display: isOpen ? "block" : "none"
            }}
            transition={{ duration: 0.2 }}
            className="ml-4 font-medium whitespace-nowrap"
          >
            Settings
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
};
