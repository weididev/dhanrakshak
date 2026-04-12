import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { User, Briefcase, Target, Save, CheckCircle2, Download, Upload, AlertTriangle, Database } from 'lucide-react';

export function Profile() {
  const { userProfile, updateProfile, exportData, importData, importAxioCSV } = useFinance();
  const [formData, setFormData] = useState(userProfile);
  const [saved, setSaved] = useState(false);
  const [importError, setImportError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      hourlyWage: formData.monthlyIncome / (formData.workHoursPerWeek * 4.33)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      let success = false;
      if (file.name.toLowerCase().endsWith('.csv')) {
        success = importAxioCSV(content);
      } else {
        success = importData(content);
      }

      if (success) {
        window.location.reload();
      } else {
        setImportError(true);
        setTimeout(() => setImportError(false), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Commander Profile</h1>
        <p className="text-[#808080] font-mono text-sm mt-1">MODULE: IDENTITY_AND_PARAMETERS</p>
      </header>

      <div className="glass-panel p-6 rounded-xl neon-border border-[#a855f7]/30 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-5 h-5 text-[#a855f7]" />
          <h2 className="text-xl font-bold text-white">Data Management</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={exportData}
            className="flex items-center justify-center gap-2 bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30 px-4 py-3 rounded-xl hover:bg-[#a855f7]/20 transition-all font-mono text-sm"
          >
            <Download className="w-4 h-4" /> EXPORT_BACKUP
          </button>
          <div className="relative">
            <input 
              type="file" 
              accept=".json,.csv"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button 
              className="w-full flex items-center justify-center gap-2 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 px-4 py-3 rounded-xl hover:bg-[#00f0ff]/20 transition-all font-mono text-sm"
            >
              <Upload className="w-4 h-4" /> IMPORT_DATA (JSON/CSV)
            </button>
          </div>
          <div className="relative">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button 
              className="w-full flex items-center justify-center gap-2 bg-[#00ff9d]/5 text-[#00ff9d] border border-[#00ff9d]/20 px-4 py-3 rounded-xl hover:bg-[#00ff9d]/10 transition-all font-mono text-xs"
            >
              <Database className="w-3 h-3" /> LOAD_SAMPLE
            </button>
          </div>
        </div>
        {importError && (
          <p className="text-[#ff0055] text-xs font-mono mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> INVALID_BACKUP_FILE
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="glass-panel p-6 rounded-xl neon-border border-[#00f0ff]/30">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[#00f0ff]" />
            <h2 className="text-xl font-bold text-white">Personal Identity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Current Age</label>
              <input 
                type="number" 
                value={formData.currentAge}
                onChange={e => setFormData({...formData, currentAge: Number(e.target.value)})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Dependents</label>
              <input 
                type="number" 
                value={formData.dependents}
                onChange={e => setFormData({...formData, dependents: Number(e.target.value)})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Income Engine */}
        <div className="glass-panel p-6 rounded-xl neon-border border-[#00ff9d]/30">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-5 h-5 text-[#00ff9d]" />
            <h2 className="text-xl font-bold text-white">Income Engine</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Monthly Income (₹)</label>
              <input 
                type="number" 
                value={formData.monthlyIncome}
                onChange={e => setFormData({...formData, monthlyIncome: Number(e.target.value)})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-[#00ff9d] focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Work Hours per Week</label>
              <input 
                type="number" 
                value={formData.workHoursPerWeek}
                onChange={e => setFormData({...formData, workHoursPerWeek: Number(e.target.value)})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
              />
            </div>
            <div className="md:col-span-2 p-4 bg-[#141414] rounded-lg border border-[#1f1f1f]">
              <div className="text-xs text-[#808080] uppercase tracking-wider mb-1">Calculated Real Hourly Wage (Life Energy)</div>
              <div className="text-2xl font-mono text-white">₹{Math.round(formData.monthlyIncome / (formData.workHoursPerWeek * 4.33)).toLocaleString()}/hr</div>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="glass-panel p-6 rounded-xl neon-border border-[#ffb800]/30">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-[#ffb800]" />
            <h2 className="text-xl font-bold text-white">Freedom Goals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Target Retirement Age</label>
              <input 
                type="number" 
                value={formData.targetRetirementAge}
                onChange={e => setFormData({...formData, targetRetirementAge: Number(e.target.value)})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-[#ffb800] focus:outline-none focus:border-[#ffb800] transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Monthly Fixed Costs (₹)</label>
              <input 
                type="number" 
                value={formData.monthlyFixedCosts}
                onChange={e => setFormData({...formData, monthlyFixedCosts: Number(e.target.value)})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffb800] transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          {saved && <span className="text-[#00ff9d] flex items-center gap-2 text-sm font-mono"><CheckCircle2 className="w-4 h-4" /> PROFILE_UPDATED</span>}
          <button 
            type="submit"
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e0e0e0] transition-colors"
          >
            <Save className="w-4 h-4" /> SAVE PARAMETERS
          </button>
        </div>
      </form>
    </div>
  );
}
