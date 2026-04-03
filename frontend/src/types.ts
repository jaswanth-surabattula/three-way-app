export type AppMode = 'comparison' | 'roundtable' | 'strategy' | 'info';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  model?: string;
  timestamp: number;
}

export interface SessionMetrics {
  latency: number;
  tokens: number;
  cost: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  color: string;
}

export const PROVIDERS = [
  { 
    id: 'openai', 
    name: 'ChatGPT', 
    color: 'text-emerald-500', 
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5' }
    ] 
  },
  { 
    id: 'google', 
    name: 'Gemini', 
    color: 'text-blue-500', 
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      { id: 'gemini-pro', name: 'Gemini Pro' }
    ] 
  },
  { 
    id: 'anthropic', 
    name: 'Claude', 
    color: 'text-amber-500', 
    models: [
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku' }
    ] 
  },
];

export const MODELS: ModelConfig[] = PROVIDERS.map(p => ({
  id: p.models[0].id,
  name: p.name,
  color: p.color
}));

export const ALL_MODELS: ModelConfig[] = PROVIDERS.flatMap(p => 
  p.models.map(m => ({
    id: m.id,
    name: m.name,
    color: p.color
  }))
);
