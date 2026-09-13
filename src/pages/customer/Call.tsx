import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';

export default function CallScreen() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [ended, setEnded] = useState(false);

  useState(() => {
    const timer = setInterval(() => {
      if (!ended) setCallDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(timer);
  });

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="min-h-screen bg-[#173F35] flex flex-col items-center justify-center p-6"
    >
      {/* Caller info */}
      <div className="text-center mb-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-28 h-28 mx-auto mb-5 rounded-full bg-white/10 flex items-center justify-center text-white text-4xl font-bold"
        >
          V
        </motion.div>
        <h1 className="text-white text-2xl font-bold mb-2">Vikram Singh</h1>
        <p className="text-[#A8B9A5] text-sm">{ended ? 'Call ended' : callDuration > 0 ? formatTime(callDuration) : 'Calling...'}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <button onClick={() => setMuted(!muted)} className="flex flex-col items-center gap-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${muted ? 'bg-white text-[#173F35]' : 'bg-white/10 text-white'}`}>
            {muted ? <MicOff size={22} /> : <Mic size={22} />}
          </div>
          <span className="text-white/60 text-xs">Mute</span>
        </button>
        <button onClick={() => setSpeaker(!speaker)} className="flex flex-col items-center gap-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${speaker ? 'bg-white text-[#173F35]' : 'bg-white/10 text-white'}`}>
            <Volume2 size={22} />
          </div>
          <span className="text-white/60 text-xs">Speaker</span>
        </button>
        <button className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="10" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <span className="text-white/60 text-xs">Keypad</span>
        </button>
      </div>

      {/* End call */}
      <button
        onClick={() => setEnded(true)}
        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-6"
      >
        <PhoneOff size={28} className="text-white" />
      </button>

      {ended && (
        <button onClick={() => navigate(-1)} className="text-white/60 text-sm hover:text-white transition-colors">
          Back to app
        </button>
      )}
    </motion.div>
  );
}
