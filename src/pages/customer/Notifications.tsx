import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';

export default function Notifications() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const data = await db.notifications.where('userId').equals(user.id).toArray();
      data.sort((a, b) => b.createdAt - a.createdAt);
      setNotifications(data);
      // Mark all as read
      await db.notifications.where('userId').equals(user.id).modify({ reading: true });
    }
    load();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">Notifications</h1>
      </div>

      <div className="px-5 space-y-2 mt-2">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-[#7A8B7E]">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-3 p-4 rounded-2xl ${n.reading ? 'bg-white/60' : 'bg-white'} border border-[rgba(23,63,53,0.06)]`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.reading ? 'bg-[#F5F0E7]' : 'bg-[#173F35]'}`}>
                <span className="text-sm">{n.reading ? '🔔' : '🔔'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#173F35]">{n.title}</p>
                <p className="text-xs text-[#7A8B7E] mt-0.5">{n.message}</p>
                <p className="text-[10px] text-[#A8B9A5] mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.reading && <div className="w-2 h-2 rounded-full bg-[#C86F52] mt-2 shrink-0" />}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
