export interface VanillaProject {
  id: string;
  title: string;
  description: string;
  category: 'game' | 'app' | 'tool' | 'audio' | 'starter';
  icon: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
  updatedAt: number;
  isCustom?: boolean;
}

export interface ConsoleLogMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  content: string;
  timestamp: number;
  count?: number;
}

export type ActiveTab = 'html' | 'css' | 'js';
export type ViewLayout = 'split' | 'tabs' | 'horizontal';
export type DeviceViewport = 'responsive' | 'desktop' | 'tablet' | 'mobile';

export interface CodeSnippet {
  id: string;
  title: string;
  target: 'html' | 'css' | 'js';
  category: string;
  description: string;
  code: string;
}
