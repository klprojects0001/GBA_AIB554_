
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ReservationManager } from './components/ReservationManager';
import { ReviewManager } from './components/ReviewManager';
import { RestaurantStats } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservations' | 'reviews'>('dashboard');
  
  const stats: RestaurantStats = {
    noShowRate: 8.4,
    tableUtilization: 82,
    starRating: 4.8,
    responseRate: 98,
    revenueGain: 15400
  };

  const NavIcon = ({ type, active }: { type: string, active: boolean }) => {
    const color = active ? "text-[#d4af37]" : "text-stone-500";
    switch(type) {
      case 'dashboard': return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
      case 'reservations': return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      case 'reviews': return <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Midnight Olive / Premium Glass */}
      <nav className="w-full lg:w-80 glass-sidebar lg:h-screen sticky top-0 z-50 p-8 flex flex-col border-r border-stone-800 shadow-2xl">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#8a6d1d] rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-stone-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]">D</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-serif text-white">DineLogic</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">Culinary Intelligence</p>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-stone-600 font-bold mb-4 px-4">Executive Suite</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-sm font-semibold whitespace-nowrap group ${
              activeTab === 'dashboard' ? 'bg-[#252822] text-white ring-1 ring-[#d4af37]/30 shadow-lg' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/30'
            }`}
          >
            <NavIcon type="dashboard" active={activeTab === 'dashboard'} />
            <span>Market Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-sm font-semibold whitespace-nowrap group ${
              activeTab === 'reservations' ? 'bg-[#252822] text-white ring-1 ring-[#d4af37]/30 shadow-lg' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/30'
            }`}
          >
            <NavIcon type="reservations" active={activeTab === 'reservations'} />
            <span>House Reservations</span>
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-sm font-semibold whitespace-nowrap group ${
              activeTab === 'reviews' ? 'bg-[#252822] text-white ring-1 ring-[#d4af37]/30 shadow-lg' : 'text-stone- stone-500 hover:text-stone-300 hover:bg-stone-800/30'
            }`}
          >
            <NavIcon type="reviews" active={activeTab === 'reviews'} />
            <span>Reputation Engine</span>
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-stone-800/50">
          <div className="p-4 bg-stone-900/50 rounded-2xl border border-stone-800/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2d5a27] flex items-center justify-center text-white font-serif italic text-lg shadow-inner">G</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-stone-100 truncate">The Gilded Plate</p>
              <p className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Premium Tier</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen w-full">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard stats={stats} />}
          {activeTab === 'reservations' && <ReservationManager />}
          {activeTab === 'reviews' && <ReviewManager />}
        </div>
      </main>
    </div>
  );
};

export default App;
