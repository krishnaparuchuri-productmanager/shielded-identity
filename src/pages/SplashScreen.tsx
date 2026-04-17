import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const target = user ? "/dashboard" : "/login";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          navigate(target);
          return 100;
        }
        return p + 100 / 30;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [navigate, target]);

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-8 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Shield Logo */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path
            d="M40 8L12 20V40C12 56.57 24.4 71.89 40 76C55.6 71.89 68 56.57 68 40V20L40 8Z"
            stroke="hsl(177, 100%, 39%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="200"
            className="animate-draw-shield"
          />
          <path
            d="M28 40L36 48L52 32"
            stroke="hsl(177, 100%, 39%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="200"
            className="animate-draw-shield"
            style={{ animationDelay: "0.8s" }}
          />
        </svg>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-fraud-text tracking-tight">FraudShield</h1>
          <p className="text-sm text-fraud-muted mt-2">
            AI-powered fraud protection for 500M Indians
          </p>
        </div>

        <button
          onClick={() => navigate(target)}
          className="w-full max-w-[240px] bg-fraud-primary text-fraud-bg font-semibold py-3 rounded-xl text-sm hover:brightness-110 transition-all min-h-[44px]"
        >
          {user ? "Open Dashboard" : "Sign in"}
        </button>

        {/* Progress bar */}
        <div className="w-full max-w-[240px] h-0.5 bg-fraud-surface2 rounded-full overflow-hidden">
          <div
            className="h-full bg-fraud-primary/50 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      <p className="absolute bottom-8 text-xs text-fraud-faint text-center">
        Secured by Aadhaar · UIDAI Compliant
      </p>
    </div>
  );
};

export default SplashScreen;
