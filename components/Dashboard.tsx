
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { RestaurantStats } from '../types';

const data = [
  { name: 'Mon', revenue: 4200, noShows: 4 },
  { name: 'Tue', revenue: 3800, noShows: 2 },
  { name: 'Wed', revenue: 5100, noShows: 3 },
  { name: 'Thu', revenue: 6400, noShows: 5 },
  { name: 'Fri', revenue: 9200, noShows: 1 },
  { name: 'Sat', revenue: 11500, noShows: 2 },
  { name: 'Sun', revenue: 7800, noShows: 4 },
];

const StatCard: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode; inverse?: boolean }> = ({ label, value, trend, icon, inverse = false }) => {
  const isPositive = trend.startsWith('+');
  const isNeutral = !trend.startsWith('+') && !trend.startsWith('-');
  
  let colorClass = 'text-stone-500';
  if (!isNeutral) {
    const isGoodTrend = inverse ? !isPositive : isPositive;
    colorClass = isGoodTrend ? 'text-emerald-700' : 'text-rose-700';
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] premium-shadow border border-stone-100 relative overflow-hidden group hover:border-[#d4af37]/30 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute top-0 right-0 p-6 text-[#d4af37] group-hover:scale-110 transition-transform opacity-10">
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-stone-400 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-3">{label}</p>
        <h3 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">{value}</h3>
        <div className={`inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full text-[11px] font-bold ${colorClass} bg-stone-50`}>
          <span className="text-sm leading-none">{trend.startsWith('+') ? '↑' : trend.startsWith('-') ? '↓' : ''}</span>
          {trend} <span className="text-stone-400 font-normal">vs prev</span>
        </div>
      </div>
    </div>
  );
};

const Icons = {
  Rating: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
  NoShow: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>,
  Utilization: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>,
  Revenue: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 1.9 1.55 3.28 3.5 3.71V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
};

export const Dashboard: React.FC<{ stats: RestaurantStats }> = ({ stats }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-[#d4af37]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">Performance Report</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-stone-900 leading-tight">House Overview</h2>
          <p className="text-stone-500 text-lg mt-2 font-medium italic">Operational excellence at a glance.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-stone-200 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Cloud Sync: Active</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Guest Rating" value={`${stats.starRating.toFixed(1)}`} trend="+0.4" icon={Icons.Rating} />
        <StatCard label="No-Show Frequency" value={`${stats.noShowRate}%`} trend="-6.2%" icon={Icons.NoShow} inverse={true} />
        <StatCard label="Cover Utilization" value={`${stats.tableUtilization}%`} trend="+12.4%" icon={Icons.Utilization} />
        <StatCard label="Revenue Gain" value={`$${(stats.revenueGain/1000).toFixed(1)}k`} trend="+18%" icon={Icons.Revenue} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] premium-shadow border border-stone-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">Revenue Velocity</h3>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1">Weekly Gross Performance</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-[#d4af37]">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontFamily: 'Plus Jakarta Sans', fontSize: '13px', background: '#fff', padding: '15px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] premium-shadow border border-stone-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">System Efficiency</h3>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1">AI-Managed Guest Interaction</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-[#2d5a27]">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                   cursor={{fill: '#fcfcfc'}}
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', background: '#fff', padding: '15px' }}
                />
                <Bar dataKey="noShows" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#2d5a27' : '#e5e1d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
