import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { IconClock } from '../../components/icons';

type Tab = 'unread' | 'read' | 'all';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('unread');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await db.notifications.toArray();
      data.sort((a, b) => b.createdAt - a.createdAt);
      setNotifications(data);
    }
    load();
  }, []);

  const filtered = tab === 'all' ? notifications : notifications.filter(n => tab === 'unread' ? !n.reading : n.reading);

  async function dismiss(id: string) {
    await db.notifications.update(id, { reading: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, reading: true } : n));
  }

  async function dismissAll() {
    for (const n of notifications.filter(n => !n.reading)) {
      await db.notifications.update(n.id, { reading: true });
    }
    setNotifications(prev => prev.map(n => ({ ...n, reading: true })));
    setDismissed(true);
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">Notifications</h1>
        {!dismissed && notifications.some(n => !n.reading) && (
          <button onClick={dismissAll} className="ml-auto text-xs font-semibold text-[#C86F52]">Mark all read</button>
        )}
      </div>

      <div className="px-5 mb-4 flex gap-2">
        {(['unread', 'read', 'all'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t ? 'bg-[#173F35] text-white' : 'bg-white text-[#7A8B7E]'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'unread' && !dismissed && notifications.some(n => !n.reading) && (
              <span className="ml-1 text-xs bg-[#C86F52] text-white px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.reading).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-[#7A8B7E]">No notifications</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-3 p-4 rounded-2xl ${n.reading ? 'bg-white/60' : 'bg-white'} border border-[rgba(23,63,53,0.06)]`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.reading ? 'bg-[#F5F0E7]' : 'bg-[#173F35]'}`}>
                <span className="text-sm">{n.type === 'booking_update' ? '📋' : n.type === 'new_booking' ? '🆕' : '🔔'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#173F35]">{n.title}</p>
                <p className="text-xs text-[#7A8B7E] mt-0.5">{n.message}</p>
                <p className="text-[10px] text-[#A8B9A5] mt-1 flex items-center gap-1">
                  <IconClock size={10} /> {new Date(n.createdAt).toLocaleString()}
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
