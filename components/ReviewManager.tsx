
import React, { useState } from 'react';
import { Review, Sentiment } from '../types';
import { geminiService } from '../services/geminiService';

const MOCK_REVIEWS: Review[] = [
  { id: '1', author: 'Jessica L.', rating: 5, comment: 'The sea bass was incredible! Waitstaff was very attentive. We will be back!', date: '2 hours ago', sentiment: Sentiment.POSITIVE, status: 'pending' },
  { id: '2', author: 'Mark T.', rating: 2, comment: 'Waiting 45 minutes for a confirmed table is unacceptable. Food was okay, but service was slow.', date: '5 hours ago', sentiment: Sentiment.NEGATIVE, status: 'pending' },
  { id: '3', author: 'Elena G.', rating: 4, comment: 'Great cocktails, a bit loud though. Good vibe overall.', date: '1 day ago', sentiment: Sentiment.NEUTRAL, status: 'pending' },
];

export const ReviewManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const generateDraft = async (reviewId: string) => {
    setLoadingId(reviewId);
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    try {
      const { sentiment, draft } = await geminiService.analyzeReview(review.comment);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, aiDraft: draft, sentiment } : r));
    } catch (error) {
      console.error("Draft error", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleAction = (reviewId: string, status: 'approved' | 'responded') => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-[#d4af37]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">Brand Voice</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-stone-900 leading-tight">Reputation Engine</h2>
          <p className="text-stone-500 text-lg mt-2 font-medium italic">Automated guest relationship management.</p>
        </div>
        <div className="bg-[#1a1c18] text-[#d4af37] px-8 py-4 rounded-3xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl">
          {reviews.filter(r => r.status === 'pending').length} Priority Actions
        </div>
      </header>

      <div className="grid gap-8">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-[2.5rem] premium-shadow border border-stone-100 p-10 group hover:border-[#d4af37]/20 transition-all duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center font-serif font-bold text-stone-400 border border-stone-100 text-2xl shadow-inner">
                  {review.author[0]}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl text-stone-800">{review.author}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex gap-1 text-[#d4af37]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[#d4af37]' : 'fill-stone-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{review.date}</span>
                  </div>
                </div>
              </div>
              <div className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] border shadow-sm self-start
                ${review.sentiment === Sentiment.POSITIVE ? 'bg-[#2d5a27]/10 text-[#2d5a27] border-[#2d5a27]/20' : 
                  review.sentiment === Sentiment.NEGATIVE ? 'bg-rose-50 text-rose-800 border-rose-100' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                {review.sentiment} Response Required
              </div>
            </div>

            <div className="space-y-8">
               <p className="text-stone-600 text-xl leading-relaxed font-medium italic">"{review.comment}"</p>

               {review.aiDraft ? (
                <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100 shadow-inner animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-ping"></div>
                    <span className="text-[10px] font-extrabold text-[#d4af37] uppercase tracking-[0.2em]">Suggested Draft</span>
                  </div>
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-stone-800 font-semibold leading-relaxed resize-none min-h-[120px] text-base"
                    value={review.aiDraft}
                    onChange={(e) => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, aiDraft: e.target.value } : r))}
                  />
                  <div className="flex justify-end gap-4 mt-8">
                    <button className="text-stone-400 font-bold uppercase text-[10px] tracking-widest px-6 hover:text-stone-600">Re-Draft</button>
                    <button 
                      onClick={() => handleAction(review.id, 'responded')}
                      className="bg-stone-900 text-[#d4af37] px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95"
                    >
                      Authenticate & Publish
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center border-t border-stone-100 pt-8">
                  <button 
                    onClick={() => generateDraft(review.id)}
                    disabled={loadingId === review.id}
                    className="text-stone-900 px-8 py-4 rounded-2xl font-bold bg-[#fcfaf5] hover:bg-white transition-all flex items-center gap-3 disabled:opacity-50 text-[11px] uppercase tracking-widest border border-stone-200 hover:border-[#d4af37]/40 shadow-sm"
                  >
                    {loadingId === review.id ? (
                      <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    )} 
                    Generate Intelligence
                  </button>
                  <button className="text-stone-300 hover:text-stone-500 transition-colors text-[10px] font-bold uppercase tracking-widest">Suppress Feedback</button>
                </div>
              )}
            </div>
            
            {review.status === 'responded' && (
              <div className="mt-8 pt-8 border-t border-stone-100 flex items-center gap-4 text-[#2d5a27] font-bold text-[11px] uppercase tracking-widest">
                <div className="w-8 h-8 bg-[#2d5a27]/10 rounded-full flex items-center justify-center border border-[#2d5a27]/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                Dispatch Confirmed
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
