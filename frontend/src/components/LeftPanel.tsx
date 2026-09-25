import { useCallback, useState } from 'react';
import DropZone from './DropZone';
import MLClassificationCard from './MLClassificationCard';
import LatencyMetrics from './LatencyMetrics';
import { MOCK_DOCUMENT } from '@/lib/mockData';
import { BrainCircuit } from 'lucide-react';

interface LeftPanelProps {
  onDocumentReady: () => void;
}

export default function LeftPanel({ onDocumentReady }: LeftPanelProps) {
  const [docLoaded, setDocLoaded] = useState(false);

  const handleFileReady = useCallback(
    (_doc: typeof MOCK_DOCUMENT) => {
      setDocLoaded(true);
      onDocumentReady();
    },
    [onDocumentReady]
  );

  return (
    <aside className="w-[400px] min-w-[320px] flex flex-col gap-5 overflow-y-auto pr-1 scrollbar-thin">
      {/* Panel header */}
      <div className="flex items-center gap-2.5 pt-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Document Analysis</h2>
          <p className="text-xs text-slate-500">Classification & Metrics</p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <DropZone onFileReady={handleFileReady} />
      </div>

      {/* Classification result */}
      {docLoaded && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <MLClassificationCard visible={docLoaded} />
        </div>
      )}

      {/* Latency metrics */}
      {docLoaded && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <LatencyMetrics visible={docLoaded} />
        </div>
      )}
    </aside>
  );
}
