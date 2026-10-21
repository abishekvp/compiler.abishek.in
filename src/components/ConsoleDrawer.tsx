'use client';

import React, { useState } from 'react';
import { ConsoleLogEntry } from '@/types';
import {
  Terminal,
  Trash2,
  X,
  AlertTriangle,
  AlertCircle,
  Info
} from 'lucide-react';

interface ConsoleDrawerProps {
  logs: ConsoleLogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const ConsoleDrawer: React.FC<ConsoleDrawerProps> = ({
  logs,
  isOpen,
  onClose,
  onClear
}) => {
  const [filter, setFilter] = useState<'all' | 'log' | 'warn' | 'error'>('all');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) => {
    if (filter === 'all') return true;
    if (filter === 'log') return l.type === 'log' || l.type === 'info';
    return l.type === filter;
  });

  return (
    <div className="h-56 bg-surface-darker border-t border-surface-border flex flex-col flex-shrink-0 z-30 select-none">
      {/* Drawer Header */}
      <div className="h-9 px-3 border-b border-surface-border flex items-center justify-between text-xs bg-surface-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Console</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {logs.length}
            </span>
          </div>

          <div className="h-3.5 w-px bg-surface-border" />

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('log')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter === 'log' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setFilter('warn')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter === 'warn' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter === 'error' ? 'bg-red-500/20 text-red-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Errors
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-slate-400 hover:text-white hover:bg-surface-hover text-[11px]"
            title="Clear Console"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-hover"
            title="Close Drawer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output Stream */}
      <div className="flex-1 p-2 overflow-y-auto font-mono text-[12px] space-y-1 select-text">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-6 text-xs select-none">
            Console ready. No logs emitted yet.
          </div>
        ) : (
          filteredLogs.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-2 px-2 py-1 rounded border ${
                item.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20 text-red-300'
                  : item.type === 'warn'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                  : 'bg-surface-subtle/30 border-surface-border/40 text-slate-200'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {item.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                {item.type === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
                {item.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                {item.type === 'log' && <Terminal className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              <div className="flex-1 break-words whitespace-pre-wrap leading-tight">
                {item.args.join(' ')}
              </div>

              <div className="text-[10px] text-slate-500 flex-shrink-0">
                {item.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
