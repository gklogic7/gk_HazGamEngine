import React, { useState } from 'react';
import { VanillaProject } from '../types';
import { Folder, Plus, Trash2, Copy, FileText, Check, X, RotateCcw, Upload } from 'lucide-react';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: VanillaProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (title: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onResetDefaults: () => void;
  onImportProject: (project: VanillaProject) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onResetDefaults,
  onImportProject,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateProject(newTitle.trim());
    setNewTitle('');
    setIsCreating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      const title = file.name.replace(/\.[^/.]+$/, '');
      const isHtml = file.name.endsWith('.html') || file.name.endsWith('.htm');
      const isCss = file.name.endsWith('.css');
      const isJs = file.name.endsWith('.js');

      const newProj: VanillaProject = {
        id: 'imported-' + Date.now(),
        title: title || 'Imported Project',
        description: `Imported from ${file.name}`,
        category: 'starter',
        icon: 'Code2',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isCustom: true,
        html: isHtml ? content : '<!-- HTML Content -->\n<div class="content">Imported Document</div>',
        css: isCss ? content : '/* Custom Styles */\nbody { font-family: sans-serif; padding: 20px; }',
        js: isJs ? content : '// Custom Logic\nconsole.log("Imported project ready");',
      };

      onImportProject(newProj);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">Project Manager</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            ) : (
              <form onSubmit={handleCreate} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Project name..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500 w-44"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-sky-600 text-white text-xs font-medium"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 text-xs"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Import single file button */}
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium cursor-pointer transition-colors border border-slate-700/60">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import File</span>
              <input
                type="file"
                accept=".html,.htm,.css,.js,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset all projects to original vanilla templates?')) {
                onResetDefaults();
              }
            }}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            title="Restore original preset projects"
          >
            <RotateCcw className="w-3 h-3" /> Reset Presets
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  isActive
                    ? 'bg-sky-950/20 border-sky-800/80 shadow-xs'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="flex-1 cursor-pointer min-w-0"
                  onClick={() => {
                    onSelectProject(proj.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">{proj.title}</h4>
                    {isActive && (
                      <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{proj.description}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onDuplicateProject(proj.id)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Clone project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${proj.title}"?`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="p-1.5 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
