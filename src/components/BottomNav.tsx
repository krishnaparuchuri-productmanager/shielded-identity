import { useNavigate, useLocation } from "react-router-dom";
import { Shield, FolderOpen, Search, User } from "lucide-react";

const tabs = [
  { label: "KYC", icon: Shield, path: "/kyc" },
  { label: "My Cases", icon: FolderOpen, path: "/dashboard" },
  { label: "Scan", icon: Search, path: "/scan" },
  { label: "Profile", icon: User, path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenOn = ["/", "/login"];
  if (hiddenOn.includes(location.pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-fraud-surface/80 backdrop-blur-md border-t border-fraud-faint/20 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 min-w-[64px] min-h-[44px] justify-center"
              aria-label={tab.label}
            >
              <tab.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-fraud-primary" : "text-fraud-muted"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-fraud-primary" : "text-fraud-muted"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
