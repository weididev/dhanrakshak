import React, { useState } from 'react';
import { useFinance, Salary } from '../context/FinanceContext';
import { Plus, Trash2, Calendar, DollarSign, CheckCircle2, Clock, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Salaries() {
  const { salaries = [], assets = [], addSalary, updateSalary, deleteSalary } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [receivingSalary, setReceivingSalary] = useState<Salary | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isReceived: true,
    linkedAssetId: ''
  });

  const [receiveAssetId, setReceiveAssetId] = useState('');

  const bankAssets = assets.filter(a => ['cash', 'investment', 'emergency_fund'].includes(a.type));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const salaryData = {
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.description,
      isReceived: formData.isReceived,
      linkedAssetId: formData.linkedAssetId || undefined
    };

    addSalary(salaryData);

    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      isReceived: true,
      linkedAssetId: ''
    });
    setIsAdding(false);
  };

  const handleMarkAsReceived = (salary: Salary) => {
    if (salary.linkedAssetId) {
      updateSalary(salary.id, { isReceived: true });
    } else {
      setReceivingSalary(salary);
      setReceiveAssetId('');
    }
  };

  const confirmReceive = () => {
    if (receivingSalary) {
      updateSalary(receivingSalary.id, { 
        isReceived: true, 
        linkedAssetId: receiveAssetId || undefined 
      });
      setReceivingSalary(null);
    }
  };

  const totalReceived = salaries.filter(s => s.isReceived).reduce((acc, s) => acc + s.amount, 0);
  const totalPending = salaries.filter(s => !s.isReceived).reduce((acc, s) => acc + s.amount, 0);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#00ff9d]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest">Total Received</h3>
              <div className="text-4xl font-mono text-white mt-1">₹{totalReceived.toLocaleString('en-IN')}</div>
            </div>
            <CheckCircle2 className="w-12 h-12 text-[#00ff9d] opacity-20" />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#ffb800]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest">Expected / Pending</h3>
              <div className="text-4xl font-mono text-white mt-1">₹{totalPending.toLocaleString('en-IN')}</div>
            </div>
            <Clock className="w-12 h-12 text-[#ffb800] opacity-20" />
          </div>
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
                <DollarSign className="w-5 h-5 text-[#00ff9d]" /> Add Income Entry
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

                <div className="flex items-center gap-3 p-3 bg-[#141414] rounded-lg border border-[#1f1f1f]">
                  <input 
                    type="checkbox"
                    id="isReceived"
                    checked={formData.isReceived}
                    onChange={e => setFormData({...formData, isReceived: e.target.checked})}
                    className="w-4 h-4 accent-[#00ff9d]"
                  />
                  <label htmlFor="isReceived" className="text-sm text-white cursor-pointer">Already Received?</label>
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

      <AnimatePresence>
        {receivingSalary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#ffb800]/30 shadow-[0_0_50px_rgba(255,184,0,0.1)]"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#ffb800]" /> Mark as Received
              </h2>
              <p className="text-[#808080] mb-6">Select the account where this income (₹{receivingSalary.amount.toLocaleString()}) was deposited.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Deposit To</label>
                  <select 
                    value={receiveAssetId}
                    onChange={e => setReceiveAssetId(e.target.value)}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffb800] transition-colors"
                  >
                    <option value="">No linked account (Transaction only)</option>
                    {bankAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name} (₹{asset.amount.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setReceivingSalary(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#1f1f1f] text-[#808080] hover:bg-[#1f1f1f] transition-colors font-mono text-sm"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={confirmReceive}
                    className="flex-1 bg-[#ffb800] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#ffb800]/80 transition-colors shadow-[0_0_15px_rgba(255,184,0,0.3)]"
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
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
                <th className="p-4 font-normal text-center">Status</th>
                <th className="p-4 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length > 0 ? salaries.map((s) => (
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
                    {s.isReceived ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#00ff9d]/10 text-[#00ff9d] text-[10px] font-mono border border-[#00ff9d]/20">
                        <CheckCircle2 className="w-3 h-3" /> RECEIVED
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleMarkAsReceived(s)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#ffb800]/10 text-[#ffb800] text-[10px] font-mono border border-[#ffb800]/20 hover:bg-[#ffb800]/20 transition-all"
                      >
                        <Clock className="w-3 h-3" /> MARK RECEIVED
                      </button>
                    )}
                  </td>
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
                  <td colSpan={5} className="p-8 text-center text-[#808080] font-mono text-sm">
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
