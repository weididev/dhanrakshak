import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Book, 
  TrendingUp, 
  Shield, 
  Zap, 
  Clock, 
  Target, 
  Coffee, 
  Flame, 
  ArrowRight, 
  ChevronRight,
  Calculator,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  ProfitFirstTool, 
  MillionaireMindTool, 
  MasterMoneyTool, 
  BogleheadsTool, 
  FastSlowTool, 
  ERETool, 
  EverydayMillionairesTool, 
  CommonSenseTool, 
  RandomWalkTool, 
  ZeroBasedTool, 
  EssentialismTool, 
  NavalTool 
} from './StrategyTools';

export const Strategies = () => {
  const { transactions = [], assets = [], liabilities = [], insurances = [], userProfile, updateProfile } = useFinance();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const emi = currentMonthTransactions.filter(t => t.type === 'emi').reduce((acc, t) => acc + t.amount, 0);
  const totalOutflow = expense + emi;
  const savings = income - totalOutflow;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const totalAssets = assets.reduce((acc, a) => acc + a.amount, 0);
  const totalLiabilities = liabilities.reduce((acc, l) => acc + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  const books = [
    { id: 'rich-dad', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', icon: TrendingUp, color: 'text-[#00f0ff]' },
    { id: 'psychology', title: 'Psychology of Money', author: 'Morgan Housel', icon: Book, color: 'text-[#ffb800]' },
    { id: 'babylon', title: 'Richest Man in Babylon', author: 'George S. Clason', icon: Shield, color: 'text-[#00ff9d]' },
    { id: 'ymyl', title: 'Your Money or Your Life', author: 'Vicki Robin', icon: Clock, color: 'text-[#ff0055]' },
    { id: 'iwt', title: 'I Will Teach You To Be Rich', author: 'Ramit Sethi', icon: Zap, color: 'text-[#a855f7]' },
    { id: 'makeover', title: 'Total Money Makeover', author: 'Dave Ramsey', icon: Target, color: 'text-[#3b82f6]' },
    { id: 'barefoot', title: 'Barefoot Investor', author: 'Scott Pape', icon: Shield, color: 'text-[#f97316]' },
    { id: 'die-zero', title: 'Die With Zero', author: 'Bill Perkins', icon: Flame, color: 'text-[#ef4444]' },
    { id: 'automatic', title: 'Automatic Millionaire', author: 'David Bach', icon: Coffee, color: 'text-[#06b6d4]' },
    { id: 'freedom', title: 'Financial Freedom', author: 'Grant Sabatier', icon: Zap, color: 'text-[#10b981]' },
    { id: 'profit-first', title: 'Profit First', author: 'Mike Michalowicz', icon: Target, color: 'text-[#00ff9d]' },
    { id: 'millionaire-mind', title: 'Secrets of the Millionaire Mind', author: 'T. Harv Eker', icon: Book, color: 'text-[#a855f7]' },
    { id: 'master-money', title: 'Money: Master the Game', author: 'Tony Robbins', icon: Shield, color: 'text-[#3b82f6]' },
    { id: 'bogleheads', title: 'Bogleheads Guide to Investing', author: 'Taylor Larimore', icon: TrendingUp, color: 'text-[#ff0055]' },
    { id: 'fast-slow', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', icon: Clock, color: 'text-[#00f0ff]' },
    { id: 'ere', title: 'Early Retirement Extreme', author: 'Jacob Lund Fisker', icon: Flame, color: 'text-[#00ff9d]' },
    { id: 'everyday-millionaires', title: 'Everyday Millionaires', author: 'Chris Hogan', icon: Target, color: 'text-[#ffb800]' },
    { id: 'common-sense', title: 'Little Book of Common Sense', author: 'John C. Bogle', icon: Book, color: 'text-[#3b82f6]' },
    { id: 'random-walk', title: 'Random Walk Down Wall Street', author: 'Burton Malkiel', icon: TrendingUp, color: 'text-[#a855f7]' },
    { id: 'zero-based', title: 'Zero-Based Budgeting', author: 'Various', icon: Target, color: 'text-[#00f0ff]' },
    { id: 'essentialism', title: 'Essentialism', author: 'Greg McKeown', icon: Shield, color: 'text-[#ff0055]' },
    { id: 'naval', title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', icon: Zap, color: 'text-[#00f0ff]' },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Financial Wisdom Hub</h1>
        <p className="text-[#808080] font-mono text-sm mt-1">STRATEGY_ENGINE: MULTI_BOOK_ANALYSIS</p>
      </header>

      {!selectedBook ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => {
            const Icon = book.icon;
            return (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book.id)}
                className="glass-panel p-6 rounded-xl text-left hover:border-[#00f0ff]/50 transition-all group relative overflow-hidden"
              >
                <div className={cn("mb-4 p-3 bg-[#141414] rounded-lg w-fit group-hover:scale-110 transition-transform", book.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{book.title}</h3>
                <p className="text-[#808080] text-sm mb-4">{book.author}</p>
                <div className="flex items-center text-xs font-mono text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN TOOL <ChevronRight className="w-3 h-3 ml-1" />
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Icon className="w-24 h-24" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={() => setSelectedBook(null)}
            className="text-[#808080] hover:text-white flex items-center gap-2 font-mono text-xs mb-4"
          >
            <ArrowRight className="w-3 h-3 rotate-180" /> BACK TO HUB
          </button>

          {selectedBook === 'rich-dad' && <RichDadTool income={income} totalOutflow={totalOutflow} assets={totalAssets} liabilities={totalLiabilities} />}
          {selectedBook === 'psychology' && <PsychologyTool savingsRate={savingsRate} savings={savings} />}
          {selectedBook === 'babylon' && <BabylonTool income={income} savings={savings} />}
          {selectedBook === 'ymyl' && <YMYLTool userProfile={userProfile} updateProfile={updateProfile} income={income} totalOutflow={totalOutflow} />}
          {selectedBook === 'iwt' && <IWTTool income={income} userProfile={userProfile} updateProfile={updateProfile} />}
          {selectedBook === 'makeover' && <MakeoverTool liabilities={liabilities} emergencyFund={assets.filter(a => a.type === 'emergency_fund').reduce((acc, a) => acc + a.amount, 0)} />}
          {selectedBook === 'barefoot' && <BarefootTool income={income} />}
          {selectedBook === 'die-zero' && <DieZeroTool netWorth={netWorth} userProfile={userProfile} />}
          {selectedBook === 'automatic' && <AutomaticTool income={income} />}
          {selectedBook === 'freedom' && <FreedomTool savings={savings} totalOutflow={totalOutflow} />}
          {selectedBook === 'profit-first' && <ProfitFirstTool income={income} />}
          {selectedBook === 'millionaire-mind' && <MillionaireMindTool income={income} />}
          {selectedBook === 'master-money' && <MasterMoneyTool assets={totalAssets} />}
          {selectedBook === 'bogleheads' && <BogleheadsTool />}
          {selectedBook === 'fast-slow' && <FastSlowTool />}
          {selectedBook === 'ere' && <ERETool savingsRate={savingsRate} />}
          {selectedBook === 'everyday-millionaires' && <EverydayMillionairesTool netWorth={netWorth} />}
          {selectedBook === 'common-sense' && <CommonSenseTool />}
          {selectedBook === 'random-walk' && <RandomWalkTool />}
          {selectedBook === 'zero-based' && <ZeroBasedTool income={income} totalOutflow={totalOutflow} savings={savings} />}
          {selectedBook === 'essentialism' && <EssentialismTool />}
          {selectedBook === 'naval' && <NavalTool />}
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS FOR EACH BOOK ---

function RichDadTool({ income, totalOutflow, assets, liabilities }: any) {
  const passiveIncome = assets * 0.0066; // Assume 8% annual
  const ratRaceProgress = totalOutflow > 0 ? (passiveIncome / totalOutflow) * 100 : 0;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#00f0ff]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Asset vs Liability Tracker</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="p-4 bg-[#00ff9d]/5 border border-[#00ff9d]/20 rounded-lg">
            <h3 className="text-[#00ff9d] font-bold text-sm uppercase mb-1">Assets (Income Generator)</h3>
            <div className="text-3xl font-mono text-white">₹{assets.toLocaleString()}</div>
            <p className="text-xs text-[#808080] mt-2">Generates ~₹{passiveIncome.toFixed(0)}/mo passive income</p>
          </div>
          <div className="p-4 bg-[#ff0055]/5 border border-[#ff0055]/20 rounded-lg">
            <h3 className="text-[#ff0055] font-bold text-sm uppercase mb-1">Liabilities (Money Drain)</h3>
            <div className="text-3xl font-mono text-white">₹{liabilities.toLocaleString()}</div>
            <p className="text-xs text-[#808080] mt-2">These take money out of your pocket every month.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-white font-bold mb-4">Rat Race Escape Progress</h3>
          <div className="w-full bg-[#141414] rounded-full h-8 border border-[#1f1f1f] overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-[#00f0ff] to-[#00ff9d] h-full transition-all duration-1000"
              style={{ width: `${Math.min(100, ratRaceProgress)}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
              {ratRaceProgress.toFixed(1)}% ESCAPED
            </div>
          </div>
          <p className="text-xs text-[#808080] mt-4 text-center italic">
            "The rich buy assets. The poor only have expenses. The middle class buy liabilities they think are assets."
          </p>
        </div>
      </div>
    </div>
  );
}

function PsychologyTool({ savingsRate, savings }: any) {
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(12);

  const calculateCompounding = () => {
    const data = [];
    let balance = 0;
    const monthlyContribution = savings;
    const monthlyRate = returnRate / 100 / 12;

    for (let i = 0; i <= years; i++) {
      data.push({
        year: i,
        balance: Math.round(balance),
        contributions: Math.round(monthlyContribution * 12 * i)
      });
      for (let j = 0; j < 12; j++) {
        balance = (balance + monthlyContribution) * (1 + monthlyRate);
      }
    }
    return data;
  };

  const data = calculateCompounding();

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#ffb800]/30">
      <h2 className="text-2xl font-bold text-white mb-2">Compounding Visualizer</h2>
      <p className="text-[#808080] text-sm mb-8">"Wealth is just the accumulated leftovers after you spend what you take in."</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-4 bg-[#141414] rounded-lg border border-[#1f1f1f]">
            <label className="text-xs text-[#808080] uppercase block mb-2">Monthly Savings: ₹{savings.toLocaleString()}</label>
            <div className="text-xl font-mono text-[#00ff9d]">{savingsRate.toFixed(1)}% Savings Rate</div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#808080] uppercase block mb-2">Time Horizon: {years} Years</label>
              <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[#ffb800]" />
            </div>
            <div>
              <label className="text-xs text-[#808080] uppercase block mb-2">Expected Return: {returnRate}%</label>
              <input type="range" min="1" max="30" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="w-full accent-[#ffb800]" />
            </div>
          </div>
          <div className="p-4 bg-[#ffb800]/10 border border-[#ffb800]/30 rounded-lg">
            <h4 className="text-[#ffb800] font-bold text-sm mb-1">Future Wealth</h4>
            <div className="text-2xl font-mono text-white">₹{data[data.length - 1].balance.toLocaleString()}</div>
          </div>
        </div>
        <div className="lg:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb800" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ffb800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
              <XAxis dataKey="year" stroke="#808080" fontSize={10} />
              <YAxis stroke="#808080" fontSize={10} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f' }}
                formatter={(v: any) => [`₹${v.toLocaleString()}`, 'Balance']}
              />
              <Area type="monotone" dataKey="balance" stroke="#ffb800" fillOpacity={1} fill="url(#colorBalance)" />
              <Area type="monotone" dataKey="contributions" stroke="#808080" fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function BabylonTool({ income, savings }: any) {
  const payYourselfFirst = income * 0.1;
  const isFollowingRule = savings >= payYourselfFirst;

  const cures = [
    "Start thy purse to fattening (Save 10%)",
    "Control thy expenditures (Budget)",
    "Make thy gold multiply (Invest)",
    "Guard thy treasures from loss (Insurance)",
    "Make of thy dwelling a profitable investment",
    "Insure a future income (Retirement)",
    "Increase thy ability to earn (Skills)"
  ];

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#00ff9d]/30">
      <h2 className="text-2xl font-bold text-white mb-6">7 Cures for a Lean Purse</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className={cn(
            "p-6 rounded-xl border transition-all",
            isFollowingRule ? "bg-[#00ff9d]/10 border-[#00ff9d]/30" : "bg-[#ff0055]/10 border-[#ff0055]/30"
          )}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold">10% Pay Yourself First</h3>
              {isFollowingRule ? <CheckCircle2 className="text-[#00ff9d]" /> : <AlertCircle className="text-[#ff0055]" />}
            </div>
            <div className="text-3xl font-mono mb-2">₹{payYourselfFirst.toLocaleString()}</div>
            <p className="text-sm opacity-80">
              {isFollowingRule 
                ? "Excellent! You are paying yourself at least 10% of your income." 
                : `You need to save at least ₹${payYourselfFirst.toLocaleString()} to follow this rule.`}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">The 7 Cures Checklist</h3>
          {cures.map((cure, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#141414] rounded-lg border border-[#1f1f1f]">
              <div className="w-6 h-6 rounded-full bg-[#00ff9d]/20 text-[#00ff9d] flex items-center justify-center text-xs font-bold">
                {i+1}
              </div>
              <span className="text-sm text-[#e0e0e0]">{cure}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function YMYLTool({ userProfile, updateProfile, income, totalOutflow }: any) {
  const [wage, setWage] = useState(userProfile.hourlyWage);
  const [hours, setHours] = useState(userProfile.workHoursPerWeek);

  const monthlyHours = hours * 4.33;
  const realHourlyWage = income / monthlyHours;
  
  const itemCost = 5000; // Example item
  const lifeEnergyCost = itemCost / realHourlyWage;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#ff0055]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Real Hourly Wage (Life Energy)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-xs text-[#808080] uppercase block mb-2">Work Hours Per Week</label>
            <input 
              type="number" 
              value={hours} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setHours(val);
                updateProfile({ workHoursPerWeek: val });
              }} 
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white font-mono"
            />
          </div>
          <div className="p-6 bg-[#ff0055]/10 border border-[#ff0055]/30 rounded-xl">
            <h3 className="text-[#ff0055] font-bold text-sm uppercase mb-1">Your Real Hourly Wage</h3>
            <div className="text-4xl font-mono text-white">₹{realHourlyWage.toFixed(2)}</div>
            <p className="text-xs text-[#808080] mt-2">This is what 1 hour of your life is actually worth in cash.</p>
          </div>
        </div>
        <div className="p-6 bg-[#141414] rounded-xl border border-[#1f1f1f]">
          <h3 className="text-white font-bold mb-4">Life Energy Calculator</h3>
          <p className="text-sm text-[#808080] mb-6">How many hours of your life does a ₹5,000 purchase cost?</p>
          <div className="text-center">
            <div className="text-5xl font-mono text-[#00f0ff] mb-2">{lifeEnergyCost.toFixed(1)}</div>
            <div className="text-xs text-[#808080] uppercase tracking-widest">HOURS OF LIFE ENERGY</div>
          </div>
          <div className="mt-8 p-4 bg-[#050505] rounded-lg border border-[#1f1f1f] italic text-xs text-[#808080]">
            "Money is something you trade your life energy for. You sell your time for money. It doesn't matter that you call it a career. This is the reality."
          </div>
        </div>
      </div>
    </div>
  );
}

function IWTTool({ income, userProfile, updateProfile }: any) {
  const [fixed, setFixed] = useState(50);
  const [invest, setInvest] = useState(10);
  const [savings, setSavings] = useState(10);
  const [guiltFree, setGuiltFree] = useState(30);

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#a855f7]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Conscious Spending Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Slider label="Fixed Costs (Target: 50-60%)" value={fixed} onChange={setFixed} color="accent-[#3b82f6]" />
          <Slider label="Investments (Target: 10%)" value={invest} onChange={setInvest} color="accent-[#00ff9d]" />
          <Slider label="Savings Goals (Target: 5-10%)" value={savings} onChange={setSavings} color="accent-[#ffb800]" />
          <Slider label="Guilt-Free Spending (Target: 20-35%)" value={guiltFree} onChange={setGuiltFree} color="accent-[#ff0055]" />
        </div>
        <div className="space-y-4">
          <h3 className="text-white font-bold mb-4">Monthly Allocation</h3>
          <AllocationRow label="Fixed Costs" amount={income * (fixed/100)} percent={fixed} color="text-[#3b82f6]" />
          <AllocationRow label="Investments" amount={income * (invest/100)} percent={invest} color="text-[#00ff9d]" />
          <AllocationRow label="Savings" amount={income * (savings/100)} percent={savings} color="text-[#ffb800]" />
          <AllocationRow label="Guilt-Free" amount={income * (guiltFree/100)} percent={guiltFree} color="text-[#ff0055]" />
          
          <div className={cn(
            "mt-6 p-4 rounded-lg border text-center font-mono text-sm",
            (fixed + invest + savings + guiltFree) === 100 ? "bg-[#00ff9d]/10 border-[#00ff9d]/30 text-[#00ff9d]" : "bg-[#ff0055]/10 border-[#ff0055]/30 text-[#ff0055]"
          )}>
            TOTAL: {fixed + invest + savings + guiltFree}%
          </div>
        </div>
      </div>
    </div>
  );
}

function MakeoverTool({ liabilities, emergencyFund }: any) {
  const steps = [
    { id: 1, title: "₹1,000 Starter Emergency Fund", status: emergencyFund >= 1000 ? 'done' : 'current' },
    { id: 2, title: "Debt Snowball (Pay off all debt)", status: liabilities.length === 0 ? 'done' : emergencyFund >= 1000 ? 'current' : 'todo' },
    { id: 3, title: "3-6 Months Emergency Fund", status: 'todo' },
    { id: 4, title: "Invest 15% for Retirement", status: 'todo' },
    { id: 5, title: "College Funding", status: 'todo' },
    { id: 6, title: "Pay off Home Early", status: 'todo' },
    { id: 7, title: "Build Wealth & Give", status: 'todo' },
  ];

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#3b82f6]/30">
      <h2 className="text-2xl font-bold text-white mb-6">7 Baby Steps Progress Map</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className={cn(
            "p-4 rounded-xl border flex items-center gap-4 transition-all",
            step.status === 'done' ? "bg-[#00ff9d]/10 border-[#00ff9d]/30 opacity-60" : 
            step.status === 'current' ? "bg-[#3b82f6]/10 border-[#3b82f6]/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-[1.02]" : 
            "bg-[#141414] border-[#1f1f1f] opacity-40"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono",
              step.status === 'done' ? "bg-[#00ff9d] text-[#050505]" : 
              step.status === 'current' ? "bg-[#3b82f6] text-white" : "bg-[#1f1f1f] text-[#808080]"
            )}>
              {step.id}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">{step.title}</h3>
              <p className="text-xs text-[#808080] uppercase tracking-widest">
                {step.status === 'done' ? 'COMPLETED' : step.status === 'current' ? 'IN PROGRESS' : 'LOCKED'}
              </p>
            </div>
            {step.status === 'done' && <CheckCircle2 className="text-[#00ff9d]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function BarefootTool({ income }: any) {
  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#f97316]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Three Bucket System</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BucketCard title="Blow" percent={60} desc="Daily expenses, splurges, and smile." color="bg-[#3b82f6]" amount={income * 0.6} />
        <BucketCard title="Mojo" percent={20} desc="Emergency fund and safety net." color="bg-[#ffb800]" amount={income * 0.2} />
        <BucketCard title="Grow" percent={20} desc="Long-term wealth and retirement." color="bg-[#00ff9d]" amount={income * 0.2} />
      </div>
    </div>
  );
}

function DieZeroTool({ netWorth, userProfile }: any) {
  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#ef4444]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Life Enjoyment vs Net Worth</h2>
      <div className="p-6 bg-[#141414] rounded-xl border border-[#1f1f1f] text-center">
        <p className="text-[#808080] mb-8 italic">"The goal is to die with zero. Every dollar you die with is a life experience you didn't have."</p>
        <div className="h-[200px] flex items-end justify-center gap-4">
          {[20, 30, 40, 50, 60, 70, 80].map((age) => (
            <div key={age} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 rounded-t-lg transition-all duration-1000",
                  age <= userProfile.currentAge ? "bg-[#ef4444]" : "bg-[#1f1f1f]"
                )} 
                style={{ height: `${Math.sin((age-20)/60 * Math.PI) * 150}px` }}
              ></div>
              <span className="text-[10px] font-mono text-[#808080]">{age}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-[#808080] uppercase tracking-widest">LIFE ENJOYMENT CURVE</div>
      </div>
    </div>
  );
}

function AutomaticTool({ income }: any) {
  const latteCost = 200;
  const monthlyLatte = latteCost * 30;
  const yearlyLatte = monthlyLatte * 12;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#06b6d4]/30">
      <h2 className="text-2xl font-bold text-white mb-6">The Latte Factor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-xl flex flex-col items-center text-center">
          <Coffee className="w-12 h-12 text-[#06b6d4] mb-4" />
          <h3 className="text-white font-bold mb-2">Small Daily Expense</h3>
          <div className="text-4xl font-mono text-[#06b6d4]">₹{latteCost}</div>
          <p className="text-xs text-[#808080] mt-4">"Small amounts of money spent on a regular basis can add up to a fortune over time."</p>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-[#141414] rounded-lg border border-[#1f1f1f] flex justify-between items-center">
            <span className="text-[#808080] text-sm">Monthly Cost</span>
            <span className="font-mono text-white">₹{monthlyLatte.toLocaleString()}</span>
          </div>
          <div className="p-4 bg-[#141414] rounded-lg border border-[#1f1f1f] flex justify-between items-center">
            <span className="text-[#808080] text-sm">Yearly Cost</span>
            <span className="font-mono text-white">₹{yearlyLatte.toLocaleString()}</span>
          </div>
          <div className="p-4 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg flex justify-between items-center">
            <span className="text-[#00ff9d] text-sm font-bold">10 Year Potential*</span>
            <span className="font-mono text-white">₹{(yearlyLatte * 17.5).toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-[#808080] italic">*Assuming 10% annual return if invested instead.</p>
        </div>
      </div>
    </div>
  );
}

function FreedomTool({ savings, totalOutflow }: any) {
  const fireNumber = totalOutflow * 12 * 25; // 4% Rule
  const dailyFreedomNumber = (fireNumber / 365) / 10; // Simple target

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#10b981]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Daily Freedom Number</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-[#141414] rounded-xl border border-[#1f1f1f]">
          <h3 className="text-white font-bold mb-4">Your FIRE Target</h3>
          <div className="text-4xl font-mono text-[#00f0ff] mb-2">₹{(fireNumber/10000000).toFixed(2)}Cr</div>
          <p className="text-xs text-[#808080]">Based on the 4% rule for ₹{totalOutflow.toLocaleString()}/mo expenses.</p>
        </div>
        <div className="p-6 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-center">
          <h3 className="text-[#10b981] font-bold text-sm uppercase mb-4">Daily Savings Target</h3>
          <div className="text-5xl font-mono text-white mb-2">₹{dailyFreedomNumber.toFixed(0)}</div>
          <p className="text-xs text-[#808080]">Save this much every single day to reach your freedom goal faster.</p>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

function Slider({ label, value, onChange, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs text-[#808080] uppercase mb-2">
        <span>{label}</span>
        <span className="font-mono text-white">{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        className={cn("w-full", color)} 
      />
    </div>
  );
}

function AllocationRow({ label, amount, percent, color }: any) {
  return (
    <div className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-[#1f1f1f]">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", color.replace('text', 'bg'))}></div>
        <span className="text-sm text-[#e0e0e0]">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-mono text-white">₹{amount.toLocaleString()}</div>
        <div className="text-[10px] text-[#808080]">{percent}%</div>
      </div>
    </div>
  );
}

function BucketCard({ title, percent, desc, color, amount }: any) {
  return (
    <div className="p-6 bg-[#141414] rounded-xl border border-[#1f1f1f] flex flex-col items-center text-center">
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4", color)}>
        {percent}%
      </div>
      <h3 className="text-white font-bold mb-1">{title}</h3>
      <p className="text-xs text-[#808080] mb-4">{desc}</p>
      <div className="mt-auto pt-4 border-t border-[#1f1f1f] w-full">
        <div className="text-lg font-mono text-white">₹{amount.toLocaleString()}</div>
        <div className="text-[10px] text-[#808080] uppercase tracking-widest">MONTHLY TARGET</div>
      </div>
    </div>
  );
}
