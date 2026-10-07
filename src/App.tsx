/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  VanillaProject,
  ActiveTab,
  DeviceViewport,
  ConsoleLogMessage,
} from './types';
import {
  getStoredProjects,
  saveStoredProjects,
  getActiveProjectId,
  setActiveProjectId,
  createBlankProject,
} from './utils/storage';
import { DEFAULT_PROJECTS } from './data/defaultProjects';
import { Navbar } from './components/Navbar';
import { CodeEditor } from './components/CodeEditor';
import { LivePreview } from './components/LivePreview';
import { ConsolePanel } from './components/ConsolePanel';
import { SnippetsModal } from './components/SnippetsModal';
import { CheatSheetModal } from './components/CheatSheetModal';
import { ExportModal } from './components/ExportModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { Code2, Eye, SplitSquareVertical } from 'lucide-react';

export default function App() {
  // State
  const [projects, setProjects] = useState<VanillaProject[]>(() => getStoredProjects());
  const [activeProjectId, setCurrentActiveId] = useState<string>(() =>
    getActiveProjectId(projects)
  );

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECTS[0];

  const [activeTab, setActiveTab] = useState<ActiveTab>('html');
  const [viewport, setViewport] = useState<DeviceViewport>('responsive');
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [runTrigger, setRunTrigger] = useState<number>(Date.now());

  // Mobile View Toggle: 'split' | 'code' | 'preview'
  const [mobileView, setMobileView] = useState<'code' | 'preview'>('code');

  // Console State
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogMessage[]>([]);
  const [consoleOpen, setConsoleOpen] = useState<boolean>(false);

  // Modals
  const [snippetsOpen, setSnippetsOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  // Sync projects to storage
  useEffect(() => {
    saveStoredProjects(projects);
  }, [projects]);

  // Sync active project id
  useEffect(() => {
    setActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  // Debounced auto-run timer
  const autoRunTimerRef = useRef<number | null>(null);

  const triggerRun = useCallback(() => {
    setRunTrigger(Date.now());
  }, []);

  const handleUpdateCode = (tab: ActiveTab, newCode: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          [tab]: newCode,
          updatedAt: Date.now(),
        };
      })
    );

    if (autoRun) {
      if (autoRunTimerRef.current) clearTimeout(autoRunTimerRef.current);
      autoRunTimerRef.current = window.setTimeout(() => {
        triggerRun();
      }, 500);
    }
  };

  const handleSelectProject = (id: string) => {
    setCurrentActiveId(id);
    setConsoleLogs([]);
    triggerRun();
  };

  const handleNewProject = () => {
    const blank = createBlankProject(`Vanilla Project ${projects.length + 1}`);
    setProjects((prev) => [blank, ...prev]);
    setCurrentActiveId(blank.id);
    setConsoleLogs([]);
    triggerRun();
  };

  const handleDuplicateProject = () => {
    const clone: VanillaProject = {
      ...activeProject,
      id: 'proj-' + Date.now(),
      title: `${activeProject.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isCustom: true,
    };
    setProjects((prev) => [clone, ...prev]);
    setCurrentActiveId(clone.id);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activeProjectId === id && filtered.length > 0) {
        setCurrentActiveId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleResetDefaults = () => {
    setProjects(DEFAULT_PROJECTS);
    setCurrentActiveId(DEFAULT_PROJECTS[0].id);
    setConsoleLogs([]);
    triggerRun();
  };

  const handleImportProject = (imported: VanillaProject) => {
    setProjects((prev) => [imported, ...prev]);
    setCurrentActiveId(imported.id);
    setManagerOpen(false);
    triggerRun();
  };

  const handleConsoleLog = useCallback(
    (level: 'log' | 'info' | 'warn' | 'error', message: string) => {
      setConsoleLogs((prev) => [
        ...prev.slice(-150),
        {
          id: 'log-' + Date.now() + '-' + Math.random(),
          type: level,
          content: message,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  const handleClearLogs = () => {
    setConsoleLogs([]);
  };

  const handleExecuteCommand = (cmd: string) => {
    // Add command to console as log
    handleConsoleLog('info', `> ${cmd}`);
    try {
      // Evaluate command in preview context
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        const result = (iframe.contentWindow as any).eval(cmd);
        handleConsoleLog('log', String(result));
      } else {
        handleConsoleLog('warn', 'Preview window not ready.');
      }
    } catch (err: any) {
      handleConsoleLog('error', err.message || String(err));
    }
  };

  const handleInsertSnippet = (code: string, target: ActiveTab) => {
    setActiveTab(target);
    const currentContent = activeProject[target];
    const newContent = currentContent ? `${currentContent}\n\n${code}` : code;
    handleUpdateCode(target, newContent);
    triggerRun();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onDuplicateProject={handleDuplicateProject}
        onOpenManager={() => setManagerOpen(true)}
        onRunPreview={triggerRun}
        autoRun={autoRun}
        onToggleAutoRun={() => setAutoRun(!autoRun)}
        viewport={viewport}
        onChangeViewport={setViewport}
        onOpenSnippets={() => setSnippetsOpen(true)}
        onOpenCheatSheet={() => setCheatSheetOpen(true)}
        onOpenExport={() => setExportOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Mobile View Switcher */}
        <div className="md:hidden h-9 bg-slate-900 border-b border-slate-800 flex items-center justify-around text-xs shrink-0">
          <button
            onClick={() => setMobileView('code')}
            className={`flex-1 h-full flex items-center justify-center gap-1.5 font-medium ${
              mobileView === 'code' ? 'bg-slate-950 text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 h-full flex items-center justify-center gap-1.5 font-medium ${
              mobileView === 'preview' ? 'bg-slate-950 text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Code Editor Pane */}
        <div
          className={`flex-1 flex flex-col min-h-0 ${
            mobileView === 'code' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <CodeEditor
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            html={activeProject.html}
            css={activeProject.css}
            js={activeProject.js}
            onUpdateCode={handleUpdateCode}
            onRun={triggerRun}
          />
        </div>

        {/* Live Preview Pane */}
        <div
          className={`flex-1 flex flex-col min-h-0 border-l border-slate-800 ${
            mobileView === 'preview' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <LivePreview
            html={activeProject.html}
            css={activeProject.css}
            js={activeProject.js}
            viewport={viewport}
            onConsoleLog={handleConsoleLog}
            runTrigger={runTrigger}
          />
        </div>
      </div>

      {/* DevTools Console Drawer at Bottom */}
      <ConsolePanel
        logs={consoleLogs}
        onClearLogs={handleClearLogs}
        isOpen={consoleOpen}
        onToggleOpen={() => setConsoleOpen(!consoleOpen)}
        onExecuteCommand={handleExecuteCommand}
      />

      {/* Modals */}
      <SnippetsModal
        isOpen={snippetsOpen}
        onClose={() => setSnippetsOpen(false)}
        onInsertSnippet={handleInsertSnippet}
        activeTab={activeTab}
      />

      <CheatSheetModal
        isOpen={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
      />

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        project={activeProject}
      />

      <ProjectManagerModal
        isOpen={managerOpen}
        onClose={() => setManagerOpen(false)}
        projects={projects}
        activeProjectId={activeProject.id}
        onSelectProject={handleSelectProject}
        onCreateProject={(title) => {
          const blank = createBlankProject(title);
          setProjects((prev) => [blank, ...prev]);
          setCurrentActiveId(blank.id);
          triggerRun();
        }}
        onDuplicateProject={(id) => {
          const target = projects.find((p) => p.id === id);
          if (target) {
            const clone = {
              ...target,
              id: 'proj-' + Date.now(),
              title: `${target.title} (Copy)`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              isCustom: true,
            };
            setProjects((prev) => [clone, ...prev]);
            setCurrentActiveId(clone.id);
          }
        }}
        onDeleteProject={handleDeleteProject}
        onResetDefaults={handleResetDefaults}
        onImportProject={handleImportProject}
      />
    </div>
  );
}
