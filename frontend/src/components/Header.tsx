import { FileText, Zap, Shield, Activity } from 'lucide-react';
import type { ReactNode } from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            DocFlow <span className="text-blue-400">AI</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
            Enterprise Intelligence Platform
          </p>
        </div>
      </div>

      {/* Status badges */}
      <div className="hidden md:flex items-center gap-3">
        <StatusBadge icon={<Zap className="w-3 h-3" />} label="Pipeline Active" color="emerald" />
        <StatusBadge icon={<Shield className="w-3 h-3" />} label="Secure" color="blue" />
        <StatusBadge icon={<Activity className="w-3 h-3" />} label="99.9% Uptime" color="violet" />
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <span className="text-sm text-slate-300 font-medium hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({
  icon,
  label,
  color,
}: {
  icon: ReactNode;
  label: string;
  color: 'emerald' | 'blue' | 'violet';
}) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    violet: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${colors[color]}`}>
      {icon}
      {label}
    </div>
  );
}
