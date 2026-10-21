'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Library } from 'lucide-react';

interface LibrariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCdns: string[];
  onToggleCdn: (url: string) => void;
  customCdns: string[];
  onAddCustomCdn: (url: string) => void;
  onRemoveCustomCdn: (url: string) => void;
}

const PRESET_LIBS = [
  {
    id: 'tailwind',
    name: 'Tailwind CSS 3',
    desc: 'Utility-first CSS framework (JIT runtime in browser)',
    urls: ['https://cdn.tailwindcss.com']
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap 5.3',
    desc: 'Complete responsive CSS components & JS bundle',
    urls: [
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
    ]
  },
  {
    id: 'fontawesome',
    name: 'FontAwesome 6.5',
    desc: 'Vector icon font & SVG library',
    urls: ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css']
  },
  {
    id: 'threejs',
    name: 'Three.js (r128)',
    desc: '3D WebGL graphics and animations engine',
    urls: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js']
  },
  {
    id: 'gsap',
    name: 'GSAP 3.12',
    desc: 'High-performance JavaScript animation platform',
    urls: ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js']
  },
  {
    id: 'chartjs',
    name: 'Chart.js 4',
    desc: 'HTML5 canvas chart visualizations',
    urls: ['https://cdn.jsdelivr.net/npm/chart.js']
  },
  {
    id: 'jquery',
    name: 'jQuery 3.7',
    desc: 'Classic fast DOM scripting library',
    urls: ['https://code.jquery.com/jquery-3.7.1.min.js']
  },
  {
    id: 'lodash',
    name: 'Lodash 4.17',
    desc: 'Modern utility library for arrays, objects and numbers',
    urls: ['https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js']
  }
];

export const LibrariesModal: React.FC<LibrariesModalProps> = ({
  isOpen,
  onClose,
  selectedCdns,
  onToggleCdn,
  customCdns,
  onAddCustomCdn,
  onRemoveCustomCdn
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    const val = customInput.trim();
    if (val && val.startsWith('http')) {
      onAddCustomCdn(val);
      setCustomInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">External Libraries & CDNs</h3>
              <p className="text-[11px] text-slate-400">Instantly inject CSS & JS bundles into your live sandbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_LIBS.map((lib) => {
              const isChecked = lib.urls.every((u) => selectedCdns.includes(u));
              return (
                <label
                  key={lib.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-blue-600/10 border-blue-500/40 text-white'
                      : 'bg-surface-subtle/50 border-surface-border hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      lib.urls.forEach((url) => onToggleCdn(url));
                    }}
                    className="mt-0.5 rounded bg-surface-card border-surface-border text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-white">{lib.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{lib.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Custom CDN Box */}
          <div className="bg-surface-subtle/40 border border-surface-border rounded-xl p-3.5 space-y-3">
            <div className="text-xs font-semibold text-slate-200">
              Add Custom CDN URL (.js or .css):
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="https://cdn.example.com/library.min.js"
                className="flex-1 bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {customCdns.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {customCdns.map((url) => (
                  <div
                    key={url}
                    className="flex items-center justify-between bg-surface-card border border-surface-border rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono"
                  >
                    <span className="truncate max-w-[380px]">{url}</span>
                    <button
                      onClick={() => onRemoveCustomCdn(url)}
                      className="p-1 hover:text-red-400 text-slate-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-surface-border flex items-center justify-end bg-surface-subtle/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            Apply & Reload Preview
          </button>
        </div>
      </div>
    </div>
  );
};
