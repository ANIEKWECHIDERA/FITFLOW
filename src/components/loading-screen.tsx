import { AnimatePresence, motion } from "motion/react";

export function LoadingScreen({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="loading-screen"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.002 }}
        >
          <div className="loading-mark">
            <span />
            <span />
            <span />
          </div>
          <b>{message}</b>
          <small>Keeping your flow in sync</small>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
