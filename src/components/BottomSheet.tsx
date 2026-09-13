import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function BottomSheet({
  open, onClose, children, height = '80%',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FBF9F4] rounded-t-[24px] shadow-2xl overflow-hidden"
            style={{ height }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#C8B9A5]/50 rounded-full" />
            </div>
            <div className="px-6 pb-8 overflow-y-auto" style={{ height: 'calc(100% - 48px)' }}>
              <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#F5F0E7]">
                <X size={20} className="text-[#7A8B7E]" />
              </button>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
