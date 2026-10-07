import React, { useRef, useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Copy, Check, Search, FileCode2, Code, Braces } from 'lucide-react';

interface CodeEditorProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  html: string;
  css: string;
  js: string;
  onUpdateCode: (tab: ActiveTab, newCode: string) => void;
  onRun: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeTab,
  onChangeTab,
  html,
  css,
  js,
  onUpdateCode,
  onRun,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState<number>(0);

  const activeCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;

  const lines = activeCode.split('\n');
  const lineCount = lines.length;

  // Handle Tab key press for 2 spaces indentation & Ctrl+S / Ctrl+Enter for Run
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'Enter')) {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + '  ' + val.substring(end);
      onUpdateCode(activeTab, updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Search match count
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMatches(0);
      return;
    }
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    const matches = activeCode.match(regex);
    setSearchMatches(matches ? matches.length : 0);
  }, [searchQuery, activeCode]);

  const getByteSize = (str: string) => {
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 select-none">
      {/* File Tabs Bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {/* HTML Tab */}
          <button
            onClick={() => onChangeTab('html')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs font-medium transition-colors border-b-2 ${
              activeTab === 'html'
                ? 'bg-slate-950 text-orange-400 border-orange-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-orange-500" />
            <span>index.html</span>
          </button>

          {/* CSS Tab */}
          <button
            onClick={() => onChangeTab('css')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs font-medium transition-colors border-b-2 ${
              activeTab === 'css'
                ? 'bg-slate-950 text-sky-400 border-sky-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
            }`}
          >
            <Braces className="w-3.5 h-3.5 text-sky-400" />
            <span>styles.css</span>
          </button>

          {/* JS Tab */}
          <button
            onClick={() => onChangeTab('js')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs font-medium transition-colors border-b-2 ${
              activeTab === 'js'
                ? 'bg-slate-950 text-amber-400 border-amber-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>script.js</span>
          </button>
        </div>

        {/* Editor Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-1.5 rounded text-xs transition-colors ${
              searchOpen ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Search in current file"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy file content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Optional Search Bar */}
      {searchOpen && (
        <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Find in file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs w-full focus:outline-none focus:border-sky-500"
              autoFocus
            />
          </div>
          <div className="text-[11px] text-slate-400">
            {searchQuery ? `${searchMatches} match${searchMatches === 1 ? '' : 'es'}` : ''}
          </div>
        </div>
      )}

      {/* Editor Main Canvas with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers */}
        <div
          className="w-12 py-3 bg-slate-950/80 text-right pr-3 font-mono text-[12px] leading-6 text-slate-600 select-none overflow-hidden shrink-0 border-r border-slate-900"
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={activeCode}
          onChange={(e) => onUpdateCode(activeTab, e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="flex-1 p-3 bg-transparent text-slate-200 font-mono text-[13px] leading-6 resize-none focus:outline-none overflow-auto whitespace-pre selection:bg-sky-500/30 select-text"
          placeholder={`Enter pure vanilla ${activeTab.toUpperCase()} code here...`}
        />
      </div>

      {/* Editor Status Bar */}
      <div className="h-6 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span>·</span>
          <span>{getByteSize(activeCode)}</span>
          <span>·</span>
          <span className="uppercase text-slate-400 font-semibold">{activeTab}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <span>Tab: 2 spaces</span>
          <span>·</span>
          <span>Ctrl+S to Run</span>
        </div>
      </div>
    </div>
  );
};
