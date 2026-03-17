import { motion } from 'framer-motion';

interface StatusCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status: 'ok' | 'warning' | 'critical';
  delay?: number;
}

function StatusCard({ label, value, unit, status, delay = 0 }: StatusCardProps) {
  const statusStyles = {
    ok: {
      border: 'border-green-900/50',
      glow: '0 0 20px rgba(34, 197, 94, 0.1)',
      indicator: 'bg-green-500',
      text: 'text-green-400'
    },
    warning: {
      border: 'border-amber-900/50',
      glow: '0 0 20px rgba(245, 158, 11, 0.1)',
      indicator: 'bg-amber-500',
      text: 'text-amber-400'
    },
    critical: {
      border: 'border-red-900/50',
      glow: '0 0 20px rgba(239, 68, 68, 0.15)',
      indicator: 'bg-red-500',
      text: 'text-red-400'
    }
  };

  const style = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`relative bg-[#0d1117] border ${style.border} rounded-sm p-3 md:p-4`}
      style={{ boxShadow: style.glow }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-700/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-700/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-700/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-700/50" />

      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] md:text-xs text-[#4a6a4a] uppercase tracking-wider">{label}</span>
        <motion.div
          className={`w-2 h-2 rounded-full ${style.indicator}`}
          animate={{ opacity: status === 'critical' ? [1, 0.3, 1] : 1 }}
          transition={{ duration: 0.5, repeat: status === 'critical' ? Infinity : 0 }}
        />
      </div>
      <div className={`mt-2 md:mt-3 text-2xl md:text-3xl lg:text-4xl font-bold ${style.text} tabular-nums`}>
        {value}
        {unit && <span className="text-base md:text-lg lg:text-xl ml-1 text-[#4a6a4a]">{unit}</span>}
      </div>
    </motion.div>
  );
}

export default function StatusPanel() {
  const statuses: StatusCardProps[] = [
    { label: 'CPU Load', value: 42, unit: '%', status: 'ok' },
    { label: 'Memory', value: 67, unit: '%', status: 'warning' },
    { label: 'Network I/O', value: '2.4', unit: 'Gb/s', status: 'ok' },
    { label: 'Error Rate', value: 0.02, unit: '%', status: 'ok' },
    { label: 'Latency P99', value: 142, unit: 'ms', status: 'warning' },
    { label: 'Active Pods', value: 847, status: 'ok' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {statuses.map((s, i) => (
        <StatusCard key={s.label} {...s} delay={i * 0.05} />
      ))}
    </div>
  );
}
