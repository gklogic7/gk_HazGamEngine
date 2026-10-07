import React, { useState } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  Download,
  FolderOpen,
  Plus,
  BookOpen,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  WifiOff,
  Copy,
  ChevronDown
} from 'lucide-react';
import { VanillaProject, DeviceViewport } from '../types';

interface NavbarProps {
  projects: VanillaProject[];
  activeProject: VanillaProject;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDuplicateProject: () => void;
  onOpenManager: () => void;
  onRunPreview: () => void;
  autoRun: boolean;
  onToggleAutoRun: () => void;
  viewport: DeviceViewport;
  onChangeViewport: (v: DeviceViewport) => void;
  onOpenSnippets: () => void;
  onOpenCheatSheet: () => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onNewProject,
  onDuplicateProject,
  onOpenManager,
  onRunPreview,
  autoRun,
  onToggleAutoRun,
  viewport,
  onChangeViewport,
  onOpenSnippets,
  onOpenCheatSheet,
  onOpenExport
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 select-none">
      {/* Brand & Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-sm tracking-wide text-slate-100">VanillaLab</span>
              <span className="text-[10px] uppercase font-semibold text-emerald-400 flex items-center gap-1">
                <WifiOff className="w-3 h-3 inline" /> Offline
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Pure HTML · CSS · JS</div>
          </div>
        </div>

        {/* Project Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors max-w-[200px] sm:max-w-[260px]"
          >
            <span className="truncate">{activeProject.title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {projectDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProjectDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1.5 z-50 text-xs divide-y divide-slate-800">
                <div className="max-h-64 overflow-y-auto py-1">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Vanilla Projects
                  </div>
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        onSelectProject(proj.id);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex flex-col hover:bg-slate-800 transition-colors ${
                        proj.id === activeProject.id ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-400' : 'text-slate-300'
                      }`}
                    >
                      <span className="font-medium truncate">{proj.title}</span>
                      <span className="text-[10px] text-slate-400 truncate mt-0.5">
                        {proj.description}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-1.5 flex gap-1 bg-slate-950/60">
                  <button
                    onClick={() => {
                      onNewProject();
                      setProjectDropdownOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-sky-400" /> New Blank
                  </button>
                  <button
                    onClick={() => {
                      onOpenManager();
                      setProjectDropdownOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                    title="Manage all projects"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-slate-400" /> All
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Duplicate */}
        <button
          onClick={onDuplicateProject}
          title="Clone current project"
          className="hidden md:flex items-center gap-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 py-1 rounded text-xs transition-colors border border-transparent hover:border-slate-700"
        >
          <Copy className="w-3.5 h-3.5" /> Clone
        </button>
      </div>

      {/* Middle: Viewport Switcher & Run Controls */}
      <div className="flex items-center gap-2">
        {/* Run Button */}
        <button
          onClick={onRunPreview}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-medium px-3 py-1.5 rounded-md text-xs shadow-sm transition-all active:scale-95"
          title="Run Code in Live Preview (Ctrl+S or Ctrl+Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run</span>
        </button>

        {/* Auto-run toggle */}
        <button
          onClick={onToggleAutoRun}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
            autoRun
              ? 'bg-slate-800/80 border-slate-700 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
          }`}
          title="Toggle live auto-reloading when typing"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${autoRun ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span>Auto-run</span>
        </button>

        {/* Viewport Modes */}
        <div className="hidden lg:flex items-center bg-slate-950 p-0.5 rounded-md border border-slate-800">
          <button
            onClick={() => onChangeViewport('desktop')}
            title="Desktop Mode"
            className={`p-1.5 rounded text-xs transition-colors ${
              viewport === 'desktop' ? 'bg-slate-800 text-sky-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewport('tablet')}
            title="Tablet View (768px)"
            className={`p-1.5 rounded text-xs transition-colors ${
              viewport === 'tablet' ? 'bg-slate-800 text-sky-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewport('mobile')}
            title="Mobile View (375px)"
            className={`p-1.5 rounded text-xs transition-colors ${
              viewport === 'mobile' ? 'bg-slate-800 text-sky-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Tools: Snippets, Cheat Sheet, Export */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenSnippets}
          className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 px-2.5 py-1.5 rounded-md text-xs transition-colors"
          title="Insert Vanilla HTML/CSS/JS Snippets"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Snippets</span>
        </button>

        <button
          onClick={onOpenCheatSheet}
          className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 px-2.5 py-1.5 rounded-md text-xs transition-colors"
          title="Vanilla Web API Cheat Sheet"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Cheat Sheet</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-colors shadow-sm"
          title="Export Project as ZIP or Single HTML file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
