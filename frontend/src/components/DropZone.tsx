import { useCallback, useState } from 'react';
import { Upload, FileText, Image, X, CheckCircle2 } from 'lucide-react';
import { MOCK_DOCUMENT } from '@/lib/mockData';

interface DropZoneProps {
  onFileReady: (doc: typeof MOCK_DOCUMENT) => void;
}

export default function DropZone({ onFileReady }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDone, setIsDone] = useState(false);

  const simulateUpload = useCallback(
    (file: File) => {
      setUploadedFile(file);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
        onFileReady(MOCK_DOCUMENT);
      }, 1800);
    },
    [onFileReady]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) simulateUpload(file);
    },
    [simulateUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) simulateUpload(file);
    },
    [simulateUpload]
  );

  const reset = () => {
    setUploadedFile(null);
    setIsDone(false);
    setIsProcessing(false);
  };

  const isPdf = uploadedFile?.type?.includes('pdf');

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
        Document Upload
      </label>

      {!uploadedFile ? (
        <label
          htmlFor="file-upload"
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer
            transition-all duration-300 group
            ${isDragOver
              ? 'border-blue-400 bg-blue-400/5 scale-[1.01]'
              : 'border-slate-700 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50'
            }
          `}
        >
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleChange}
          />
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDragOver ? 'bg-blue-500/20 scale-110' : 'bg-slate-700/50 group-hover:bg-slate-700'}
          `}>
            <Upload className={`w-6 h-6 transition-colors ${isDragOver ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
          </div>
          <div className="text-center">
            <p className={`text-sm font-medium transition-colors ${isDragOver ? 'text-blue-300' : 'text-slate-300'}`}>
              {isDragOver ? 'Drop to upload' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG up to 50 MB</p>
          </div>
          {isDragOver && (
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse pointer-events-none" />
          )}
        </label>
      ) : (
        <div className={`
          flex items-center gap-3 p-4 rounded-2xl border transition-all duration-500
          ${isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-800/60 border-slate-700'}
        `}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-emerald-500/15' : 'bg-slate-700'}`}>
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : isDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : isPdf ? (
              <FileText className="w-5 h-5 text-red-400" />
            ) : (
              <Image className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{uploadedFile.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isProcessing ? (
                <span className="text-blue-400 animate-pulse">Processing document…</span>
              ) : isDone ? (
                <span className="text-emerald-400">Ready · {(uploadedFile.size / 1024).toFixed(0)} KB</span>
              ) : (
                `${(uploadedFile.size / 1024).toFixed(0)} KB`
              )}
            </p>
          </div>
          {isDone && (
            <button onClick={reset} className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-500 hover:text-slate-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
