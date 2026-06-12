import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/store/playerStore';

export default function ShortcutsOverlay() {
  const { showShortcuts, setShowShortcuts } = usePlayer();

  const shortcuts = [
    { keys: ['Space'], desc: 'Play / Pause' },
    { keys: ['→'], desc: 'Next Song' },
    { keys: ['←'], desc: 'Previous Song' },
    { keys: ['T'], desc: 'Toggle View (iPod ↔ Vinyl)' },
    { keys: ['?'], desc: 'Show / Hide Shortcuts' },
  ];

  return (
    <AnimatePresence>
      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowShortcuts(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="frosted p-6 rounded-2xl shadow-2xl max-w-sm w-full"
            style={{ color: 'var(--fg)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Keyboard Shortcuts</h2>
              <button 
                onClick={() => setShowShortcuts(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>
            
            <ul className="space-y-4">
              {shortcuts.map((sc, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>{sc.desc}</span>
                  <div className="flex gap-2">
                    {sc.keys.map((k, j) => (
                      <kbd 
                        key={j}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans shadow-sm"
                        style={{ 
                          background: 'var(--nav-bg)',
                          border: '1px solid var(--progress-track)',
                          color: 'var(--fg)'
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
