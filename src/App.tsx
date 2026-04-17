import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal, 
  Activity, 
  Lock, 
  Zap, 
  AlertCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  Info,
  Copy,
  Check,
  Cpu,
  FileCode,
  AlertTriangle,
  Play,
  RotateCcw,
  Wifi,
  Skull,
  Crosshair
} from 'lucide-react';
import { MALWARE_DATA, MalwareType, SimulationStep } from './constants';

export default function App() {
  const [selectedMalware, setSelectedMalware] = useState<MalwareType>(MALWARE_DATA[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

  // Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<SimulationStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [systemHealth, setSystemHealth] = useState(100);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Typing effect for the terminal (static payload view)
  useEffect(() => {
    if (!isSimulating) {
      setTerminalText('');
      setTypingIndex(0);
    }
  }, [selectedMalware, isSimulating]);

  useEffect(() => {
    if (!isSimulating && typingIndex < selectedMalware.payloadCode.length) {
      const timer = setTimeout(() => {
        setTerminalText(prev => prev + selectedMalware.payloadCode[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 5);
      return () => clearTimeout(timer);
    }
  }, [typingIndex, selectedMalware, isSimulating]);

  // Simulation Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating && activeStepIndex < selectedMalware.simulationSteps.length - 1) {
      interval = setInterval(() => {
        setActiveStepIndex(prev => {
          const nextIndex = prev + 1;
          const nextStep = selectedMalware.simulationSteps[nextIndex];
          setSimulationLogs(logs => [...logs, nextStep]);
          
          // Impact on system health
          if (nextStep.type === 'warn') setSystemHealth(h => Math.max(h - 10, 20));
          if (nextStep.type === 'error') setSystemHealth(h => Math.max(h - 25, 5));
          if (nextStep.type === 'critical') setSystemHealth(0);
          
          return nextIndex;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, activeStepIndex, selectedMalware]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [simulationLogs]);

  const toggleSimulation = () => {
    if (isSimulating) {
      resetSimulation();
    } else {
      setIsSimulating(true);
      setSimulationLogs([]);
      setActiveStepIndex(-1);
      setSystemHealth(100);
    }
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationLogs([]);
    setActiveStepIndex(-1);
    setSystemHealth(100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedMalware.payloadCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-green-500';
      case 'warn': return 'text-sleek-warning';
      case 'error': return 'text-sleek-danger';
      case 'critical': return 'text-sleek-danger font-black animate-pulse';
      default: return 'text-sleek-cyan';
    }
  };

  return (
    <div className="min-h-screen bg-sleek-bg text-sleek-text-main font-sans selection:bg-sleek-cyan selection:text-sleek-bg flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-10 py-6 border-b border-sleek-border flex justify-between items-center bg-sleek-surface/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm tracking-[0.2em] text-sleek-cyan font-bold uppercase">SEC-ANALYSIS // SIMULATION_ENV</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 border-x border-sleek-border px-8">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-sleek-text-dim">Network Load</span>
              <span className="text-xs font-mono text-sleek-cyan flex items-center gap-2">
                <Wifi className="w-3 h-3" />
                {isSimulating ? 'STREAMING' : 'IDLE_WAIT'}
              </span>
            </div>
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[9px] uppercase tracking-widest text-sleek-text-dim">System Integrity</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-sleek-border rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${systemHealth > 50 ? 'bg-green-500' : systemHealth > 20 ? 'bg-sleek-warning' : 'bg-sleek-danger'}`}
                    animate={{ width: `${systemHealth}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono ${systemHealth > 50 ? 'text-green-500' : 'text-sleek-danger'}`}>{systemHealth}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-sleek-text-dim">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${isSimulating ? 'bg-sleek-danger text-sleek-danger animate-ping' : 'bg-[#22C55E] text-[#22C55E]'}`} />
            {isSimulating ? 'SIMULATION_ACTIVE' : 'LAB_SECURE'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 p-10 overflow-hidden relative">
        {/* Control Panel (Left Sidebar) */}
        <aside className="space-y-6 flex flex-col h-full">
          {!isSimulating ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-sleek-text-dim mb-4 px-1">Select Education Module</p>
                <nav className="space-y-3">
                  {MALWARE_DATA.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMalware(item)}
                      className={`w-full group relative overflow-hidden bg-sleek-surface border rounded-xl p-5 text-left transition-all duration-200 ${
                        selectedMalware.id === item.id 
                        ? 'border-sleek-cyan bg-sleek-cyan/10' 
                        : 'border-sleek-border hover:border-sleek-cyan/50 hover:bg-sleek-cyan/5'
                      }`}
                    >
                      {selectedMalware.id === item.id && (
                        <motion.div layoutId="active-bar" className="absolute left-0 top-0 bottom-0 w-1 bg-sleek-cyan" />
                      )}
                      <div className="flex items-center gap-3 mb-1">
                        <item.icon className={`w-4 h-4 ${selectedMalware.id === item.id ? 'text-sleek-cyan' : 'text-sleek-text-dim group-hover:text-sleek-text-main'}`} />
                        <span className="text-lg font-semibold">{item.name}</span>
                      </div>
                      <p className="text-xs text-sleek-text-dim leading-relaxed line-clamp-2">{item.description}</p>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-5 border border-sleek-border bg-sleek-surface rounded-xl">
                <h4 className="text-[10px] uppercase tracking-widest text-sleek-text-dim mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Technical Stats
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Complexity', val: 'O(log n)' },
                    { label: 'Evasion', val: 'Advanced' },
                    { label: 'Persistence', val: 'Reboot_Safe' }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center bg-sleek-bg/30 p-2 rounded">
                      <span className="text-[10px] text-sleek-text-dim">{stat.label}</span>
                      <span className="text-[10px] font-mono text-sleek-cyan">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col gap-6">
              <div className="p-6 bg-sleek-danger/10 border border-sleek-danger rounded-xl text-center">
                <Skull className="w-12 h-12 text-sleek-danger mx-auto mb-4 animate-bounce" />
                <h2 className="text-xl font-black uppercase mb-1">{selectedMalware.id}_ACTIVE</h2>
                <p className="text-[10px] text-sleek-danger/70 font-mono">SIMULATION_IN_PROGRESS</p>
              </div>

              <div className="flex-1 p-5 border border-sleek-border bg-sleek-surface rounded-xl overflow-hidden flex flex-col">
                <div className="text-[9px] uppercase tracking-widest text-sleek-text-dim mb-2">Impact Visualizer</div>
                <div className="flex-1 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-sleek-danger rounded-full" 
                  />
                  <Crosshair className="w-16 h-16 text-sleek-danger/40 animate-spin-slow" />
                  <div className="absolute inset-x-0 bottom-0 text-[8px] font-mono text-center text-sleek-text-dim">
                    Target: WORKSTATION_042
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-auto flex flex-col gap-3 pb-4">
            <button 
              onClick={toggleSimulation}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                isSimulating 
                ? 'bg-sleek-danger text-white hover:brightness-110' 
                : 'bg-sleek-cyan text-sleek-bg hover:brightness-110'
              }`}
            >
              {isSimulating ? (
                <><RotateCcw className="w-4 h-4" /> Stop Simulation</>
              ) : (
                <><Play className="w-4 h-4" /> Start Real-Time Simulation</>
              )}
            </button>
          </div>
        </aside>

        {/* Display Area (Main Dashboard) */}
        <section className="bg-sleek-surface border border-sleek-border rounded-[16px] shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative group">
          
          <AnimatePresence mode="wait">
            {!isSimulating ? (
              <motion.div
                key="payload-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex flex-col h-full"
              >
                {/* Display Header */}
                <div className="px-6 py-4 border-b border-sleek-border flex justify-between items-center bg-sleek-bg/20">
                  <div className="font-mono text-xs text-sleek-cyan flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5" />
                    PAYLOAD_MANIFEST_{selectedMalware.id.toUpperCase()}_V4.0.PY
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-sleek-cyan/80 bg-sleek-cyan/5 px-2 py-1 rounded border border-sleek-cyan/20">
                    SOURCE_DECRYPTED
                  </div>
                </div>

                {/* Terminal Window */}
                <div className="flex-1 relative overflow-hidden group/terminal">
                  <div className="scanline absolute pointer-events-none z-10" />
                  <div className="h-full overflow-y-auto p-8 font-mono text-sm leading-relaxed">
                    <div className="space-y-1">
                      {terminalText.split('\n').map((line, i) => (
                        <div key={i} className="text-[#A5F3FC] whitespace-pre-wrap">{line}</div>
                      ))}
                      <span className="w-2 h-4 bg-sleek-cyan/60 inline-block animate-pulse align-middle ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="simulation-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full bg-black/40"
              >
                {/* Simulation Header */}
                <div className="px-6 py-4 border-b border-sleek-border flex justify-between items-center bg-sleek-danger/10">
                  <div className="font-mono text-xs text-sleek-danger flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    LIVE_CORE_EXECUTION_TRACE
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-sleek-danger border border-sleek-danger/30 px-2 py-1 bg-sleek-danger/5">
                    THREAT_LEVEL: CRITICAL_IMPACT
                  </div>
                </div>

                {/* Real-Time Logs */}
                <div 
                  ref={logContainerRef}
                  className="flex-1 p-8 font-mono text-sm overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-sleek-border"
                >
                  <AnimatePresence>
                    {simulationLogs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 border-b border-sleek-border/20 pb-3"
                      >
                        <span className="text-sleek-text-dim text-xs opacity-50">[{log.timestamp}]</span>
                        <div className="flex-1 flex flex-col">
                          <span className={`uppercase font-bold tracking-widest text-[10px] ${getLogColor(log.type)}`}>
                            {log.type.toUpperCase()}
                          </span>
                          <span className="text-sleek-text-main mt-1 leading-relaxed">{log.message}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {activeStepIndex === selectedMalware.simulationSteps.length - 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 border-2 border-sleek-danger rounded-xl bg-sleek-danger/10 text-center mt-12"
                    >
                      <Skull className="w-16 h-16 text-sleek-danger mx-auto mb-4" />
                      <h3 className="text-2xl font-black uppercase text-sleek-danger mb-2">SYSTEM_COMPROMISED</h3>
                      <p className="text-sm text-sleek-text-dim">Execution cycle complete. All target operations finished.</p>
                      <button 
                        onClick={resetSimulation}
                        className="mt-6 px-6 py-2 border border-sleek-danger text-sleek-danger hover:bg-sleek-danger hover:text-white transition-all text-[10px] uppercase font-bold"
                      >
                        RESTART_LAB_READY
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Meta Footer */}
          {!isSimulating && (
            <div className="px-8 py-6 border-t border-sleek-border grid grid-cols-3 gap-8 bg-sleek-bg/10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-sleek-text-dim">Severity Level</span>
                <span className={`text-sm font-bold flex items-center gap-1.5 ${selectedMalware.threatLevel === 'Critical' ? 'text-sleek-danger' : 'text-sleek-warning'}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {selectedMalware.threatLevel} (9.2/10)
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-sleek-text-dim">Target Architecture</span>
                <span className="text-sm font-bold flex items-center gap-1.5 text-sleek-text-main">
                  <Cpu className="w-3.5 h-3.5 text-sleek-cyan" />
                  x86_64 / ARMv8
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-sleek-text-dim">Mechanism</span>
                <span className="text-sm font-bold text-sleek-text-main truncate">
                  {selectedMalware.fullName}
                </span>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Mobile Disclaimer */}
      <div className={`text-white py-1 px-4 text-[9px] uppercase tracking-[0.3em] font-black text-center relative z-[60] shrink-0 transition-colors ${isSimulating ? 'bg-sleek-danger animate-pulse' : 'bg-sleek-cyan'}`}>
        {isSimulating ? '// SIMULATION_ACTIVE // MONITOR_ALL_SYSTEM_CHANNELS //' : '// EDUCATIONAL LAB ENVIRONMENT // NO HARMFUL DEPLOYMENT PERMITTED //'}
      </div>
    </div>
  );
}
