import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusPanel from './components/StatusPanel';
import MetricsGrid from './components/MetricsGrid';
import AlertFeed from './components/AlertFeed';
import ServiceMap from './components/ServiceMap';
import SystemGraph from './components/SystemGraph';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<'NOMINAL' | 'WARNING' | 'CRITICAL'>('NOMINAL');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate occasional status changes
    const statusTimer = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) setSystemStatus('CRITICAL');
      else if (rand > 0.85) setSystemStatus('WARNING');
      else setSystemStatus('NOMINAL');
    }, 5000);
    return () => clearInterval(statusTimer);
  }, []);

  const statusColors = {
    NOMINAL: 'text-green-400',
    WARNING: 'text-amber-400',
    CRITICAL: 'text-red-500'
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#b3f0b3] font-mono relative overflow-x-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
           }}
      />

      {/* CRT vignette */}
      <div className="pointer-events-none fixed inset-0 z-40"
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
           }}
      />

      {/* Header */}
      <header className="border-b border-[#1a3a1a] bg-[#0d1117]/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 md:gap-4">
              <motion.div
                className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500"
                animate={{
                  boxShadow: ['0 0 10px #22c55e', '0 0 20px #22c55e', '0 0 10px #22c55e'],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <h1 className="text-lg md:text-xl lg:text-2xl tracking-[0.2em] uppercase font-bold">
                Observability Command Centre
              </h1>
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#4a6a4a]">SYS_STATUS:</span>
                <motion.span
                  className={`${statusColors[systemStatus]} font-bold`}
                  animate={{ opacity: systemStatus === 'CRITICAL' ? [1, 0.3, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: systemStatus === 'CRITICAL' ? Infinity : 0 }}
                >
                  {systemStatus}
                </motion.span>
              </div>
              <div className="hidden sm:block border-l border-[#1a3a1a] pl-4 md:pl-6 tabular-nums">
                <span className="text-[#4a6a4a]">UTC:</span>{' '}
                <span className="text-green-300">{currentTime.toISOString().slice(11, 19)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Top Row - Status Panels */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatusPanel />
        </motion.section>

        {/* Middle Row - Metrics + Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SystemGraph />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MetricsGrid />
          </motion.div>
        </div>

        {/* Bottom Row - Services + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ServiceMap />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AlertFeed />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a3a1a] bg-[#0d1117]/50 mt-8">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-4">
          <p className="text-center text-[10px] md:text-xs text-[#3a5a3a] tracking-wider">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
