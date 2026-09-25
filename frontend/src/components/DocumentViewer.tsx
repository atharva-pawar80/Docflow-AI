import { useState } from 'react';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2 } from 'lucide-react';
import { MOCK_DOCUMENT } from '@/lib/mockData';

interface DocumentViewerProps {
  visible: boolean;
}

export default function DocumentViewer({ visible }: DocumentViewerProps) {
  const [page, setPage] = useState(1);

  if (!visible) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-600">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
          <FileText className="w-7 h-7" />
        </div>
        <p className="text-sm font-medium">Upload a document to preview it here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in-up">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-200 truncate max-w-[180px]">{MOCK_DOCUMENT.name}</p>
            <p className="text-[10px] text-slate-500">{MOCK_DOCUMENT.size} · {MOCK_DOCUMENT.pages} pages</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {([ZoomOut, ZoomIn, Maximize2, Download] as const).map((Icon, i) => (
            <button key={i} className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-500 hover:text-slate-300 transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* PDF mock viewer */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center p-6">
        {/* Simulated white page */}
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm h-full max-h-[420px] p-7 flex flex-col gap-4 relative overflow-hidden">
          {/* Header row */}
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <div className="w-20 h-5 bg-slate-800 rounded" />
              <div className="w-14 h-2.5 bg-slate-300 rounded" />
            </div>
            <div className="text-right space-y-1.5">
              <div className="w-24 h-4 bg-slate-200 rounded ml-auto" />
              <div className="w-32 h-2.5 bg-slate-200 rounded ml-auto" />
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Billing columns */}
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((col) => (
              <div key={col} className="space-y-1.5">
                <div className="w-14 h-2.5 bg-slate-400 rounded" />
                <div className="w-full h-2 bg-slate-200 rounded" />
                <div className="w-4/5 h-2 bg-slate-200 rounded" />
                <div className="w-3/5 h-2 bg-slate-200 rounded" />
              </div>
            ))}
          </div>

          {/* Line items */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-1.5">
              {[0, 1, 2, 3].map((h) => (
                <div key={h} className="h-2.5 bg-slate-400 rounded w-4/5" />
              ))}
            </div>
            {[0, 1, 2].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-2 py-1">
                {[0, 1, 2, 3].map((col) => (
                  <div key={col} className={`h-2 rounded bg-slate-200 ${col === 0 ? 'w-full' : 'w-3/5'}`} />
                ))}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="ml-auto w-40 space-y-1.5 mt-auto">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className={`h-2 rounded bg-slate-200 ${i === 2 ? 'w-12' : 'w-10'}`} />
                <div className={`h-2 rounded ${i === 2 ? 'bg-slate-700 w-16' : 'bg-slate-200 w-12'}`} />
              </div>
            ))}
          </div>

          {/* Page label */}
          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400">
            Page {page} / {MOCK_DOCUMENT.pages}
          </div>
        </div>

        {/* Overlay badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/50 text-xs text-slate-400 pointer-events-none">
          Page {page} of {MOCK_DOCUMENT.pages}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-slate-300" />
        </button>
        <span className="text-xs text-slate-500 font-medium">{page} / {MOCK_DOCUMENT.pages}</span>
        <button
          onClick={() => setPage((p) => Math.min(MOCK_DOCUMENT.pages, p + 1))}
          disabled={page === MOCK_DOCUMENT.pages}
          className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
}
