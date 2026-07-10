import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import Button from "./ui/Button";

export default function AIBanner({ open, title, message, onClose }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[92%] max-w-md"
          role="alert"
        >
          <div className="rounded-xl border border-danger/20 bg-surface shadow-[var(--shadow-modal)] overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="w-9 h-9 rounded-lg bg-danger/8 border border-danger/15 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-danger" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
                <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">
                  {message}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                  className="mt-3"
                >
                  Dismiss
                </Button>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-background transition-colors cursor-pointer shrink-0"
                aria-label="Close alert"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
