import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';

export default function WorkerProfile() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const worker = user as any;
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const reviewsList = await db.reviews.where('workerId').equals(user.id).toArray();
      setReviews(reviewsList);
    }
    load();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">Profile</h1>
      </div>

      <div className="px-5">
        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-6 text-center mb-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#173F35] flex items-center justify-center text-white text-3xl font-bold mb-3">
            {worker?.name?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-[#173F35]">{worker?.name}</h2>
          <p className="text-sm text-[#7A8B7E] capitalize mt-1">{worker?.serviceType?.replace('_', ' ')} Professional</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map(n => (
              <svg key={n} width="16" height="16" viewBox="0 0 16 16" fill={n <= (worker?.rating || 0) ? '#C86F52' : '#D4CFC4'}><path d="M8 1l2.2 4.5 5 .7-3.6 3.5.8 5L8 12.5 3.6 14.7l.8-5-3.6-3.5 5-.7z"/></svg>
            ))}
            <span className="text-sm font-medium text-[#173F35] ml-1">{worker?.rating}</span>
          </div>
          <p className="text-xs text-[#7A8B7E] mt-1">{worker?.totalJobs} jobs completed</p>
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-[rgba(23,63,53,0.06)]">
            <div className="text-center"><p className="text-lg font-bold text-[#173F35]">98%</p><p className="text-xs text-[#7A8B7E]">Completion</p></div>
            <div className="text-center"><p className="text-lg font-bold text-[#173F35]">2 yrs</p><p className="text-xs text-[#7A8B7E]">Experience</p></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 mb-5">
          <h3 className="font-bold text-[#173F35] mb-2">About</h3>
          <p className="text-sm text-[#7A8B7E]">{worker?.bio || 'Experienced professional focused on reliable and respectful home service.'}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 mb-5">
          <h3 className="font-bold text-[#173F35] mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(worker?.skills || ['General']).map((skill: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-[#F5F0E7] text-[#173F35] text-xs font-medium">{skill}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4">
          <h3 className="font-bold text-[#173F35] mb-3">Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-[#7A8B7E]">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((rev: any) => (
                <div key={rev.id} className="border-b border-[rgba(23,63,53,0.06)] pb-3 last:border-0">
                  <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(n => (<svg key={n} width="12" height="12" viewBox="0 0 16 16" fill={n <= rev.rating ? '#C86F52' : '#D4CFC4'}><path d="M8 1l2.2 4.5 5 .7-3.6 3.5.8 5L8 12.5 3.6 14.7l.8-5-3.6-3.5 5-.7z"/></svg>))}</div>
                  <p className="text-sm text-[#173F35]">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
