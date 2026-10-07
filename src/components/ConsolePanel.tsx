import React, { useState, useRef, useEffect } from 'react';
import { ConsoleLogMessage } from '../types';
import { Terminal, Trash2, AlertCircle, AlertTriangle, Info, ChevronRight, X } from 'lucide-react';

interface ConsolePanelProps {
  logs: ConsoleLogMessage[];
  onClearLogs: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onExecuteCommand: (code: string) => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  logs,
  onClearLogs,
  isOpen,
  onToggleOpen,
  onExecuteCommand,
}) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'log'>('all');
  const [command, setCommand] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  const errorCount = logs.filter((l) => l.type === 'error').length;
  const warnCount = logs.filter((l) => l.type === 'warn').length;

  const filteredLogs = logs.filter((l) => {
    if (filter === 'all') return true;
    if (filter === 'error') return l.type === 'error';
    if (filter === 'warn') return l.type === 'warn';
    if (filter === 'log') return l.type === 'log' || l.type === 'info';
    return true;
  });

  useEffect(() => {
    if (isOpen && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const handleSubmitCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    onExecuteCommand(command.trim());
    setCommand('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="h-8 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors shrink-0"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-medium">Console</span>
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errorCount}
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
              <AlertTriangle className="w-3 h-3" /> {warnCount}
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500">Click to open</span>
      </button>
    );
  }

  return (
    <div className="h-56 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0">
      {/* Console Header Bar */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200">Console</span>

          {/* Filter buttons */}
          <div className="flex items-center gap-1 ml-2 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'all' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'error' ? 'bg-rose-950/60 text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Errors ({errorCount})
            </button>
            <button
              onClick={() => setFilter('warn')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'warn' ? 'bg-amber-950/60 text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Warnings ({warnCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearLogs}
            className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleOpen}
            className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title="Close Console"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Output List */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-[12px] leading-5 space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 italic py-2 px-1 text-xs">
            No console output yet. Call <code>console.log()</code> in your JavaScript to inspect values.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isErr = log.type === 'error';
            const isWarn = log.type === 'warn';
            const isInfo = log.type === 'info';

            return (
              <div
                key={log.id}
                className={`flex items-start gap-2 py-1 px-2 rounded border ${
                  isErr
                    ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                    : isInfo
                    ? 'bg-sky-950/20 border-sky-900/40 text-sky-300'
                    : 'bg-slate-900/40 border-slate-800/40 text-slate-300'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {isErr ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ) : isInfo ? (
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </span>
                <span className="flex-1 break-words whitespace-pre-wrap">{log.content}</span>
                <span className="text-[10px] text-slate-600 shrink-0 select-none">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>

      {/* REPL Input Line */}
      <form
        onSubmit={handleSubmitCommand}
        className="h-8 bg-slate-900/90 border-t border-slate-800 px-2 flex items-center gap-1.5 shrink-0"
      >
        <span className="text-sky-400 font-mono text-xs font-bold">&gt;</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Evaluate vanilla JavaScript expression (e.g. document.title, 42 * 7)..."
          className="flex-1 bg-transparent text-slate-200 text-xs font-mono focus:outline-none placeholder:text-slate-600"
        />
      </form>
    </div>
  );
};
