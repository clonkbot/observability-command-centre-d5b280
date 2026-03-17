import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  service: string;
}

const alertMessages = [
  { severity: 'info' as const, message: 'Health check passed', services: ['api-gateway', 'auth-service', 'cache-layer'] },
  { severity: 'info' as const, message: 'Auto-scaling triggered', services: ['worker-pool', 'api-gateway'] },
  { severity: 'warning' as const, message: 'High memory usage detected', services: ['database-primary', 'cache-layer'] },
  { severity: 'warning' as const, message: 'Connection pool nearing limit', services: ['database-primary', 'database-replica'] },
  { severity: 'critical' as const, message: 'Request timeout exceeded', services: ['payment-service', 'api-gateway'] },
  { severity: 'info' as const, message: 'Certificate renewal successful', services: ['ssl-manager'] },
  { severity: 'warning' as const, message: 'Disk usage above 80%', services: ['log-aggregator', 'metrics-store'] },
  { severity: 'info' as const, message: 'Deployment completed', services: ['ci-cd-pipeline'] },
];

function generateAlert(): Alert {
  const template = alertMessages[Math.floor(Math.random() * alertMessages.length)];
  return {
    id: Math.random().toString(36).slice(2),
    timestamp: new Date(),
    severity: template.severity,
    message: template.message,
    service: template.services[Math.floor(Math.random() * template.services.length)]
  };
}

export default function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    Array.from({ length: 6 }, generateAlert)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => [generateAlert(), ...prev.slice(0, 7)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const severityStyles = {
    info: {
      bg: 'bg-[#0d2818]',
      border: 'border-green-900/30',
      icon: 'text-green-500',
      badge: 'bg-green-900/50 text-green-400'
    },
    warning: {
      bg: 'bg-[#2d2510]',
      border: 'border-amber-900/30',
      icon: 'text-amber-500',
      badge: 'bg-amber-900/50 text-amber-400'
    },
    critical: {
      bg: 'bg-[#2d1515]',
      border: 'border-red-900/30',
      icon: 'text-red-500',
      badge: 'bg-red-900/50 text-red-400'
    }
  };

  return (
    <div className="bg-[#0d1117] border border-[#1a3a1a] rounded-sm p-4 md:p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1a3a1a]">
        <h2 className="text-xs md:text-sm uppercase tracking-[0.15em] text-[#6a9a6a]">
          Alert Feed
        </h2>
        <div className="flex items-center gap-3 md:gap-4 text-[10px]">
          <span className="text-green-500">INFO: {alerts.filter(a => a.severity === 'info').length}</span>
          <span className="text-amber-500">WARN: {alerts.filter(a => a.severity === 'warning').length}</span>
          <span className="text-red-500">CRIT: {alerts.filter(a => a.severity === 'critical').length}</span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-64 md:max-h-80 pr-1 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => {
            const style = severityStyles[alert.severity];
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`${style.bg} border ${style.border} rounded-sm p-2.5 md:p-3`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <motion.div
                    className={`mt-0.5 text-sm md:text-base ${style.icon}`}
                    animate={alert.severity === 'critical' ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {alert.severity === 'info' && '○'}
                    {alert.severity === 'warning' && '△'}
                    {alert.severity === 'critical' && '◆'}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <span className={`text-[9px] md:text-[10px] px-1.5 py-0.5 rounded ${style.badge} uppercase tracking-wider`}>
                        {alert.service}
                      </span>
                      <span className="text-[9px] md:text-[10px] text-[#4a6a4a] tabular-nums">
                        {alert.timestamp.toISOString().slice(11, 19)}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-[#8aba8a] truncate">{alert.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
