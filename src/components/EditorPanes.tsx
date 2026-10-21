'use client';

import React, { useState } from 'react';
import { LayoutMode } from '@/types';
import { Trash2, WrapText } from 'lucide-react';

interface EditorPanesProps {
  layout: LayoutMode;
  html: string;
  setHtml: (val: string) => void;
  css: string;
  setCss: (val: string) => void;
  js: string;
  setJs: (val: string) => void;
}

export const EditorPanes: React.FC<EditorPanesProps> = ({
  layout,
  html,
  setHtml,
  css,
  setCss,
  js,
  setJs
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [wrapHtml, setWrapHtml] = useState(false);
  const [wrapCss, setWrapCss] = useState(false);
  const [wrapJs, setWrapJs] = useState(false);

  const renderLines = (code: string) => {
    const count = Math.max(code.split('\n').length, 1);
    return Array.from({ length: count }, (_, i) => i + 1).join('\n');
  };

  const renderSingleEditor = (
    lang: 'html' | 'css' | 'js',
    title: string,
    tagColor: string,
    value: string,
    onChange: (val: string) => void,
    wrap: boolean,
    onToggleWrap: () => void,
    onClear: () => void
  ) => {
    return (
      <div className="flex-1 flex flex-col h-full bg-surface-card border-r border-b border-surface-border min-h-0 min-w-0">
        {/* Editor Box Header */}
        <div className="h-8 px-3 border-b border-surface-border flex items-center justify-between text-xs bg-surface-subtle/50 select-none flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${tagColor}`}
            >
              {lang}
            </span>
            <span className="font-semibold text-slate-300">{title}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleWrap}
              className={`p-1 rounded text-xs transition-colors ${
                wrap ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-surface-hover'
              }`}
              title="Toggle line wrapping"
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-surface-hover"
              title="Clear editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editor Body with Line Numbers */}
        <div className="flex-1 flex min-h-0 relative bg-[#0d131f]">
          <div className="w-10 py-3 bg-[#090d16] border-r border-surface-border/50 text-right pr-2 select-none text-[12px] font-mono text-slate-600 leading-relaxed overflow-hidden">
            <pre className="m-0 p-0">{renderLines(value)}</pre>
          </div>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className={`flex-1 p-3 bg-transparent text-slate-100 font-mono text-[12px] leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30 overflow-auto ${
              wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
            }`}
            placeholder={`Enter ${title} here...`}
          />
        </div>
      </div>
    );
  };

  if (layout === 'tabs') {
    return (
      <div className="flex-1 flex flex-col h-full min-h-0">
        {/* Tab switcher bar */}
        <div className="h-9 px-2 bg-surface-darker border-b border-surface-border flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'html' ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'css' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'js' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            JavaScript
          </button>
        </div>

        <div className="flex-1 min-h-0">
          {activeTab === 'html' &&
            renderSingleEditor(
              'html',
              'HTML Structure',
              'bg-orange-500/10 text-orange-400 border border-orange-500/20',
              html,
              setHtml,
              wrapHtml,
              () => setWrapHtml(!wrapHtml),
              () => setHtml('')
            )}
          {activeTab === 'css' &&
            renderSingleEditor(
              'css',
              'CSS Styling',
              'bg-blue-500/10 text-blue-400 border border-blue-500/20',
              css,
              setCss,
              wrapCss,
              () => setWrapCss(!wrapCss),
              () => setCss('')
            )}
          {activeTab === 'js' &&
            renderSingleEditor(
              'js',
              'JavaScript (ES6+)',
              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
              js,
              setJs,
              wrapJs,
              () => setWrapJs(!wrapJs),
              () => setJs('')
            )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex min-h-0 ${
        layout === 'stacked' ? 'flex-col divide-y divide-surface-border' : 'flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-surface-border'
      }`}
    >
      {renderSingleEditor(
        'html',
        'HTML Structure',
        'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        html,
        setHtml,
        wrapHtml,
        () => setWrapHtml(!wrapHtml),
        () => setHtml('')
      )}
      {renderSingleEditor(
        'css',
        'CSS Styling',
        'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        css,
        setCss,
        wrapCss,
        () => setWrapCss(!wrapCss),
        () => setCss('')
      )}
      {renderSingleEditor(
        'js',
        'JavaScript (ES6+)',
        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        js,
        setJs,
        wrapJs,
        () => setWrapJs(!wrapJs),
        () => setJs('')
      )}
    </div>
  );
};
