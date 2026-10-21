'use client';

import React, { useState, useRef } from 'react';
import { DeviceWidth, ConsoleLogEntry } from '@/types';
import { ConsoleDrawer } from './ConsoleDrawer';
import {
  RotateCw,
  ExternalLink,
  Terminal,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

interface PreviewSectionProps {
  fullHtml: string;
  onRefresh: () => void;
  logs: ConsoleLogEntry[];
  onClearLogs: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  fullHtml,
  onRefresh,
  logs,
  onClearLogs
}) => {
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('100%');
  const [consoleOpen, setConsoleOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleOpenNewWindow = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(fullHtml);
      win.document.close();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-darker min-h-0 min-w-0">
      {/* Top Preview Controls Bar */}
      <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs bg-surface-card select-none flex-shrink-0">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-lg border border-surface-border">
          <button
            onClick={() => setDeviceWidth('100%')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              deviceWidth === '100%' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="100% Responsive"
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden sm:inline">Full</span>
          </button>
          <button
            onClick={() => setDeviceWidth('768px')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              deviceWidth === '768px' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3 h-3" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceWidth('375px')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              deviceWidth === '375px' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover text-xs"
            title="Refresh Sandbox"
          >
            <RotateCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          <button
            onClick={() => setConsoleOpen(!consoleOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              consoleOpen
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-surface-hover'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
            {logs.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-blue-400">
                {logs.length}
              </span>
            )}
          </button>

          <button
            onClick={handleOpenNewWindow}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Viewport Iframe Container */}
      <div className="flex-1 flex items-center justify-center p-2 bg-[#060911] overflow-hidden min-h-0 relative">
        <div
          style={{ width: deviceWidth }}
          className="h-full max-w-full transition-all duration-200 bg-white shadow-2xl rounded-lg overflow-hidden border border-surface-border flex flex-col"
        >
          <iframe
            ref={iframeRef}
            srcDoc={fullHtml}
            sandbox="allow-scripts allow-modals allow-same-origin"
            title="Sandbox Live Preview"
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>

      {/* Console Drawer */}
      <ConsoleDrawer
        logs={logs}
        isOpen={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        onClear={onClearLogs}
      />
    </div>
  );
};
