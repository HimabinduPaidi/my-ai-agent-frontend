import { AnimatePresence, motion } from "framer-motion";
import { X, Crown, Zap, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/billing.api";
import api from "../utils/axios";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { APP_NAME } from "../config/brand";

export default function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        name: APP_NAME,
        description: `${data.plan.name} Plan`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const { data } = await api.post(
              "/api/billing/verify-payment",
              response
            );
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

  const creditPercent =
    ((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-secondary/30 backdrop-blur-[2px] z-40"
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-[400px] bg-surface border-l border-border shadow-[var(--shadow-modal)] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Billing"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-text-primary">Billing</h2>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  Plans & credits
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close billing">
                <X size={18} />
              </Button>
            </div>

            <div className="p-5">
              <Card padding="p-4" className="bg-background">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[12px] font-medium text-text-muted uppercase tracking-wide">
                      Current plan
                    </p>
                    <h3 className="text-xl font-semibold text-text-primary mt-1 capitalize">
                      {userData?.plan ?? "Pro"}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center">
                    <Crown size={18} className="text-accent" />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-text-secondary mb-2">
                    <span>Credits remaining</span>
                    <span className="font-medium text-text-primary">
                      {userData?.credits || 0} / {userData?.totalCredits || 0}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${creditPercent}%` }}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-3 scrollbar-thin">
              <Card padding="p-4" hover>
                <h3 className="text-sm font-semibold text-text-primary">Starter</h3>
                <p className="text-primary text-2xl font-bold mt-2 tracking-tight">₹199</p>
                <p className="text-[13px] text-text-secondary mt-1">500 credits</p>
                <Button
                  variant="secondary"
                  size="md"
                  className="mt-4 w-full"
                  onClick={() => handleUpgrade("starter")}
                >
                  Upgrade
                </Button>
              </Card>

              <Card padding="p-4" hover className="border-primary/25 relative">
                <Badge variant="primary" className="absolute right-3 top-3">
                  Popular
                </Badge>
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  Pro
                  <Zap size={14} className="text-accent" />
                </h3>
                <p className="text-primary text-2xl font-bold mt-2 tracking-tight">₹499</p>
                <p className="text-[13px] text-text-secondary mt-1">1,000 credits</p>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-4 w-full"
                  onClick={() => handleUpgrade("pro")}
                >
                  Upgrade
                </Button>
              </Card>
            </div>

            <div className="p-5 border-t border-border">
              <div className="flex items-start gap-2">
                <Sparkles size={14} className="text-text-muted mt-0.5 shrink-0" />
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Credits are used for image generation, PDF, PPT, and advanced AI features.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
