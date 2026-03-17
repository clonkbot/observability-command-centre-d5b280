import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  time: number;
  cpu: number;
  memory: number;
  network: number;
}

export default function SystemGraph() {
  const [data, setData] = useState<DataPoint[]>(() => {
    const now = Date.now();
    return Array.from({ length: 60 }, (_, i) => ({
      time: now - (60 - i) * 1000,
      cpu: 30 + Math.random() * 40,
      memory: 50 + Math.random() * 30,
      network: 20 + Math.random() * 50
    }));
  });

  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'network'>('cpu');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint: DataPoint = {
          time: Date.now(),
          cpu: Math.max(5, Math.min(95, prev[prev.length - 1].cpu + (Math.random() - 0.5) * 15)),
          memory: Math.max(30, Math.min(90, prev[prev.length - 1].memory + (Math.random() - 0.5) * 5)),
          network: Math.max(5, Math.min(90, prev[prev.length - 1].network + (Math.random() - 0.5) * 20))
        };
        return [...prev.slice(1), newPoint];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const createPath = (metric: 'cpu' | 'memory' | 'network', height: number, width: number) => {
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - (d[metric] / 100) * height
    }));

    if (points.length === 0) return '';

    const pathData = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cpx = (prev.x + point.x) / 2;
      return `${acc} C ${cpx} ${prev.y}, ${cpx} ${point.y}, ${point.x} ${point.y}`;
    }, '');

    return pathData;
  };

  const metricConfig = {
    cpu: { color: '#22c55e', label: 'CPU', current: data[data.length - 1]?.cpu || 0 },
    memory: { color: '#f59e0b', label: 'Memory', current: data[data.length - 1]?.memory || 0 },
    network: { color: '#3b82f6', label: 'Network', current: data[data.length - 1]?.network || 0 }
  };

  const graphHeight = 180;
  const graphWidth = 600;

  return (
    <div className="bg-[#0d1117] border border-[#1a3a1a] rounded-sm p-4 md:p-5 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-[#1a3a1a]">
        <h2 className="text-xs md:text-sm uppercase tracking-[0.15em] text-[#6a9a6a]">
          Real-Time Telemetry
        </h2>

        {/* Metric Toggles */}
        <div className="flex gap-2 md:gap-3">
          {(Object.keys(metricConfig) as Array<keyof typeof metricConfig>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-sm text-[10px] md:text-xs uppercase tracking-wider transition-all min-h-[44px] md:min-h-0 ${
                activeMetric === key
                  ? 'bg-[#1a2a1a] border border-green-800/50'
                  : 'border border-transparent hover:bg-[#1a2a1a]/50'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: metricConfig[key].color }}
              />
              <span className="hidden sm:inline" style={{ color: activeMetric === key ? metricConfig[key].color : '#6a8a6a' }}>
                {metricConfig[key].label}
              </span>
              <span className="tabular-nums" style={{ color: metricConfig[key].color }}>
                {metricConfig[key].current.toFixed(1)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Graph Container */}
      <div ref={containerRef} className="relative h-40 md:h-48 lg:h-56 w-full">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Horizontal grid */}
          {[0, 25, 50, 75, 100].map((val, i) => (
            <g key={val}>
              <line
                x1="0"
                y1={`${100 - val}%`}
                x2="100%"
                y2={`${100 - val}%`}
                stroke="#1a3a1a"
                strokeWidth="1"
              />
              <text
                x="8"
                y={`${100 - val + 1}%`}
                fill="#3a5a3a"
                fontSize="10"
                fontFamily="monospace"
              >
                {val}%
              </text>
            </g>
          ))}
          {/* Vertical grid */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1={`${(i / 11) * 100}%`}
              y1="0"
              x2={`${(i / 11) * 100}%`}
              y2="100%"
              stroke="#1a3a1a"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Graph SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          preserveAspectRatio="none"
        >
          {/* Area fill */}
          <defs>
            <linearGradient id={`gradient-${activeMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={metricConfig[activeMetric].color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={metricConfig[activeMetric].color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Area */}
          <motion.path
            d={`${createPath(activeMetric, graphHeight, graphWidth)} L ${graphWidth} ${graphHeight} L 0 ${graphHeight} Z`}
            fill={`url(#gradient-${activeMetric})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={createPath(activeMetric, graphHeight, graphWidth)}
            stroke={metricConfig[activeMetric].color}
            strokeWidth="2"
            fill="none"
            style={{
              filter: `drop-shadow(0 0 6px ${metricConfig[activeMetric].color})`
            }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Current value indicator */}
          <motion.circle
            cx={graphWidth}
            cy={graphHeight - (data[data.length - 1]?.[activeMetric] || 0) / 100 * graphHeight}
            r="4"
            fill={metricConfig[activeMetric].color}
            style={{
              filter: `drop-shadow(0 0 8px ${metricConfig[activeMetric].color})`
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>

        {/* Scan line effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"
          animate={{ y: ['0%', '10000%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-[9px] md:text-[10px] text-[#3a5a3a]">
        <span>-60s</span>
        <span>-45s</span>
        <span>-30s</span>
        <span>-15s</span>
        <span>NOW</span>
      </div>
    </div>
  );
}
