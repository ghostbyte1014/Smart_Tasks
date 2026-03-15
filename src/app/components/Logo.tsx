import { motion } from 'motion/react';

export function Logo({ className = "size-8", isDarkMode }: { className?: string; isDarkMode?: boolean }) {
  return (
    <div className={`${className} flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-lg overflow-hidden relative shrink-0`}>
      <motion.div
        initial={{ rotate: -15, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[60%] h-[60%] text-white">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-full bg-white/20 blur-[2px] transform -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
    </div>
  );
}
