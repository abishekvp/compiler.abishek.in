'use client';

import React, { useState } from 'react';
import { LayoutMode } from '@/types';
import {
  Code2,
  ChevronDown,
  Play,
  Sparkles,
  RotateCcw,
  Maximize,
  Minimize,
  Download,
  ExternalLink,
  Layers,
  Columns,
  Rows,
  FolderCode,
  Library,
  Share2,
  Check
} from 'lucide-react';

interface HeaderProps {
  layout: LayoutMode;
  setLayout: (mode: LayoutMode) => void;
  autoRun: boolean;
  setAutoRun: (auto: boolean) => void;
  onRun: () => void;
  onFormat: () => void;
  onReset: () => void;
  onSelectTemplate: (key: string) => void;
  onOpenLibraries: () => void;
  activeLibsCount: number;
  onExportHtml: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  layout,
  setLayout,
  autoRun,
  setAutoRun,
  onRun,
  onFormat,
  onReset,
  onSelectTemplate,
  onOpenLibraries,
  activeLibsCount,
  onExportHtml
}) => {
  const [suiteOpen, setSuiteOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  return (
    <header className="h-14 bg-surface-card border-b border-surface-border px-4 flex items-center justify-between gap-4 select-none flex-shrink-0 z-40">
      {/* Left: Brand + Switcher + Templates + Libs */}
      <div className="flex items-center gap-3">
        <a href="https://apps.abishek.in" className="flex items-center gap-2 group text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">
              Web<span className="text-blue-400">Compiler</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              IDE
            </span>
          </div>
        </a>

        {/* Suite Switcher */}
        <div className="relative">
          <button
            onClick={() => setSuiteOpen(!suiteOpen)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border px-2.5 py-1.5 rounded-md transition-colors"
          >
            <span>All Tools</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {suiteOpen && (
            <div
              className="absolute top-full left-0 mt-1.5 w-60 bg-surface-card border border-surface-border rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
              onMouseLeave={() => setSuiteOpen(false)}
            >
              <a href="https://apps.abishek.in" className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 rounded-lg">
                🚀 Tools & Apps Hub (apps.abishek.in)
              </a>
              <div className="h-px bg-surface-border my-1" />
              <a href="https://compiler.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600/20 rounded-lg">
                💻 Web Compiler (HTML/CSS/JS)
              </a>
              <a href="https://base64.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                ⚡ Base64 Studio
              </a>
              <a href="https://json.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🌲 JSON Master Suite
              </a>
              <a href="https://md.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                📝 Markdown Studio Pro
              </a>
              <a href="https://prettier.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                ✨ Prettier Code Formatter
              </a>
              <a href="https://image.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🖼️ Image Compressor Pro
              </a>
              <a href="https://pdf.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                📄 PDF Toolkit
              </a>
              <a href="https://youtube.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🎥 YouTube Downloader
              </a>
            </div>
          )}
        </div>

        {/* Templates Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setTemplateOpen(!templateOpen)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border px-2.5 py-1.5 rounded-md transition-colors"
          >
            <FolderCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>Templates</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {templateOpen && (
            <div
              className="absolute top-full left-0 mt-1.5 w-64 bg-surface-card border border-surface-border rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
              onMouseLeave={() => setTemplateOpen(false)}
            >
              {[
                { id: 'starter', label: 'Default Starter (Card & Button)' },
                { id: 'canvas', label: 'Matrix Digital Rain (Canvas)' },
                { id: 'cube3d', label: 'Interactive 3D CSS Cube' },
                { id: 'tailwind', label: 'Tailwind CSS Modern Dashboard' },
                { id: 'calc', label: 'Glassmorphism Calculator' },
                { id: 'threejs', label: 'Three.js 3D Animated Sphere' }
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    onSelectTemplate(tpl.id);
                    setTemplateOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg transition-colors truncate"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CDN Libraries Trigger */}
        <button
          onClick={onOpenLibraries}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border px-2.5 py-1.5 rounded-md transition-colors"
        >
          <Library className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Libraries</span>
          {activeLibsCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
              {activeLibsCount}
            </span>
          )}
        </button>
      </div>

      {/* Center: Run, Auto-run, Format, Reset */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          title="Run compilation (Ctrl + Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run</span>
          <span className="text-[10px] opacity-75 font-mono hidden lg:inline">Ctrl+↵</span>
        </button>

        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer ml-1 select-none">
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => setAutoRun(e.target.checked)}
            className="rounded bg-surface-subtle border-surface-border text-blue-600 focus:ring-0 cursor-pointer"
          />
          <span className="hidden sm:inline">Auto-run</span>
        </label>

        <button
          onClick={onFormat}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-surface-hover border border-transparent hover:border-surface-border text-xs"
          title="Format Code"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        </button>

        <button
          onClick={onReset}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-surface-hover border border-transparent hover:border-surface-border text-xs"
          title="Reset Canvas"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Layout Switcher, Export, Fullscreen, Hub */}
      <div className="flex items-center gap-2">
        {/* Layout Switcher */}
        <div className="inline-flex rounded-lg bg-surface-subtle p-0.5 border border-surface-border hidden md:flex">
          <button
            onClick={() => setLayout('split')}
            className={`p-1 rounded-md transition-colors ${
              layout === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Split Side-by-side"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayout('stacked')}
            className={`p-1 rounded-md transition-colors ${
              layout === 'stacked' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Stacked Top-to-Bottom"
          >
            <Rows className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayout('tabs')}
            className={`p-1 rounded-md transition-colors ${
              layout === 'tabs' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Tabbed Panes"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border px-2.5 py-1.5 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {exportOpen && (
            <div
              className="absolute top-full right-0 mt-1.5 w-48 bg-surface-card border border-surface-border rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
              onMouseLeave={() => setExportOpen(false)}
            >
              <button
                onClick={() => {
                  onExportHtml();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Download HTML File</span>
              </button>
              <button
                onClick={() => {
                  handleShare();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-2"
              >
                {urlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{urlCopied ? 'URL Copied!' : 'Copy Share URL'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Hub Link */}
        <a
          href="https://apps.abishek.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 shadow-sm"
        >
          <span>All Apps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
};
