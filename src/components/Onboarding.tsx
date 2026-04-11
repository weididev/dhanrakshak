import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Shield, ArrowRight, User, Briefcase, Target } from 'lucide-react';

export function Onboarding() {
  const { updateProfile } = useFinance();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    currentAge: 25,
    dependents: 0,
    monthlyIncome: 50000,
    targetRetirementAge: 50,
    workHoursPerWeek: 40,
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      updateProfile({
        ...formData,
        hasOnboarded: true,
        hourlyWage: formData.monthlyIncome / (formData.workHoursPerWeek * 4.33)
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00f0ff]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00ff9d]/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Shield className="w-12 h-12 text-[#00f0ff]" />
          <span className="font-sans font-bold text-3xl tracking-widest text-white">DHANRAKSHAK</span>
        </div>

        <div className="glass-panel p-8 rounded-2xl neon-border border-[#00f0ff]/30 relative">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#141414] rounded-t-2xl overflow-hidden">
            <div className="h-full bg-[#00f0ff] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff]"><User className="w-6 h-6" /></div>
                <h2 className="text-2xl font-bold">Welcome. Who are you?</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Your Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] transition-colors text-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Current Age</label>
                    <input 
                      type="number" 
                      value={formData.currentAge}
                      onChange={e => setFormData({...formData, currentAge: Number(e.target.value)})}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Dependents</label>
                    <input 
                      type="number" 
                      value={formData.dependents}
                      onChange={e => setFormData({...formData, dependents: Number(e.target.value)})}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#00ff9d]/10 rounded-xl text-[#00ff9d]"><Briefcase className="w-6 h-6" /></div>
                <h2 className="text-2xl font-bold">Your Income Engine</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Monthly Income (₹)</label>
                  <input 
                    type="number" 
                    value={formData.monthlyIncome}
                    onChange={e => setFormData({...formData, monthlyIncome: Number(e.target.value)})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#00ff9d] focus:outline-none focus:border-[#00ff9d] transition-colors font-mono text-xl"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Work Hours per Week</label>
                  <input 
                    type="number" 
                    value={formData.workHoursPerWeek}
                    onChange={e => setFormData({...formData, workHoursPerWeek: Number(e.target.value)})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono text-lg"
                  />
                  <p className="text-[10px] text-[#808080] mt-2">Used to calculate your "Real Hourly Wage" (Life Energy).</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#ffb800]/10 rounded-xl text-[#ffb800]"><Target className="w-6 h-6" /></div>
                <h2 className="text-2xl font-bold">Your Freedom Goal</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#808080] uppercase tracking-wider mb-2 block">Target Retirement Age</label>
                  <input 
                    type="number" 
                    value={formData.targetRetirementAge}
                    onChange={e => setFormData({...formData, targetRetirementAge: Number(e.target.value)})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#ffb800] focus:outline-none focus:border-[#ffb800] transition-colors font-mono text-xl"
                  />
                  <p className="text-sm text-[#808080] mt-4">
                    You have <strong className="text-white font-mono">{formData.targetRetirementAge - formData.currentAge} years</strong> to build your wealth engine. Let's automate your path to financial independence.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={step === 1 && !formData.name}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e0e0e0] transition-colors disabled:opacity-50"
            >
              {step === 3 ? 'INITIALIZE SYSTEM' : 'CONTINUE'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
