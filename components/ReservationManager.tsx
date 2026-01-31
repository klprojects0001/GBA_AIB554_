
import React, { useState } from 'react';
import { Reservation } from '../types';
import { geminiService } from '../services/geminiService';

const MOCK_RESERVATIONS: Reservation[] = [
  { id: '1', guestName: 'David Chen', partySize: 4, dateTime: '2023-11-20T19:30:00', status: 'confirmed', source: 'web' },
  { id: '2', guestName: 'Sarah Miller', partySize: 2, dateTime: '2023-11-20T20:15:00', status: 'confirmed', source: 'sms' },
  { id: '3', guestName: 'James Wilson', partySize: 6, dateTime: '2023-11-21T18:00:00', status: 'pending', source: 'phone' },
  { id: '4', guestName: 'Emily Blunt', partySize: 2, dateTime: '2023-11-20T18:00:00', status: 'confirmed', source: 'web' },
];

export const ReservationManager: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [messages, setMessages] = useState<{role: 'owner' | 'ai', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOwnerCommand = async (command: string) => {
    if (!command.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'owner', text: command }]);
    if (inputValue === command) setInputValue('');
    setLoading(true);

    try {
      const response = await geminiService.processOwnerQuery(command, reservations);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Operational relay interrupted. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    "Dinner Summary",
    "Staff Briefing",
    "Alert Conflicts",
    "VIP Patterns"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[2px] bg-[#d4af37]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">Guest Ledger</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-stone-900">House Reservations</h2>
          </div>
          <div className="flex gap-4">
            <button className="bg-white text-stone-700 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all border border-stone-200 shadow-sm">
              Archive
            </button>
            <button className="bg-gradient-to-br from-[#d4af37] to-[#8a6d1d] text-stone-900 px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
              Manual Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] premium-shadow border border-stone-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Guest Profile</th>
                <th className="px-8 py-6 text-center">Covers</th>
                <th className="px-8 py-6">Service Time</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {reservations.map(res => (
                <tr key={res.id} className="hover:bg-stone-50/80 transition-all duration-300 group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-stone-800 text-base">{res.guestName}</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-stone-700 font-bold bg-white border border-stone-200 w-10 h-10 rounded-xl inline-flex items-center justify-center shadow-sm">{res.partySize}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-stone-800">{new Date(res.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">{new Date(res.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      res.status === 'confirmed' ? 'bg-[#2d5a27]/10 text-[#2d5a27] border border-[#2d5a27]/20' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">{res.source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="glass-sidebar rounded-[2.5rem] p-8 text-stone-100 h-[720px] flex flex-col shadow-2xl border border-stone-800 relative overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-stone-800/80 rounded-2xl flex items-center justify-center text-[#d4af37] border border-stone-700 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white tracking-tight">Concierge AI</h3>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold italic">Operational Insights</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {quickCommands.map(cmd => (
                <button 
                  key={cmd}
                  onClick={() => handleOwnerCommand(cmd)}
                  className="px-3 py-2 rounded-xl bg-stone-900/50 border border-stone-800 text-[10px] font-bold text-stone-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all uppercase tracking-tight"
                >
                  {cmd}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar max-h-[400px]">
              {messages.length === 0 && (
                <div className="text-center py-12 px-6">
                  <p className="text-sm font-bold mb-3 text-stone-300">Ready for Service</p>
                  <p className="text-xs leading-relaxed text-stone-500">
                    Query your house ledger for patterns, summaries, or special briefings.
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'owner' ? 'items-end' : 'items-start'}`}>
                  <span className={`text-[9px] uppercase tracking-widest font-bold mb-2 px-1 ${m.role === 'owner' ? 'text-stone-500' : 'text-[#d4af37]'}`}>
                    {m.role === 'owner' ? 'Command Center' : 'System Intelligence'}
                  </span>
                  <div className={`max-w-[95%] rounded-2xl px-5 py-4 text-[13px] leading-relaxed shadow-lg ${
                    m.role === 'owner' ? 'bg-stone-800 text-white border border-stone-700' : 'bg-stone-900/80 text-stone-300 border border-stone-800'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start items-center gap-4 py-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold animate-pulse">Analyzing Ledger</span>
                </div>
              )}
            </div>

            <div className="relative pt-4 mt-auto">
              <form onSubmit={(e) => { e.preventDefault(); handleOwnerCommand(inputValue); }}>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Execute query..."
                  className="w-full bg-black border border-stone-800 rounded-2xl py-5 pl-6 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37] text-white placeholder:text-stone-800 transition-all"
                />
                <button type="submit" className="absolute right-4 top-9 p-2 text-stone-600 hover:text-[#d4af37] transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
