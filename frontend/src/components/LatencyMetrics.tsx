import { Zap, Cpu, Database, Brain, Activity, Hash, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { ReactNode } from 'react';
import { MOCK_LATENCY } from '@/lib/mockData';

const iconMap: Record<string, ReactNode> = {
  Zap:      <Zap className="w-4 h-4" />,
  Cpu:      <Cpu className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Brain:    <Brain className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Hash:     <Hash className="w-4 h-4" />,
};

export default function LatencyMetrics({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
        Pipeline Latency
      </label>
      <div className="grid grid-cols-2 gap-2">
        {MOCK_LATENCY.map((metric, i) => (
          <MetricTile key={metric.label} metric={metric} isLast={i === MOCK_LATENCY.length - 1} />
        ))}
      </div>
    </div>
  );
}

function MetricTile({
  metric,
  isLast,
}: {
  metric: (typeof MOCK_LATENCY)[number];
  isLast: boolean;
}) {
  const trendIcon =
    metric.trend === 'down' ? (
      <TrendingDown className="w-3 h-3 text-emerald-400" />
    ) : metric.trend === 'up' ? (
      <TrendingUp className="w-3 h-3 text-red-400" />
    ) : (
      <Minus className="w-3 h-3 text-slate-500" />
    );

  const trendColor =
    metric.trend === 'down' ? 'text-emerald-400' :
    metric.trend === 'up'   ? 'text-red-400'     : 'text-slate-500';

  return (
    <div className={`rounded-xl bg-slate-800/40 border border-slate-700/50 p-3 space-y-2 hover:border-slate-600/60 transition-colors duration-200 ${isLast ? 'col-span-2' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-400">
          {iconMap[metric.icon]}
          <span className="text-xs text-slate-500">{metric.label}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          {trendIcon}
          <span>{metric.trendValue}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold font-mono text-white">{metric.value}</span>
        <span className="text-xs text-slate-500">{metric.unit}</span>
      </div>
    </div>
  );
}
