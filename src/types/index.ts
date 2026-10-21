export type LayoutMode = 'split' | 'stacked' | 'tabs';
export type ActiveTab = 'html' | 'css' | 'js';
export type DeviceWidth = '100%' | '768px' | '375px';

export interface ConsoleLogEntry {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  args: any[];
  timestamp: string;
}

export interface LibraryItem {
  id: string;
  name: string;
  desc: string;
  css?: string;
  js?: string;
  checked?: boolean;
}

export interface CodeTemplate {
  name: string;
  html: string;
  css: string;
  js: string;
  requiredCdns?: string[];
}
