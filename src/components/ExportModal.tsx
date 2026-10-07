import React, { useState } from 'react';
import { VanillaProject } from '../types';
import { downloadProjectAsZip, downloadSingleHtml, prepareStandaloneHtml } from '../utils/zipExport';
import { Download, FileCode, Archive, Check, Copy, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VanillaProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState(false);

  if (!isOpen) return null;

  const handleZipDownload = async () => {
    try {
      setDownloadingZip(true);
      await downloadProjectAsZip(project);
    } catch (e) {
      console.error('ZIP export error:', e);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleSingleHtmlDownload = () => {
    downloadSingleHtml(project);
  };

  const handleCopySingleCode = () => {
    const fullHtml = prepareStandaloneHtml(project);
    navigator.clipboard.writeText(fullHtml);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Export Offline Project</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-5 space-y-4">
          <div className="text-xs text-slate-300 leading-relaxed">
            All files are 100% offline and standalone. No node_modules, build steps, or internet connection are required to run them on any computer.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Standard Multi-file ZIP Option */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                  <Archive className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100 mb-1">Standard ZIP Package</h4>
                <p className="text-[11px] text-slate-400 mb-3 leading-normal">
                  Clean directory with separated <code>index.html</code>, <code>styles.css</code>, and <code>script.js</code>.
                </p>
              </div>

              <button
                onClick={handleZipDownload}
                disabled={downloadingZip}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingZip ? 'Packaging...' : 'Download ZIP'}</span>
              </button>
            </div>

            {/* Single HTML Option */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5">
                  <FileCode className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100 mb-1">Single Standalone .html</h4>
                <p className="text-[11px] text-slate-400 mb-3 leading-normal">
                  Everything bundled inside a single file with embedded &lt;style&gt; and &lt;script&gt; tags.
                </p>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={handleSingleHtmlDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .html</span>
                </button>
                <button
                  onClick={handleCopySingleCode}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors shrink-0"
                  title="Copy full HTML code to clipboard"
                >
                  {copiedSingle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-md p-3 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Offline Portability:</span> Unzip anywhere or double-click the HTML file. It will launch immediately in Chrome, Edge, Safari, or Firefox without any web server setup.
          </div>
        </div>
      </div>
    </div>
  );
};
