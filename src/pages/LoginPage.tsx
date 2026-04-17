import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth, demoUsers } from "@/lib/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.ok) {
        toast.error(res.error ?? "Login failed");
        return;
      }
      toast.success("Welcome back");
      navigate("/dashboard");
    }, 700);
  };

  const fillDemo = (u: typeof demoUsers[number]) => {
    setEmail(u.email);
    setPassword(u.password);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh bg-background px-5 pt-10 pb-8 flex flex-col"
    >
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-fraud-primary/15 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-fraud-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-fraud-text">Sign in to FraudShield</h1>
          <p className="text-xs text-fraud-muted mt-1">Analyst &amp; KYC operations console</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-xs font-medium text-fraud-muted">
            Work email
          </label>
          <div className="relative mt-1.5">
            <Mail className="w-4 h-4 text-fraud-faint absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@fraudshield.in"
              className="w-full bg-fraud-surface border border-fraud-faint/20 rounded-xl pl-10 pr-3 py-3 text-sm text-fraud-text placeholder:text-fraud-faint focus:outline-none focus:border-fraud-primary/60 min-h-[44px]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-medium text-fraud-muted">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="w-4 h-4 text-fraud-faint absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-fraud-surface border border-fraud-faint/20 rounded-xl pl-10 pr-10 py-3 text-sm text-fraud-text placeholder:text-fraud-faint focus:outline-none focus:border-fraud-primary/60 min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-fraud-muted"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fraud-primary text-fraud-bg font-semibold py-3 rounded-xl text-sm hover:brightness-110 transition-all min-h-[44px] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-fraud-faint/10">
        <p className="text-[10px] uppercase tracking-wider text-fraud-faint mb-2">Demo accounts</p>
        <div className="space-y-2">
          {demoUsers.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => fillDemo(u)}
              className="w-full text-left bg-fraud-surface hover:bg-fraud-surface2 border border-fraud-faint/10 rounded-lg p-3 transition-colors"
            >
              <p className="text-xs font-semibold text-fraud-text">{u.name}</p>
              <p className="text-[11px] text-fraud-muted">
                {u.email} · <span className="text-fraud-faint">{u.password}</span>
              </p>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-auto pt-6 text-[10px] text-center text-fraud-faint">
        Secured by Aadhaar · UIDAI Compliant
      </p>
    </motion.div>
  );
};

export default LoginPage;
