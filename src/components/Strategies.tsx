import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, TrendingUp, Building2, Calendar, FileText, ArrowUpRight, BarChart3, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function SalaryOffers() {
  const { salaryOffers = [], addSalaryOffer, deleteSalaryOffer } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  
  const [companyName, setCompanyName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [components, setComponents] = useState([{ id: crypto.randomUUID(), name: 'Basic Salary', amount: 0 }]);

  const sortedOffers = useMemo(() => {
    return [...salaryOffers].sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());
  }, [salaryOffers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || components.length === 0) return;

    addSalaryOffer({
      companyName,
      effectiveDate,
      components: components.map(c => ({ ...c, amount: Number(c.amount) }))
    });

    setCompanyName('');
    setEffectiveDate(new Date().toISOString().split('T')[0]);
    setComponents([{ id: crypto.randomUUID(), name: 'Basic Salary', amount: 0 }]);
    setIsAdding(false);
  };

  const addComponent = () => {
    setComponents([...components, { id: crypto.randomUUID(), name: '', amount: 0 }]);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const updateComponent = (id: string, field: 'name' | 'amount', value: string | number) => {
    setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const totalCurrent = components.reduce((acc, c) => acc + Number(c.amount || 0), 0);

  // Analytics Data
  const chartData = useMemo(() => {
    return sortedOffers.map(offer => {
      const total = offer.components.reduce((acc, c) => acc + c.amount, 0);
      const basic = offer.components.find(c => c.name.toLowerCase().includes('basic'))?.amount || 0;
      const other = total - basic;
      
      return {
        name: offer.companyName,
        date: new Date(offer.effectiveDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
        fullDate: offer.effectiveDate,
        Total: total,
        Basic: basic,
        OtherAllowances: other
      };
    });
  }, [sortedOffers]);

  const calculateGrowth = () => {
    if (sortedOffers.length < 2) return { percent: 0, amount: 0 };
    const first = sortedOffers[0].components.reduce((acc, c) => acc + c.amount, 0);
    const last = sortedOffers[sortedOffers.length - 1].components.reduce((acc, c) => acc + c.amount, 0);
    if (first === 0) return { percent: 0, amount: last };
    return {
      percent: ((last - first) / first) * 100,
      amount: last - first
    };
  };

  const growth = calculateGrowth();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#a855f7] md:col-span-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest">Total Growth</h3>
            <TrendingUp className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div className="text-3xl font-mono text-white mt-1">+{growth.percent.toFixed(1)}%</div>
          <p className="text-[#808080] text-xs font-mono mt-2">+₹{growth.amount.toLocaleString()} actual increase</p>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#00ff9d] md:col-span-2 flex items-center justify-between">
          <div>
            <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest mb-1">Offer Letters Tracked</h3>
            <div className="text-3xl font-mono text-white">{sortedOffers.length}</div>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-6 py-3 rounded-lg hover:bg-[#00ff9d]/20 transition-all shadow-[0_0_15px_rgba(0,255,157,0.1)]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold tracking-wider">ADD NEW OFFER</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-[#a855f7]/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] my-8"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#a855f7]" /> Add Offer Letter / Appraisal
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">Company / Role</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
                      <input 
                        type="text" 
                        required
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#a855f7] transition-colors"
                        placeholder="e.g. Google, Promotion 2026"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">Effective Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
                      <input 
                        type="date" 
                        required
                        value={effectiveDate}
                        onChange={e => setEffectiveDate(e.target.value)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#a855f7] transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-[#1f1f1f] pb-2">
                    <label className="text-xs text-[#808080] uppercase tracking-wider font-bold text-[#a855f7]">Salary Components</label>
                    <div className="text-xs font-mono text-[#00ff9d]">Total: ₹{totalCurrent.toLocaleString()}</div>
                  </div>
                  
                  {components.map((c, idx) => (
                    <div key={c.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-4">
                      <div className="flex-1 space-y-1">
                        <input 
                          type="text" 
                          required
                          value={c.name}
                          onChange={e => updateComponent(c.id, 'name', e.target.value)}
                          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors text-sm"
                          placeholder="e.g. Basic, HRA, Special Allowance"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <input 
                          type="number" 
                          required
                          value={c.amount || ''}
                          onChange={e => updateComponent(c.id, 'amount', e.target.value)}
                          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono text-sm"
                          placeholder="Amount (₹)"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeComponent(c.id)}
                        className="p-2 mt-0.5 text-[#808080] hover:text-[#ff0055] hover:bg-[#ff0055]/10 rounded transition-colors"
                        disabled={components.length === 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={addComponent}
                    className="text-xs font-mono text-[#00f0ff] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> ADD COMPONENT
                  </button>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#1f1f1f]">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#1f1f1f] text-[#808080] hover:bg-[#1f1f1f] transition-colors font-mono text-sm"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#a855f7] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#a855f7]/80 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    SAVE OFFER
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Analytics Views */}
      {sortedOffers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-xl neon-border border-[#a855f7]/30">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#a855f7]" /> Salary Progression
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="date" stroke="#404040" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#404040" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="Total" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl neon-border border-[#00f0ff]/30">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#00f0ff]" /> Component Breakdown
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="name" stroke="#404040" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#404040" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                    cursor={{ fill: '#141414' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', color: '#808080' }} />
                  <Bar dataKey="Basic" stackId="a" fill="#00f0ff" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="OtherAllowances" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* History Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Offer Timeline</h2>
        {sortedOffers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sortedOffers.map((offer, idx) => {
              const totalAmount = offer.components.reduce((acc, c) => acc + c.amount, 0);
              let prevTotal = 0;
              if (idx > 0) {
                prevTotal = sortedOffers[idx-1].components.reduce((acc, c) => acc + c.amount, 0);
              }
              const increment = prevTotal > 0 ? ((totalAmount - prevTotal) / prevTotal) * 100 : 0;
              
              return (
                <div key={offer.id} className="glass-panel p-6 rounded-xl hover:border-[#1f1f1f] transition-all border border-[#141414]">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-[#808080]" />
                        <h3 className="text-lg font-bold text-white">{offer.companyName}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#808080] font-mono">
                        <Calendar className="w-3 h-3" />
                        Effective: {new Date(offer.effectiveDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {idx > 0 && (
                        <div className="text-right">
                          <div className="text-[10px] text-[#808080] uppercase tracking-widest mb-1">Increment</div>
                          <div className={`font-mono font-bold flex items-center justify-end gap-1 ${increment >= 0 ? 'text-[#00ff9d]' : 'text-[#ff0055]'}`}>
                            {increment >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                            {Math.abs(increment).toFixed(1)}%
                          </div>
                        </div>
                      )}
                      <div className="text-right">
                        <div className="text-[10px] text-[#808080] uppercase tracking-widest mb-1">Total CTC</div>
                        <div className="text-xl font-mono text-white">₹{totalAmount.toLocaleString()}</div>
                      </div>
                      <button 
                        onClick={() => deleteSalaryOffer(offer.id)}
                        className="p-2 text-[#808080] hover:text-[#ff0055] transition-colors border border-transparent hover:border-[#ff0055]/30 rounded-lg"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-[#1f1f1f]/50">
                    {offer.components.map(c => (
                      <div key={c.id} className="bg-[#141414] p-3 rounded-lg border border-[#1f1f1f]">
                        <div className="text-[10px] text-[#808080] uppercase truncate mb-1" title={c.name}>{c.name}</div>
                        <div className="font-mono text-sm text-[#e0e0e0]">₹{c.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-xl text-center border-dashed border-[#1f1f1f]">
            <FileText className="w-12 h-12 text-[#808080] opacity-20 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">No Offers Tracked Yet</h3>
            <p className="text-[#808080] text-sm max-w-md mx-auto">
              Add your current salary breakdown and any past offer letters to track your career progression and visualize your increments.
            </p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-6 inline-flex items-center gap-2 text-[#a855f7] hover:text-white transition-colors text-sm font-mono tracking-widest uppercase border border-[#a855f7]/30 px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" /> START TRACKING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
