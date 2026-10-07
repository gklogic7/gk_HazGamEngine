import React, { useEffect, useRef, useState } from 'react';
import { DeviceViewport } from '../types';
import { RotateCcw, ExternalLink, Maximize2, Minimize2, Eye } from 'lucide-react';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
  viewport: DeviceViewport;
  onConsoleLog: (level: 'log' | 'info' | 'warn' | 'error', message: string) => void;
  runTrigger: number;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  html,
  css,
  js,
  viewport,
  onConsoleLog,
  runTrigger,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<number>(Date.now());

  // Build the complete iframe document with styles, scripts, and console proxy
  const buildIframeDoc = () => {
    let pageHtml = html;

    if (!pageHtml.includes('<html') && !pageHtml.includes('<!DOCTYPE')) {
      pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
</head>
<body>
${pageHtml}
</body>
</html>`;
    }

    // Console Interceptor Script
    const interceptorScript = `
    <script>
      (function() {
        const _formatArg = (arg) => {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (typeof arg === 'object') {
            try { return JSON.stringify(arg); } catch(e) { return String(arg); }
          }
          return String(arg);
        };

        const _send = (level, args) => {
          try {
            const formatted = Array.from(args).map(_formatArg).join(' ');
            window.parent.postMessage({
              source: 'vanillalab_preview',
              level: level,
              message: formatted,
              timestamp: Date.now()
            }, '*');
          } catch(e) {}
        };

        const _origLog = console.log;
        const _origWarn = console.warn;
        const _origError = console.error;
        const _origInfo = console.info;

        console.log = function() { _send('log', arguments); _origLog.apply(console, arguments); };
        console.warn = function() { _send('warn', arguments); _origWarn.apply(console, arguments); };
        console.error = function() { _send('error', arguments); _origError.apply(console, arguments); };
        console.info = function() { _send('info', arguments); _origInfo.apply(console, arguments); };

        window.onerror = function(msg, url, lineNo, columnNo, error) {
          _send('error', ['[Uncaught Error]', msg, '(Line: ' + lineNo + ')']);
          return false;
        };
      })();
    </script>
    `;

    // Inject Interceptor and CSS into head
    const styleTag = `<style>\n${css}\n</style>`;
    if (pageHtml.includes('</head>')) {
      pageHtml = pageHtml.replace('</head>', `${interceptorScript}\n${styleTag}\n</head>`);
    } else {
      pageHtml = `${interceptorScript}\n${styleTag}\n${pageHtml}`;
    }

    // Inject JS into body
    const scriptTag = `<script>\ntry {\n${js}\n} catch (err) {\n  console.error('[Runtime Error]:', err.message);\n}\n</script>`;
    if (pageHtml.includes('</body>')) {
      pageHtml = pageHtml.replace('</body>', `${scriptTag}\n</body>`);
    } else {
      pageHtml = `${pageHtml}\n${scriptTag}`;
    }

    return pageHtml;
  };

  // Listen to messages from the preview iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.source === 'vanillalab_preview') {
        onConsoleLog(e.data.level, e.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  const handleManualReload = () => {
    setLastRefreshed(Date.now());
  };

  const handleOpenInNewTab = () => {
    const fullHtml = buildIframeDoc();
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const iframeContent = buildIframeDoc();

  // Determine viewport width styles
  const getContainerStyle = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] shadow-2xl border border-slate-700 rounded-2xl overflow-hidden my-auto';
      case 'tablet':
        return 'w-[768px] h-[850px] shadow-2xl border border-slate-700 rounded-xl overflow-hidden my-auto';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div
      className={`flex flex-col bg-slate-900 ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-full'
      }`}
    >
      {/* Preview Header Bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200">Live Preview</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            ({viewport === 'mobile' ? '375×667' : viewport === 'tablet' ? '768×850' : '100% Responsive'})
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleManualReload}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="Reload preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Frame Canvas Wrapper */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-0 sm:p-2 overflow-auto">
        <div className={getContainerStyle()}>
          <iframe
            key={`${runTrigger}-${lastRefreshed}`}
            ref={iframeRef}
            srcDoc={iframeContent}
            title="Vanilla Preview"
            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
            className="w-full h-full bg-white border-0 block"
          />
        </div>
      </div>
    </div>
  );
};
