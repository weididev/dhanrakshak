import React, { useState } from 'react';
import { LayoutDashboard, Wallet, Shield, TrendingUp, BookOpen, Menu, X, Landmark, UserCircle, MoreHorizontal, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFinance } from '../context/FinanceContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userProfile } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'salaries', label: 'Income', icon: Wallet },
    { id: 'transactions', label: 'Cashflow', icon: Clock },
    { id: 'assets', label: 'Assets', icon: TrendingUp },
    { id: 'liabilities', label: 'Debt', icon: Landmark },
    { id: 'insurance', label: 'Protection', icon: Shield },
    { id: 'strategies', label: 'Wisdom', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] border-b border-[#1f1f1f] bg-[#0a0a0a] z-20 sticky top-0">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#00f0ff]" />
          <span className="font-sans font-bold text-lg tracking-wider text-white">DHANRAKSHAK</span>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#0a0a0a] border-r border-[#1f1f1f] transform transition-transform duration-300 ease-in-out flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-[#1f1f1f]">
          <Shield className="w-8 h-8 text-[#00f0ff]" />
          <span className="font-sans font-bold text-xl tracking-widest text-white">DHANRAKSHAK</span>
        </div>

        <div className="p-4 border-b border-[#1f1f1f]">
          <div className="text-xs text-[#808080] uppercase tracking-wider mb-1">Commander</div>
          <div className="text-white font-bold truncate">{userProfile?.name || 'User'}</div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm tracking-wide",
                  isActive 
                    ? "bg-[#141414] text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                    : "text-[#808080] hover:text-[#e0e0e0] hover:bg-[#141414]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#00f0ff]" : "text-[#808080]")} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#1f1f1f] flex flex-col gap-2">
          <div className="text-xs text-[#808080] font-mono text-center">
            SYSTEM OFFLINE MODE
            <div className="w-2 h-2 bg-[#00ff9d] rounded-full inline-block ml-2 shadow-[0_0_8px_#00ff9d]"></div>
          </div>
          <div className="text-[10px] text-[#404040] font-mono text-center uppercase tracking-widest">
            App Developer: weididev
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-65px)] md:h-screen overflow-y-auto p-4 md:p-8 relative pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pb-8">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#00f0ff]/5 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#00ff9d]/5 blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
          
          <footer className="mt-12 pb-20 md:pb-8 border-t border-[#1f1f1f] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <div className="text-xl font-bold text-white tracking-tighter">DHAN<span className="text-[#00f0ff]">RAKSHAK</span></div>
                <p className="text-[#808080] text-xs font-mono mt-1 uppercase">Advanced Financial Defense System v1.0</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[#808080] text-xs font-mono uppercase tracking-widest">App Developer</p>
                <p className="text-[#00ff9d] font-bold text-sm tracking-widest">weididev</p>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-lg border-t border-[#1f1f1f] flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] z-20">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'salaries', label: 'Income', icon: Wallet },
          { id: 'assets', label: 'Assets', icon: TrendingUp },
          { id: 'liabilities', label: 'Debts', icon: Landmark },
          { id: 'menu', label: 'More', icon: MoreHorizontal },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'menu') {
                  setIsMobileMenuOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                isActive ? "text-[#00f0ff]" : "text-[#808080]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] uppercase font-mono">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
