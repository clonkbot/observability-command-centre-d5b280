import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Service {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  requests: number;
  latency: number;
}

export default function ServiceMap() {
  const [services, setServices] = useState<Service[]>([
    { name: 'api-gateway', status: 'healthy', uptime: '99.99%', requests: 45230, latency: 12 },
    { name: 'auth-service', status: 'healthy', uptime: '99.97%', requests: 12450, latency: 8 },
    { name: 'database-primary', status: 'healthy', uptime: '99.99%', requests: 89400, latency: 3 },
    { name: 'database-replica', status: 'degraded', uptime: '98.45%', requests: 45200, latency: 15 },
    { name: 'cache-layer', status: 'healthy', uptime: '99.99%', requests: 234500, latency: 1 },
    { name: 'worker-pool', status: 'healthy', uptime: '99.95%', requests: 5670, latency: 45 },
    { name: 'payment-service', status: 'healthy', uptime: '99.99%', requests: 2340, latency: 89 },
    { name: 'notification-hub', status: 'down', uptime: '94.50%', requests: 0, latency: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        requests: s.status !== 'down' ? s.requests + Math.floor(Math.random() * 100) : 0,
        latency: s.status !== 'down' ? Math.max(1, s.latency + Math.floor(Math.random() * 10) - 5) : 0
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    healthy: {
      dot: 'bg-green-500',
      text: 'text-green-400',
      glow: 'shadow-[0_0_8px_rgba(34,197,94,0.5)]',
      label: 'HEALTHY'
    },
    degraded: {
      dot: 'bg-amber-500',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      label: 'DEGRADED'
    },
    down: {
      dot: 'bg-red-500',
      text: 'text-red-400',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
      label: 'DOWN'
    }
  };

  return (
    <div className="bg-[#0d1117] border border-[#1a3a1a] rounded-sm p-4 md:p-5 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
        <h2 className="text-xs md:text-sm uppercase tracking-[0.15em] text-[#6a9a6a]">
          Service Status
        </h2>
        <div className="flex items-center gap-3 md:gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[#6a8a6a]">{services.filter(s => s.status === 'healthy').length} Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[#6a8a6a]">{services.filter(s => s.status === 'degraded').length} Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[#6a8a6a]">{services.filter(s => s.status === 'down').length} Down</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        {services.map((service, index) => {
          const config = statusConfig[service.status];
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-[#0a0e14] border border-[#1a3a1a] rounded-sm p-2.5 md:p-3 hover:border-[#2a4a2a] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${config.dot} ${config.glow}`}
                    animate={service.status === 'down'
                      ? { opacity: [1, 0.2, 1] }
                      : service.status === 'healthy'
                        ? { scale: [1, 1.2, 1] }
                        : {}
                    }
                    transition={{ duration: service.status === 'down' ? 0.5 : 2, repeat: Infinity }}
                  />
                  <span className="text-xs md:text-sm text-green-300 font-medium truncate max-w-[120px] md:max-w-none">
                    {service.name}
                  </span>
                </div>
                <span className={`text-[9px] md:text-[10px] ${config.text} uppercase tracking-wider`}>
                  {config.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 md:gap-2 text-[10px] md:text-xs">
                <div>
                  <span className="text-[#4a6a4a] block">Uptime</span>
                  <span className="text-[#8aba8a] tabular-nums">{service.uptime}</span>
                </div>
                <div>
                  <span className="text-[#4a6a4a] block">Req/s</span>
                  <span className="text-[#8aba8a] tabular-nums">
                    {service.requests > 1000
                      ? `${(service.requests / 1000).toFixed(1)}k`
                      : service.requests}
                  </span>
                </div>
                <div>
                  <span className="text-[#4a6a4a] block">Latency</span>
                  <span className="text-[#8aba8a] tabular-nums">{service.latency}ms</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
