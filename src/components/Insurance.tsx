import React, { useState } from 'react';
import { useFinance, InsuranceType } from '../context/FinanceContext';
import { Plus, Trash2, HeartPulse, ShieldCheck } from 'lucide-react';

export const Insurance = () => {
  const { insurances = [], addInsurance, deleteInsurance } = useFinance();
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    type: 'health' as InsuranceType,
    name: '',
    coverAmount: '',
    premium: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.coverAmount || !formData.premium) return;
    
    addInsurance({
      type: formData.type,
      name: formData.name,
      coverAmount: Number(formData.coverAmount),
      premium: Number(formData.premium)
    });
    
    setFormData({
      type: 'health',
      name: '',
      coverAmount: '',
      premium: ''
    });
    setIsAdding(false);
  };

  const healthCover = insurances.filter(i => i.type === 'health').reduce((acc, i) => acc + i.coverAmount, 0);
  const lifeCover = insurances.filter(i => i.type === 'life').reduce((acc, i) => acc + i.coverAmount, 0);
  const totalPremium = insurances.reduce((acc, i) => acc + i.premium, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Insurance & Protection</h1>
          <p className="text-[#808080] font-mono text-sm mt-1">MODULE: RISK_MITIGATION</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#ff0055]/10 text-[#ff0055] border border-[#ff0055]/30 px-4 py-2 rounded-lg hover:bg-[#ff0055]/20 transition-all shadow-[0_0_15px_rgba(255,0,85,0.1)]"
        >
          <Plus className="w-4 h-4" />
          <span className="font-mono text-sm uppercase tracking-wider">{isAdding ? 'CANCEL' : 'ADD POLICY'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Total Health Cover" amount={healthCover} icon={<HeartPulse className="text-[#ff0055]" />} color="text-[#ff0055]" />
        <SummaryCard title="Total Life Cover" amount={lifeCover} icon={<ShieldCheck className="text-[#00f0ff]" />} color="text-[#00f0ff]" />
        <SummaryCard title="Annual Premium" amount={totalPremium} icon={<span className="text-[#ffb800] font-bold">₹</span>} color="text-[#ffb800]" />
      </div>

      {isAdding && (
        <div className="glass-panel p-6 rounded-xl neon-border mb-8 border-[#ff0055]/30 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Policy Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as InsuranceType})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors"
              >
                <option value="health">Health Insurance</option>
                <option value="life">Term/Life Insurance</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Provider/Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors"
                placeholder="e.g. HDFC Ergo Optima"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Cover Amount (₹)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.coverAmount}
                onChange={e => setFormData({...formData, coverAmount: e.target.value})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Annual Premium (₹)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.premium}
                onChange={e => setFormData({...formData, premium: e.target.value})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                placeholder="0.00"
              />
            </div>

            <div className="lg:col-span-4 flex justify-end mt-2">
              <button 
                type="submit"
                className="bg-[#ff0055] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#ff0055]/80 transition-colors shadow-[0_0_15px_rgba(255,0,85,0.3)]"
              >
                SAVE POLICY
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a]">
              <tr className="border-b border-[#1f1f1f] text-[#808080] text-xs font-mono uppercase tracking-wider">
                <th className="p-4 font-normal">Policy Name</th>
                <th className="p-4 font-normal">Type</th>
                <th className="p-4 font-normal text-right">Cover Amount</th>
                <th className="p-4 font-normal text-right">Premium/Yr</th>
                <th className="p-4 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {insurances.length > 0 ? insurances.map((i) => (
                <tr key={i.id} className="border-b border-[#1f1f1f]/50 hover:bg-[#141414] transition-colors">
                  <td className="p-4 text-sm text-white font-medium">{i.name}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      i.type === 'health' ? 'bg-[#ff0055]/10 text-[#ff0055] border border-[#ff0055]/20' : 
                      'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20'
                    }`}>
                      {i.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-right text-white">
                    ₹{i.coverAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-sm font-mono text-right text-[#808080]">
                    ₹{i.premium.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => deleteInsurance(i.id)}
                      className="text-[#808080] hover:text-[#ff0055] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#808080] font-mono text-sm">
                    NO_POLICIES_RECORDED
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

function SummaryCard({ title, amount, icon, color }: { title: string, amount: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="glass-panel p-5 rounded-xl border-t-2 border-t-transparent hover:border-t-[#ff0055] transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[#808080] text-sm font-medium">{title}</h3>
        <div className="p-2 bg-[#141414] rounded-lg">{icon}</div>
      </div>
      <div className={`text-3xl font-mono ${color}`}>
        ₹{amount.toLocaleString('en-IN')}
      </div>
    </div>
  );
}
