import React, { useState } from 'react';
import { CODE_SNIPPETS } from '../data/snippets';
import { CodeSnippet, ActiveTab } from '../types';
import { Search, Sparkles, Plus, Copy, Check, X } from 'lucide-react';

interface SnippetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (code: string, target: ActiveTab) => void;
  activeTab: ActiveTab;
}

export const SnippetsModal: React.FC<SnippetsModalProps> = ({
  isOpen,
  onClose,
  onInsertSnippet,
  activeTab,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(CODE_SNIPPETS.map((s) => s.category)))];

  const filteredSnippets = CODE_SNIPPETS.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesQuery =
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCopy = (snippet: CodeSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Vanilla Snippets Library</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vanilla snippets (e.g. grid, audio, localStorage)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Snippets' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Snippet List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">No matching snippets found.</div>
          ) : (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{snippet.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{snippet.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(snippet)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      title="Copy snippet"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onInsertSnippet(snippet.code, snippet.target);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
                      title={`Insert into ${snippet.target.toUpperCase()}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert</span>
                    </button>
                  </div>
                </div>

                {/* Code Preview */}
                <pre className="bg-slate-900 border border-slate-800/80 rounded p-2 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-24">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
