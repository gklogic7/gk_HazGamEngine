import React, { useState } from 'react';
import { CHEAT_SHEETS, CheatSheetSection } from '../data/cheatsheets';
import { BookOpen, Search, Copy, Check, X } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'JavaScript' | 'CSS' | 'HTML'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSections = CHEAT_SHEETS.filter((section) => {
    if (activeCategory !== 'All' && section.category !== activeCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const titleMatch = section.title.toLowerCase().includes(q);
    const itemMatch = section.items.some(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.syntax.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q)
    );
    return titleMatch || itemMatch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Pure Web Standards Cheat Sheet</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search native APIs & methods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-1 w-full sm:w-auto">
            {(['All', 'JavaScript', 'CSS', 'HTML'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sections Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">No reference items match your search.</div>
          ) : (
            filteredSections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{section.title}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/60">
                    {section.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between group hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
                          <span>{item.name}</span>
                          <button
                            onClick={() => handleCopy(item.syntax)}
                            className="p-1 rounded text-slate-500 hover:text-slate-300 opacity-60 group-hover:opacity-100 transition-all"
                            title="Copy syntax"
                          >
                            {copiedText === item.syntax ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{item.note}</p>
                      </div>
                      <pre className="bg-slate-900 border border-slate-800/80 rounded p-1.5 text-[11px] font-mono text-sky-300 overflow-x-auto whitespace-pre">
                        <code>{item.syntax}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
