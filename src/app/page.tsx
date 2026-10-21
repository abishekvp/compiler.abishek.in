'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LayoutMode, ConsoleLogEntry } from '@/types';
import { TEMPLATES } from '@/lib/templates';
import { generateCompleteHtml, downloadHtmlFile } from '@/lib/compiler';
import { Header } from '@/components/Header';
import { EditorPanes } from '@/components/EditorPanes';
import { PreviewSection } from '@/components/PreviewSection';
import { LibrariesModal } from '@/components/LibrariesModal';

export default function CompilerPage() {
  const [layout, setLayout] = useState<LayoutMode>('split');
  const [html, setHtml] = useState<string>(TEMPLATES.starter.html);
  const [css, setCss] = useState<string>(TEMPLATES.starter.css);
  const [js, setJs] = useState<string>(TEMPLATES.starter.js);

  const [selectedCdns, setSelectedCdns] = useState<string[]>([]);
  const [customCdns, setCustomCdns] = useState<string[]>([]);
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [isLibrariesOpen, setIsLibrariesOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Combined CDNs
  const allCdns = useMemo(() => {
    return Array.from(new Set([...selectedCdns, ...customCdns]));
  }, [selectedCdns, customCdns]);

  // Compiled Document
  const compiledHtml = useMemo(() => {
    return generateCompleteHtml({
      html,
      css,
      js,
      cdnUrls: allCdns
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, css, js, allCdns, refreshKey]);

  // Console message listener from sandbox
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.source === 'compiler-sandbox-console') {
        const { type, args } = e.data;
        const now = new Date();
        const timestamp = now.toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            type,
            args,
            timestamp
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keyboard shortcut Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRun = () => {
    setLogs([]);
    setRefreshKey((k) => k + 1);
  };

  const handleFormat = () => {
    const cleanLines = (str: string) =>
      str
        .split('\n')
        .map((l) => l.trimEnd())
        .join('\n');
    setHtml(cleanLines(html));
    setCss(cleanLines(css));
    setJs(cleanLines(js));
  };

  const handleReset = () => {
    if (confirm('Reset workspace to an empty project?')) {
      setHtml('');
      setCss('');
      setJs('');
      setLogs([]);
      handleRun();
    }
  };

  const handleSelectTemplate = (key: string) => {
    const tpl = TEMPLATES[key];
    if (tpl) {
      setHtml(tpl.html);
      setCss(tpl.css);
      setJs(tpl.js);
      if (tpl.requiredCdns) {
        setSelectedCdns((prev) => Array.from(new Set([...prev, ...(tpl.requiredCdns || [])])));
      }
      setLogs([]);
      handleRun();
    }
  };

  const handleToggleCdn = (url: string) => {
    setSelectedCdns((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleAddCustomCdn = (url: string) => {
    if (!customCdns.includes(url)) {
      setCustomCdns((prev) => [...prev, url]);
    }
  };

  const handleRemoveCustomCdn = (url: string) => {
    setCustomCdns((prev) => prev.filter((u) => u !== url));
  };

  const handleExportHtml = () => {
    downloadHtmlFile(compiledHtml, 'web-compiler-project.html');
  };

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-surface-darker text-slate-100">
      <Header
        layout={layout}
        setLayout={setLayout}
        autoRun={autoRun}
        setAutoRun={setAutoRun}
        onRun={handleRun}
        onFormat={handleFormat}
        onReset={handleReset}
        onSelectTemplate={handleSelectTemplate}
        onOpenLibraries={() => setIsLibrariesOpen(true)}
        activeLibsCount={allCdns.length}
        onExportHtml={handleExportHtml}
      />

      <div
        className={`flex-1 flex min-h-0 overflow-hidden ${
          layout === 'stacked'
            ? 'flex-col divide-y divide-surface-border'
            : 'flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-surface-border'
        }`}
      >
        {/* Editor Area (Half or 55%) */}
        <div
          className={`${
            layout === 'stacked' ? 'h-1/2' : 'h-1/2 lg:h-full lg:w-[50%]'
          } flex flex-col min-h-0 min-w-0`}
        >
          <EditorPanes
            layout={layout}
            html={html}
            setHtml={setHtml}
            css={css}
            setCss={setCss}
            js={js}
            setJs={setJs}
          />
        </div>

        {/* Live Preview Area (Half or 50%) */}
        <div
          className={`${
            layout === 'stacked' ? 'h-1/2' : 'h-1/2 lg:h-full lg:w-[50%]'
          } flex flex-col min-h-0 min-w-0`}
        >
          <PreviewSection
            fullHtml={compiledHtml}
            onRefresh={handleRun}
            logs={logs}
            onClearLogs={() => setLogs([])}
          />
        </div>
      </div>

      <LibrariesModal
        isOpen={isLibrariesOpen}
        onClose={() => setIsLibrariesOpen(false)}
        selectedCdns={selectedCdns}
        onToggleCdn={handleToggleCdn}
        customCdns={customCdns}
        onAddCustomCdn={handleAddCustomCdn}
        onRemoveCustomCdn={handleRemoveCustomCdn}
      />
    </main>
  );
}
