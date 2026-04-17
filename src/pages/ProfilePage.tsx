import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Briefcase, Building2, LogOut, BadgeCheck, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login");
  };

  const rows = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Briefcase, label: "Role", value: user.role },
    { icon: Building2, label: "Company", value: user.company },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-dvh bg-background safe-bottom px-5 pt-6 pb-24"
    >
      <h1 className="text-xl font-bold text-fraud-text mb-6">Profile</h1>

      {/* Avatar header */}
      <div className="bg-fraud-surface rounded-2xl border border-fraud-faint/10 p-5 flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-fraud-primary/20 flex items-center justify-center text-2xl font-bold text-fraud-primary">
            {user.initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-fraud-success flex items-center justify-center border-2 border-fraud-surface">
            <BadgeCheck className="w-3.5 h-3.5 text-fraud-bg" />
          </div>
        </div>
        <h2 className="mt-3 text-base font-semibold text-fraud-text">{user.name}</h2>
        <p className="text-xs text-fraud-muted">{user.role}</p>
        <span className="mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-fraud-success/15 text-fraud-success">
          Active session
        </span>
      </div>

      {/* Details */}
      <div className="mt-5 bg-fraud-surface rounded-2xl border border-fraud-faint/10 divide-y divide-fraud-faint/10">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-4">
            <div className="w-9 h-9 rounded-lg bg-fraud-surface2 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-fraud-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-fraud-faint">{label}</p>
              <p className="text-sm text-fraud-text truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-5 bg-fraud-surface rounded-2xl border border-fraud-faint/10 divide-y divide-fraud-faint/10">
        {["Notification preferences", "Security & access", "Help & support"].map((item) => (
          <button
            key={item}
            onClick={() => toast("Coming soon")}
            className="w-full flex items-center justify-between p-4 text-left min-h-[44px] hover:bg-fraud-surface2/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
          >
            <span className="text-sm text-fraud-text">{item}</span>
            <ChevronRight className="w-4 h-4 text-fraud-faint" />
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-fraud-danger/10 text-fraud-danger border border-fraud-danger/30 font-semibold py-3 rounded-xl text-sm min-h-[44px] hover:bg-fraud-danger/20 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>

      <p className="mt-6 text-center text-[10px] text-fraud-faint">
        FraudShield v1.0.0 · Build 2026.04
      </p>
    </motion.div>
  );
};

export default ProfilePage;
