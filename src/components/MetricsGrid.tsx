import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Metric {
  name: string;
  value: number;
  max: number;
  unit: string;
}

function MetricBar({ metric, index }: { metric: Metric; index: number }) {
  const percentage = (metric.value / metric.max) * 100;
  const isHigh = percentage > 80;
  const isMedium = percentage > 50 && percentage <= 80;

  const barColor = isHigh
    ? 'bg-gradient-to-r from-red-600 to-red-500'
    : isMedium
      ? 'bg-gradient-to-r from-amber-600 to-amber-500'
      : 'bg-gradient-to-r from-green-600 to-green-500';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="space-y-1"
    >
      <div className="flex justify-between text-xs">
        <span className="text-[#6a8a6a] uppercase tracking-wider text-[10px] md:text-xs">{metric.name}</span>
        <span className="text-green-300 tabular-nums text-[10px] md:text-xs">
          {metric.value.toFixed(1)}{metric.unit}
        </span>
      </div>
      <div className="h-2 md:h-3 bg-[#1a2a1a] rounded-sm overflow-hidden relative">
        <motion.div
          className={`h-full ${barColor} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 opacity-50"
               style={{
                 boxShadow: isHigh
                   ? 'inset 0 0 10px rgba(239,68,68,0.5)'
                   : 'inset 0 0 10px rgba(34,197,94,0.3)'
               }}
          />
        </motion.div>
        {/* Grid lines */}
        <div className="absolute inset-0 flex">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-[#0a0e14]/50" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'API Gateway', value: 45.2, max: 100, unit: '%' },
    { name: 'Database Pool', value: 72.8, max: 100, unit: '%' },
    { name: 'Cache Hit Rate', value: 94.1, max: 100, unit: '%' },
    { name: 'Queue Depth', value: 234, max: 1000, unit: '' },
    { name: 'Worker Threads', value: 18, max: 32, unit: '' },
    { name: 'Disk I/O', value: 67.3, max: 100, unit: '%' },
    { name: 'SSL Certs', value: 12, max: 30, unit: 'd' },
    { name: 'Heap Memory', value: 4.2, max: 8, unit: 'GB' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.max(0, Math.min(m.max, m.value + (Math.random() - 0.5) * (m.max * 0.05)))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0d1117] border border-[#1a3a1a] rounded-sm p-4 md:p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-5 pb-3 border-b border-[#1a3a1a]">
        <h2 className="text-xs md:text-sm uppercase tracking-[0.15em] text-[#6a9a6a]">
          System Metrics
        </h2>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] text-[#4a6a4a]">LIVE</span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-3 md:space-y-4">
        {metrics.map((metric, i) => (
          <MetricBar key={metric.name} metric={metric} index={i} />
        ))}
      </div>
    </div>
  );
}
