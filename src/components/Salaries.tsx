import React, { useState, useMemo } from 'react';
import { useFinance, Salary } from '../context/FinanceContext';
import { Plus, Trash2, Calendar, IndianRupee, CheckCircle2, Clock, Landmark, ArrowUpDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Salaries() {
  const { salaries = [], assets = [], addSalary, deleteSalary } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    linkedAssetId: ''
  });

  const bankAssets = assets.filter(a => ['cash', 'investment', 'emergency_fund'].includes(a.type));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const salaryData = {
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.description,
      linkedAssetId: formData.linkedAssetId || undefined
    };

    addSalary(salaryData);

    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      linkedAssetId: ''
    });
    setIsAdding(false);
  };

  const totalReceived = salaries.reduce((acc, s) => acc + s.amount, 0);

  const filteredAndSortedSalaries = useMemo(() => {
    let result = salaries.filter(s => 
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [salaries, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Income & Salaries</h1>
          <p className="text-[#808080] font-mono text-sm mt-1">MODULE: REVENUE_TRACKER</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-4 py-2 rounded-lg hover:bg-[#00ff9d]/20 transition-all shadow-[0_0_15px_rgba(0,255,157,0.1)]"
        >
          <Plus className="w-4 h-4" />
          <span className="font-mono text-sm uppercase tracking-wider">ADD INCOME</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#00ff9d]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest">Total Income Recorded</h3>
              <div className="text-4xl font-mono text-white mt-1">₹{totalReceived.toLocaleString('en-IN')}</div>
            </div>
            <CheckCircle2 className="w-12 h-12 text-[#00ff9d] opacity-20" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
          <input 
            type="text" 
            placeholder="Search income..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#141414] border border-[#1f1f1f] rounded-lg px-3 py-2">
          <ArrowUpDown className="w-4 h-4 text-[#808080]" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-white focus:outline-none text-sm"
          >
            <option value="date_desc">Latest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="amount_asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#00ff9d]/30 shadow-[0_0_50px_rgba(0,255,157,0.1)]"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#00ff9d]" /> Add Income Entry
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Description</label>
                  <input 
                    type="text" 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                    placeholder="e.g. March Salary, Freelance Project"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Deposit To (Optional)</label>
                  <select 
                    value={formData.linkedAssetId}
                    onChange={e => setFormData({...formData, linkedAssetId: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                  >
                    <option value="">No linked account</option>
                    {bankAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name} (₹{asset.amount.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#1f1f1f] text-[#808080] hover:bg-[#1f1f1f] transition-colors font-mono text-sm"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#00ff9d] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#00ff9d]/80 transition-colors shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                  >
                    SAVE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a]">
              <tr className="border-b border-[#1f1f1f] text-[#808080] text-xs font-mono uppercase tracking-wider">
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Description</th>
                <th className="p-4 font-normal text-right">Amount</th>
                <th className="p-4 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSalaries.length > 0 ? filteredAndSortedSalaries.map((s) => (
                <tr key={s.id} className="border-b border-[#1f1f1f]/50 hover:bg-[#141414] transition-colors">
                  <td className="p-4 text-sm text-[#808080] font-mono">
                    {new Date(s.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-sm text-white font-medium">
                    {s.description}
                    {s.linkedAssetId && (
                      <div className="text-[10px] text-[#808080] font-mono mt-0.5 flex items-center gap-1">
                        <Landmark className="w-3 h-3" /> {assets.find(a => a.id === s.linkedAssetId)?.name || 'Linked Account'}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm font-mono text-right text-[#00ff9d]">₹{s.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => deleteSalary(s.id)}
                      className="text-[#808080] hover:text-[#ff0055] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#808080] font-mono text-sm">
                    NO_INCOME_RECORDS_FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

