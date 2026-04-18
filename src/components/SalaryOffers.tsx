import React, { useState, useMemo } from 'react';
import { useFinance, SalaryOffer, OfferComponent } from '../context/FinanceContext';
import { Plus, Trash2, Edit2, TrendingUp, Building2, Calendar, FileText, ArrowUpRight, BarChart3, Minus, Wallet, PiggyBank, MinusCircle, PieChart as PieChartIcon, Brain, Hourglass, Zap, Target, Activity, Clock, Briefcase, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, ComposedChart, PieChart, Pie, Cell } from 'recharts';

export const SalaryOffers = () => {
  const { salaryOffers = [], addSalaryOffer, updateSalaryOffer, deleteSalaryOffer } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [companyName, setCompanyName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [components, setComponents] = useState<Omit<OfferComponent, 'id'>[]>([{ name: 'Basic Salary', amount: 0, type: 'earning' }]);

  const sortedOffers = useMemo(() => {
    return [...salaryOffers].sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());
  }, [salaryOffers]);

  const openAddForm = () => {
    setEditingId(null);
    setCompanyName('');
    setEffectiveDate(new Date().toISOString().split('T')[0]);
    setComponents([{ name: 'Basic Salary', amount: 0, type: 'earning' }]);
    setIsAdding(true);
  };

  const openEditForm = (offer: SalaryOffer) => {
    setEditingId(offer.id);
    setCompanyName(offer.companyName);
    setEffectiveDate(offer.effectiveDate);
    // Ensure legacy components get a type
    setComponents(offer.components.map(c => ({
      name: c.name,
      amount: c.amount,
      type: c.type || 'earning'
    })));
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || components.length === 0) return;

    const formattedComponents = components.map(c => ({
      id: crypto.randomUUID(),
      name: c.name,
      amount: Number(c.amount),
      type: c.type
    }));

    if (editingId) {
      updateSalaryOffer(editingId, {
        companyName,
        effectiveDate,
        components: formattedComponents
      });
    } else {
      addSalaryOffer({
        companyName,
        effectiveDate,
        components: formattedComponents
      });
    }

    setIsAdding(false);
  };

  const addComponent = () => {
    setComponents([...components, { name: '', amount: 0, type: 'earning' }]);
  };

  const removeComponent = (idx: number) => {
    setComponents(components.filter((_, i) => i !== idx));
  };

  const updateComponent = (idx: number, field: keyof OfferComponent, value: any) => {
    setComponents(components.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  // Helper functions for Offer Analytics
  const getOfferStats = (components: OfferComponent[]) => {
    let monthlyEarnings = 0;
    let monthlyDeductions = 0;
    let annualBonuses = 0;

    components.forEach(c => {
      const amt = Number(c.amount) || 0;
      if (c.type === 'deduction') {
        monthlyDeductions += amt;
      } else if (c.type === 'annual_bonus') {
        annualBonuses += amt;
      } else {
        monthlyEarnings += amt; // treating undefined type as earning for backward compatibility
      }
    });

    const monthlyGross = monthlyEarnings;
    const monthlyInHand = monthlyEarnings - monthlyDeductions;
    const annualCTC = (monthlyEarnings * 12) + annualBonuses;

    return { monthlyGross, monthlyInHand, monthlyDeductions, annualCTC, annualBonuses };
  };

  // Pre-calculate stats for the list
  const offersWithStats = sortedOffers.map(o => ({
    ...o,
    stats: getOfferStats(o.components)
  }));

  // Analytics Chart Data
  const chartData = useMemo(() => {
    return offersWithStats.map(offer => {
      return {
        name: offer.companyName,
        date: new Date(offer.effectiveDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
        fullDate: offer.effectiveDate,
        "Annual CTC": offer.stats.annualCTC,
        "Monthly In-Hand": offer.stats.monthlyInHand,
        "Monthly Deductions": offer.stats.monthlyDeductions,
        "Annual Bonus": offer.stats.annualBonuses
      };
    });
  }, [offersWithStats]);

  const calculateCTCGrowth = () => {
    if (offersWithStats.length < 2) return { percent: 0, amount: 0 };
    const first = offersWithStats[0].stats.annualCTC;
    const last = offersWithStats[offersWithStats.length - 1].stats.annualCTC;
    if (first === 0) return { percent: 0, amount: last };
    return {
      percent: ((last - first) / first) * 100,
      amount: last - first
    };
  };

  const growth = calculateCTCGrowth();

  // Advanced Analytics Calculations
  const advancedMetrics = useMemo(() => {
    if (offersWithStats.length === 0) return null;
    
    // 1. Time Value (Wealth Velocity) based on latest offer
    const latest = offersWithStats[offersWithStats.length - 1];
    const annual = latest.stats.annualCTC;
    const workingDaysPerYear = 260; // 5 days * 52 weeks
    const hoursPerYear = 2080; // 8 hours * 260 days
    
    const timeValue = {
      monthly: Math.round(annual / 12),
      weekly: Math.round(annual / 52),
      daily: Math.round(annual / workingDaysPerYear),
      hourly: Math.round(annual / hoursPerYear)
    };

    // 2. Salary Shape (Donut Data)
    const fixedYearly = (latest.stats.monthlyGross - latest.stats.monthlyDeductions) * 12; // Approximation of base after standard deductions
    const variableYearly = latest.stats.annualBonuses;
    const deductionsYearly = latest.stats.monthlyDeductions * 12;
    
    const donutData = [
      { name: 'Fixed (Base Net)', value: fixedYearly, color: '#00ff9d' },
      { name: 'Variable (Bonus)', value: variableYearly, color: '#a855f7' },
      { name: 'Deductions (PF/Tax)', value: deductionsYearly, color: '#ff0055' }
    ].filter(d => d.value > 0);

    // 3. Career Velocity
    let cagr = 0;
    let multiplier = 1;
    let avgSwitchTimeDays = 0;
    
    if (offersWithStats.length > 1) {
      const firstDate = new Date(offersWithStats[0].effectiveDate);
      const lastDate = new Date(latest.effectiveDate);
      const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25) || 1; // avoid division by zero
      
      const firstCTC = offersWithStats[0].stats.annualCTC;
      if (firstCTC > 0 && annual > 0) {
        multiplier = annual / firstCTC;
        cagr = (Math.pow(multiplier, 1 / diffYears) - 1) * 100;
      }
      
      avgSwitchTimeDays = diffTime / (1000 * 60 * 60 * 24 * (offersWithStats.length - 1));
    }

    return {
      timeValue,
      donutData,
      careerVelocity: {
        cagr,
        multiplier,
        avgSwitchTimeDays: Math.round(avgSwitchTimeDays)
      }
    };
  }, [offersWithStats]);

  const comparisonData = useMemo(() => {
    if (offersWithStats.length < 2) return null;
    const latestOffer = offersWithStats[offersWithStats.length - 1];
    const previousOffer = offersWithStats[offersWithStats.length - 2];

    const prevMap = new Map();
    previousOffer.components.forEach(c => prevMap.set(c.name.toLowerCase().trim(), c));

    const latestMap = new Map();
    latestOffer.components.forEach(c => latestMap.set(c.name.toLowerCase().trim(), c));

    const allNamesSets = new Set([...prevMap.keys(), ...latestMap.keys()]);
    const comparison: any[] = [];

    allNamesSets.forEach(nameKey => {
      const prevComp = prevMap.get(nameKey);
      const latestComp = latestMap.get(nameKey);

      const prevAmt = prevComp ? prevComp.amount : 0;
      const latestAmt = latestComp ? latestComp.amount : 0;
      const type = (latestComp || prevComp).type || 'earning';
      const displayName = latestComp ? latestComp.name : prevComp.name;

      const diff = latestAmt - prevAmt;
      let diffPercent = 0;
      if (prevAmt > 0) {
        diffPercent = (diff / Math.abs(prevAmt)) * 100;
      } else if (latestAmt > 0) {
        diffPercent = Infinity;
      }

      comparison.push({
        name: displayName,
        type,
        prevAmt,
        latestAmt,
        diff,
        diffPercent,
        isNew: !prevComp,
        isRemoved: !latestComp
      });
    });

    return {
      previousCompanyName: previousOffer.companyName,
      latestCompanyName: latestOffer.companyName,
      data: comparison.sort((a,b) => {
        if (a.type !== b.type) {
          if(a.type === 'earning') return -1;
          if(b.type === 'earning') return 1;
          if(a.type === 'deduction') return -1;
          if(b.type === 'deduction') return 1;
        }
        return b.diff - a.diff;
      })
    };
  }, [offersWithStats]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#a855f7] md:col-span-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest">Total CTC Growth</h3>
            <TrendingUp className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div className="text-3xl font-mono text-white mt-1">+{growth.percent.toFixed(1)}%</div>
          <p className="text-[#808080] text-xs font-mono mt-2">+₹{growth.amount.toLocaleString()} actual increase</p>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#00ff9d] md:col-span-2 flex items-center justify-between">
          <div>
            <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest mb-1">Career Timeline</h3>
            <div className="text-3xl font-mono text-white flex items-center gap-2">
               {sortedOffers.length} <span className="text-lg text-[#808080]">Offers Tracked</span>
            </div>
          </div>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-6 py-3 rounded-lg hover:bg-[#00ff9d]/20 transition-all shadow-[0_0_15px_rgba(0,255,157,0.1)]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold tracking-wider">ADD OFFER</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-3xl p-6 rounded-2xl border border-[#a855f7]/50 shadow-[0_0_50px_rgba(168,85,247,0.15)] bg-[#0a0a0a]"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#a855f7]" /> {editingId ? 'Edit Offer Letter' : 'Add Offer Letter'}
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
                        placeholder="e.g. Acme Corp, Promotion"
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

                <div className="space-y-4 pt-4 border-t border-[#1f1f1f]">
                  <div className="flex justify-between items-end border-b border-[#1f1f1f] pb-2">
                    <label className="text-xs text-[#808080] uppercase tracking-wider font-bold text-[#a855f7]">Salary Breakdown</label>
                    <div className="text-xs font-mono text-[#404040]">Input fixed amounts appropriately</div>
                  </div>
                  
                  {components.map((c, idx) => (
                    <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-4 bg-[#141414] p-3 rounded-lg border border-[#1f1f1f]">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-[#808080] uppercase">Component Name</label>
                        <input 
                          type="text" 
                          required
                          value={c.name}
                          onChange={e => updateComponent(idx, 'name', e.target.value)}
                          className="w-full bg-transparent border-b border-[#333] px-2 py-1 text-white focus:outline-none focus:border-[#00ff9d] transition-colors text-sm"
                          placeholder="e.g. Basic, HRA, PF"
                        />
                      </div>
                      <div className="w-1/4 space-y-1">
                        <label className="text-[10px] text-[#808080] uppercase">Type</label>
                        <select
                          value={c.type || 'earning'}
                          onChange={e => updateComponent(idx, 'type', e.target.value)}
                          className="w-full bg-transparent border-b border-[#333] px-2 py-1 text-white focus:outline-none focus:border-[#00ff9d] transition-colors text-sm"
                        >
                          <option value="earning">Monthly Earning (+)</option>
                          <option value="deduction">Monthly Deduction/PF (-)</option>
                          <option value="annual_bonus">Annual Bonus (+ to CTC)</option>
                        </select>
                      </div>
                      <div className="w-1/4 space-y-1">
                        <label className="text-[10px] text-[#808080] uppercase">Amount (₹)</label>
                        <input 
                          type="number" 
                          required
                          value={c.amount || ''}
                          onChange={e => updateComponent(idx, 'amount', e.target.value)}
                          className={`w-full bg-transparent border-b border-[#333] px-2 py-1 focus:outline-none transition-colors font-mono text-sm ${c.type === 'deduction' ? 'text-[#ff0055] focus:border-[#ff0055]' : 'text-[#00ff9d] focus:border-[#00ff9d]'}`}
                          placeholder="0"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeComponent(idx)}
                        className="p-1 mt-5 text-[#808080] hover:text-[#ff0055] hover:bg-[#ff0055]/10 rounded transition-colors"
                        disabled={components.length === 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={addComponent}
                    className="text-xs font-mono text-[#00f0ff] hover:text-white flex items-center gap-1 border border-[#00f0ff]/30 px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 transition-all"
                  >
                    <Plus className="w-3 h-3" /> ADD COMPONENT
                  </button>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#1f1f1f]">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#1f1f1f] text-[#808080] hover:bg-[#1f1f1f] hover:text-white transition-colors font-mono text-sm"
                  >
                    QUIT
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-gradient-to-r from-[#a855f7] to-[#00f0ff] text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  >
                    {editingId ? 'UPDATE OFFER DETAILS' : 'SAVE OFFER DETAILS'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Analytics Views */}
      {sortedOffers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="glass-panel p-6 rounded-xl neon-border border-[#a855f7]/30 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#a855f7]" /> Component Trajectory
            </h2>
            <p className="text-[#808080] text-xs mb-6 font-mono">IN-HAND (MONTHLY) VS TOTAL CTC (ANNUAL)</p>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="date" stroke="#404040" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#808080" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#00ff9d" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', color: '#808080', marginTop: '10px' }} />
                  <Area yAxisId="left" type="monotone" name="Annual CTC" dataKey="Annual CTC" stroke="#a855f7" strokeWidth={3} fill="#a855f7" fillOpacity={0.1} />
                  <Bar yAxisId="right" name="Monthly In-Hand" dataKey="Monthly In-Hand" fill="#00ff9d" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl neon-border border-[#ff0055]/30 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#ff0055]" /> In-Hand Leakage
            </h2>
             <p className="text-[#808080] text-xs mb-6 font-mono">GROSS COMP VS PF & DEDUCTIONS</p>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="name" stroke="#404040" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#404040" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                    cursor={{ fill: '#141414' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', color: '#808080', padding: '10px 0' }} />
                  <Bar name="Monthly In-Hand" dataKey="Monthly In-Hand" stackId="a" fill="#00f0ff" radius={[0, 0, 4, 4]} maxBarSize={40} />
                  <Bar name="Deductions (PF/Tax)" dataKey="Monthly Deductions" stackId="a" fill="#ff0055" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Deep Analytics Visualizer */}
      {advancedMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Time Value Velocity */}
          <div className="glass-panel p-6 rounded-xl border border-[#1f1f1f] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9d]/5 rounded-full blur-[50px] pointer-events-none"></div>
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-[#00ff9d]" /> Wealth Velocity
            </h2>
            <p className="text-[#808080] text-[10px] uppercase font-mono tracking-widest mb-6">Based on Latest Offer CTC</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-[#1f1f1f] hover:border-[#00ff9d]/30 transition-colors">
                <span className="text-xs text-[#808080] flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#00ff9d]" /> per Month</span>
                <span className="font-mono text-white">₹{advancedMetrics.timeValue.monthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-[#1f1f1f] hover:border-[#00ff9d]/30 transition-colors">
                <span className="text-xs text-[#808080] flex items-center gap-2"><Calendar className="w-4 h-4 text-[#00ff9d]" /> per Week</span>
                <span className="font-mono text-white">₹{advancedMetrics.timeValue.weekly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-[#1f1f1f] hover:border-[#00ff9d]/30 transition-colors">
                <span className="text-xs text-[#808080] flex items-center gap-2"><Zap className="w-4 h-4 text-[#00ff9d]" /> per Day (Working)</span>
                <span className="font-mono text-white">₹{advancedMetrics.timeValue.daily.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-[#1f1f1f] hover:border-[#00ff9d]/30 transition-colors">
                <span className="text-xs text-[#808080] flex items-center gap-2"><Clock className="w-4 h-4 text-[#00ff9d]" /> per Hour (Working)</span>
                <span className="font-mono text-[#00ff9d] font-bold">₹{advancedMetrics.timeValue.hourly.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Salary Shape (Donut) */}
          <div className="glass-panel p-6 rounded-xl border border-[#1f1f1f] relative overflow-hidden flex flex-col items-center">
            <h2 className="text-lg font-semibold text-white mb-2 self-start flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#a855f7]" /> Salary Shape
            </h2>
            <p className="text-[#808080] text-[10px] uppercase font-mono tracking-widest mb-2 self-start">Latest Offer Distribution</p>
            
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={advancedMetrics.donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {advancedMetrics.donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <span className="text-xs text-[#808080] uppercase">Gross CTC</span>
              </div>
            </div>
            <div className="w-full flex justify-center gap-3 mt-4 flex-wrap">
              {advancedMetrics.donutData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-[10px] text-[#808080] uppercase">{d.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Velocity */}
          <div className="glass-panel p-6 rounded-xl border border-[#1f1f1f] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb800]/5 rounded-full blur-[50px] pointer-events-none"></div>
             <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#ffb800]" /> Career Velocity
            </h2>
            <p className="text-[#808080] text-[10px] uppercase font-mono tracking-widest mb-6">Historical Momentum</p>
            
            {sortedOffers.length > 1 ? (
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] text-[#808080] uppercase mb-1 flex items-center gap-2"><Target className="w-3 h-3 text-[#ffb800]"/> Total Package Multiplier</div>
                  <div className="text-3xl font-mono text-white">{advancedMetrics.careerVelocity.multiplier.toFixed(2)}x <span className="text-xs text-[#808080] font-sans font-normal ml-1">growth</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1f1f1f]">
                  <div>
                    <div className="text-[10px] text-[#808080] uppercase mb-1">Avg annual growth</div>
                    <div className="text-xl font-mono text-[#00ff9d]">{advancedMetrics.careerVelocity.cagr.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#808080] uppercase mb-1">Avg Days per Switch</div>
                    <div className="text-xl font-mono text-[#a855f7]">{advancedMetrics.careerVelocity.avgSwitchTimeDays} <span className="text-xs">days</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[150px] flex flex-col items-center justify-center text-center opacity-50">
                <History className="w-8 h-8 text-[#808080] mb-2" />
                <p className="text-xs text-[#808080]">Add at least 2 offers to calculate your career momentum metrics.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Component Comparison / Negotiation Insights */}
      {comparisonData && comparisonData.data.length > 0 && (
        <div className="glass-panel p-6 rounded-xl border border-[#1f1f1f]">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#ffb800]" /> Negotiation Insights
          </h2>
          <p className="text-[#808080] text-xs mb-6 font-mono uppercase tracking-widest">
            {comparisonData.previousCompanyName} vs {comparisonData.latestCompanyName}
          </p>
          
          <div className="overflow-x-auto rounded-lg border border-[#1f1f1f]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#141414]">
                <tr className="border-b border-[#1f1f1f] text-[#808080] text-[10px] uppercase font-mono tracking-wider">
                  <th className="p-4 font-normal">Component</th>
                  <th className="p-4 font-normal">{comparisonData.previousCompanyName}</th>
                  <th className="p-4 font-normal">{comparisonData.latestCompanyName}</th>
                  <th className="p-4 font-normal text-right">Difference</th>
                  <th className="p-4 font-normal text-right">% Change</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.data.map((c, i) => (
                  <tr key={i} className="border-b border-[#1f1f1f] hover:bg-[#141414] transition-colors last:border-0">
                    <td className="p-4">
                      <div className="text-sm text-white font-medium">{c.name}</div>
                      <div className="text-[10px] text-[#808080] uppercase mt-1">
                        {c.type === 'deduction' ? 'Deduction (-)' : c.type === 'annual_bonus' ? 'Annual Bonus (+)' : 'Monthly Earning (+)'} 
                        {c.isNew && <span className="text-[#00f0ff] ml-1 font-bold">(NEW)</span>}
                        {c.isRemoved && <span className="text-[#ff0055] ml-1 font-bold">(REMOVED)</span>}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm text-[#808080]">₹{c.prevAmt.toLocaleString()}</td>
                    <td className="p-4 font-mono text-sm text-white">₹{c.latestAmt.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className={`font-mono text-sm font-bold flex items-center justify-end gap-1 ${c.diff > 0 ? (c.type === 'deduction' ? 'text-[#ff0055]' : 'text-[#00ff9d]') : c.diff < 0 ? (c.type === 'deduction' ? 'text-[#00ff9d]' : 'text-[#ff0055]') : 'text-[#808080]'}`}>
                        {c.diff > 0 ? '+' : ''}₹{c.diff.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`text-xs font-mono px-2 py-1.5 rounded inline-block font-bold ${c.diff > 0 ? (c.type === 'deduction' ? 'bg-[#ff0055]/10 text-[#ff0055]' : 'bg-[#00ff9d]/10 text-[#00ff9d]') : c.diff < 0 ? (c.type === 'deduction' ? 'bg-[#00ff9d]/10 text-[#00ff9d]' : 'bg-[#ff0055]/10 text-[#ff0055]') : 'bg-[#1f1f1f] text-[#808080]'}`}>
                        {c.diff > 0 ? '+' : ''}{c.diffPercent === Infinity ? 'NEW' : `${c.diffPercent.toFixed(1)}%`}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern Depth Grid */}
      <div className="space-y-4 pb-12">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-[#808080]" /> Offer Analytics Log
        </h2>
        
        {offersWithStats.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {offersWithStats.map((offer, idx) => {
              let increment = 0;
              if (idx > 0) {
                const prev = offersWithStats[idx-1].stats.annualCTC;
                if(prev > 0) increment = ((offer.stats.annualCTC - prev) / prev) * 100;
              }
              
              return (
                <div key={offer.id} className="glass-panel p-6 rounded-xl border border-[#1f1f1f] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-[#a855f7]/10 transition-colors"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-[#141414] rounded-lg border border-[#1f1f1f]">
                          <Building2 className="w-5 h-5 text-[#a855f7]" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{offer.companyName}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#808080] font-mono mt-2 pl-12">
                        <Calendar className="w-3 h-3" /> Effective: {new Date(offer.effectiveDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-3 flex-1 md:flex-none">
                        <div className="text-[10px] text-[#808080] uppercase tracking-widest mb-1">Annual CTC</div>
                        <div className="text-lg font-mono text-[#00f0ff]">₹{offer.stats.annualCTC.toLocaleString()}</div>
                      </div>
                      <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-3 flex-1 md:flex-none">
                        <div className="text-[10px] text-[#808080] uppercase tracking-widest mb-1">Monthly Net</div>
                        <div className="text-lg font-mono text-[#00ff9d]">₹{offer.stats.monthlyInHand.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pl-0 md:pl-12">
                    {idx > 0 && (
                      <div className="flex flex-col justify-center border-l-2 border-l-[#1f1f1f] pl-4">
                        <div className="text-[10px] text-[#808080] uppercase tracking-widest">Hike vs Previous</div>
                        <div className={`font-mono font-bold text-lg flex items-center gap-1 ${increment >= 0 ? 'text-[#00ff9d]' : 'text-[#ff0055]'}`}>
                          {increment >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                          {Math.abs(increment).toFixed(1)}%
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col justify-center border-l-2 border-l-[#1f1f1f] pl-4">
                       <div className="text-[10px] text-[#808080] uppercase tracking-widest text-[#ff0055]">Total Deductions/mo</div>
                       <div className="text-sm font-mono text-[#ff0055]">-₹{offer.stats.monthlyDeductions.toLocaleString()}</div>
                    </div>
                    {offer.stats.annualBonuses > 0 && (
                      <div className="flex flex-col justify-center border-l-2 border-l-[#1f1f1f] pl-4">
                        <div className="text-[10px] text-[#808080] uppercase tracking-widest text-[#ffb800]">Annual Variable/Bonus</div>
                        <div className="text-sm font-mono text-[#ffb800]">+₹{offer.stats.annualBonuses.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-4 border-t border-[#1f1f1f]/50 bg-[#0a0a0a]/50 -mx-6 -mb-6 p-6">
                    <div className="col-span-full mb-2 flex justify-between items-center">
                       <span className="text-xs text-[#808080] uppercase tracking-wider font-bold">Line Items</span>
                       <div className="flex gap-2">
                         <button 
                           onClick={() => openEditForm(offer)}
                           className="text-[#808080] hover:text-[#00f0ff] flex items-center gap-1 text-xs font-mono uppercase bg-[#1f1f1f] px-2 py-1 rounded transition-colors"
                         >
                           <Edit2 className="w-3 h-3" /> Edit
                         </button>
                         <button 
                           onClick={() => deleteSalaryOffer(offer.id)}
                           className="text-[#808080] hover:text-[#ff0055] flex items-center gap-1 text-xs font-mono uppercase bg-[#1f1f1f] px-2 py-1 rounded transition-colors"
                         >
                           <Trash2 className="w-3 h-3" /> Remove
                         </button>
                       </div>
                    </div>
                    {offer.components.map(c => (
                      <div key={c.id} className="bg-[#141414] p-2 rounded border border-[#1f1f1f] flex flex-col hover:border-[#333] transition-colors">
                        <div className="text-[10px] text-[#808080] uppercase truncate mb-1" title={c.name}>{c.name}</div>
                        <div className={`font-mono text-sm ${c.type==='deduction' ? 'text-[#ff0055]' : c.type==='annual_bonus' ? 'text-[#ffb800]' : 'text-[#e0e0e0]'}`}>
                          {c.type==='deduction' && '-'}₹{c.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-xl text-center border-[#1f1f1f] border-dashed">
            <FileText className="w-12 h-12 text-[#808080] opacity-20 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">No Offers Evaluated Yet</h3>
            <p className="text-[#808080] text-sm max-w-md mx-auto">
              Add your current compensation breakdown and past offer letters to visualize absolute net increments across your career trajectory.
            </p>
            <button 
              onClick={openAddForm}
              className="mt-6 inline-flex items-center gap-2 text-[#a855f7] hover:text-white transition-colors text-sm font-mono tracking-widest uppercase border border-[#a855f7]/30 px-6 py-3 rounded-lg hover:bg-[#a855f7]/10"
            >
              <Plus className="w-4 h-4" /> START TRACKING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const BookOpenIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

