import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowLeft, IconSend, IconPhone } from '../../components/icons';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';

const QUICK_REPLIES = ['I\'m at the entrance', 'How far are you?', 'Please call me', 'Almost there', 'Thank you! 👍'];

export default function Chat() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [worker, setWorker] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    if (!user) return;
    const msgs = await db.messages.where('senderId').equals(user.id).or('receiverId').equals(user.id).toArray();
    msgs.sort((a, b) => a.createdAt - b.createdAt);
    setMessages(msgs);

    const otherId = msgs[0]?.senderId === user.id ? msgs[0].receiverId : msgs[0]?.senderId;
    const w = await db.users.get(otherId);
    setWorker(w);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || !user) return;
    const receiverId = worker?.id || 'w1';
    await db.messages.add({
      id: `msg-${Date.now()}`,
      bookingId: 'vh-2048',
      senderId: user.id,
      receiverId,
      text: text.trim(),
      read: false,
      createdAt: Date.now(),
    });
    setInput('');
    loadMessages();
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-[rgba(23,63,53,0.08)]">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <IconArrowLeft size={20} className="text-[#173F35]" />
        </button>
        {worker && (
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-full bg-[#173F35] flex items-center justify-center text-white text-sm font-bold">
              {worker.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm text-[#173F35]">{worker.name}</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
        )}
        <button onClick={() => navigate('/call')} className="p-2 rounded-full hover:bg-[#F5F0E7]">
          <IconPhone size={20} className="text-[#173F35]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-[#173F35] text-white rounded-br-sm'
                    : 'bg-white text-[#173F35] rounded-bl-sm border border-[rgba(23,63,53,0.08)]'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-0.5 ${isMe ? 'text-white/60' : 'text-[#A8B9A5]'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => sendMessage(reply)}
            className="shrink-0 px-3 py-1.5 rounded-full bg-[#F5F0E7] text-[#173F35] text-xs font-medium hover:bg-[#EDE8DD] transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-[#FBF9F4] px-4 py-3 flex items-center gap-3 border-t border-[rgba(23,63,53,0.08)]">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[rgba(23,63,53,0.1)] text-sm text-[#173F35] placeholder:text-[#A8B9A5] focus:outline-none focus:ring-2 focus:ring-[#173F35]/30"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage(input)}
          className="w-11 h-11 rounded-full bg-[#173F35] flex items-center justify-center"
        >
          <IconSend size={18} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
}
