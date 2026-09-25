import { useEffect, useState } from 'react';
import { Brain, Tag, BarChart2, Cpu, CheckCircle2 } from 'lucide-react';
import { MOCK_CLASSIFICATION } from '@/lib/mockData';

interface MLClassificationCardProps {
  visible: boolean;
}

const colorMap: Record<string, string> = {
  blue:   'bg-blue-500/15 text-blue-300 border-blue-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  emerald:'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber:  'bg-amber-500/15 text-amber-300 border-amber-500/30',
};

const barColorMap: Record<string, string> = {
  blue:   'from-blue-500 to-blue-400',
  violet: 'from-violet-500 to-violet-400',
  emerald:'from-emerald-500 to-emerald-400',
  amber:  'from-amber-500 to-amber-400',
};

export default function MLClassificationCard({ visible }: MLClassificationCardProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [animatedBars, setAnimatedBars] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setAnimatedConfidence(MOCK_CLASSIFICATION.confidence);
      setAnimatedBars(MOCK_CLASSIFICATION.topClasses.map((c) => c.score));
    }, 150);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          ML Classification
        </label>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Complete
        </div>
      </div>

      {/* Main result */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/8 to-violet-500/8 border border-blue-500/20 p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Predicted Label</p>
              <p className="text-xl font-bold text-white mt-0.5">{MOCK_CLASSIFICATION.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Confidence</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {(animatedConfidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000 ease-out"
            style={{ width: `${animatedConfidence * 100}%` }}
          />
        </div>

        {/* Model badge */}
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500">{MOCK_CLASSIFICATION.model}</span>
          <span className="text-slate-700">·</span>
          <span className="text-xs text-slate-500">{MOCK_CLASSIFICATION.latencyMs} ms</span>
        </div>
      </div>

      {/* Class distribution */}
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 className="w-4 h-4 text-slate-400" />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Class Distribution</p>
        </div>
        {MOCK_CLASSIFICATION.topClasses.map((cls, i) => (
          <div key={cls.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorMap[cls.color]}`}>
                {cls.name}
              </span>
              <span className="text-xs font-mono text-slate-400">{(cls.score * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${barColorMap[cls.color]} transition-all duration-700 ease-out`}
                style={{ width: `${animatedBars[i] * 100}%`, transitionDelay: `${i * 120}ms` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top features */}
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-slate-400" />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Top TF-IDF Features</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOCK_CLASSIFICATION.features.map((f) => (
            <span key={f} className="text-xs px-2.5 py-1 rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-300 font-mono">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
