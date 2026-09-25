import { FileSearch, MessageCircle } from 'lucide-react';
import DocumentViewer from './DocumentViewer';
import RAGChat from './RAGChat';

interface RightPanelProps {
  docVisible: boolean;
}

export default function RightPanel({ docVisible }: RightPanelProps) {
  return (
    <div className="flex-1 flex flex-col gap-5 min-w-0 min-h-0">
      {/* Top: Document Viewer */}
      <div className="flex-1 min-h-0 flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <div className="flex items-center gap-2.5 mb-4 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
            <FileSearch className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Document Viewer</h2>
            <p className="text-xs text-slate-500">PDF & Image Preview</p>
          </div>
        </div>
        <DocumentViewer visible={docVisible} />
      </div>

      {/* Bottom: RAG Chat */}
      <div className="flex-1 min-h-0 flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <div className="flex items-center gap-2.5 mb-4 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">RAG Chat</h2>
            <p className="text-xs text-slate-500">Retrieval-Augmented QA · source attribution</p>
          </div>
        </div>
        <RAGChat visible={docVisible} />
      </div>
    </div>
  );
}
