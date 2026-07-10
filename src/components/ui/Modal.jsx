import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, onClose, children, className = "", dismissible = true }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismissible && onClose ? onClose : undefined}
            className="absolute inset-0 bg-secondary/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            className={`
              relative w-full max-w-[380px] bg-surface border border-border
              rounded-xl shadow-[var(--shadow-modal)] overflow-hidden
              ${className}
            `}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
