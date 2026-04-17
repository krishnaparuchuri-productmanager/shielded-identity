import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, TrendingUp, TrendingDown, X } from "lucide-react";
import CaseCard from "@/components/CaseCard";
import { fraudCases } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";

const kpis = [
  { label: "Total Cases Today", value: "142", trend: "+12%", up: true },
  { label: "High Risk Flagged", value: "38", trend: "+8%", up: true },
  { label: "Resolved Today", value: "67", trend: "+23%", up: true },
  { label: "Avg Risk Score", value: "61", trend: "-5%", up: false },
];

const filters = ["All", "P1 Critical", "P2 High", "Under Review", "Escalated", "Closed"];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showSheet, setShowSheet] = useState(false);

  const filteredCases = fraudCases.filter((c) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "P1 Critical") return c.priority === "P1";
    if (activeFilter === "P2 High") return c.priority === "P2";
    if (activeFilter === "Under Review") return c.status === "UNDER_REVIEW";
    if (activeFilter === "Escalated") return c.status === "ESCALATED";
    if (activeFilter === "Closed") return c.status === "CLOSED";
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-dvh bg-background safe-bottom"
    >
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-fraud-text">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="relative min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Notifications">
              <Bell className="w-5 h-5 text-fraud-muted" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-fraud-danger text-[10px] text-fraud-text font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-fraud-primary/20 flex items-center justify-center text-xs font-bold text-fraud-primary">
              KP
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="min-w-[130px] bg-fraud-surface rounded-xl p-3 border border-fraud-faint/10 flex-shrink-0"
            >
              <p className="text-2xl font-bold text-fraud-text">{kpi.value}</p>
              <p className="text-[10px] text-fraud-muted mt-1">{kpi.label}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs ${kpi.up ? "text-fraud-success" : "text-fraud-danger"}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 mt-4 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 min-h-[32px] transition-colors ${
                activeFilter === f
                  ? "bg-fraud-primary text-fraud-bg font-semibold"
                  : "bg-fraud-surface2 text-fraud-muted border border-fraud-faint/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cases */}
        <div className="space-y-3 mt-4">
          {filteredCases.map((c, i) => (
            <motion.div
              key={c.caseId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CaseCard caseData={c} index={i} />
            </motion.div>
          ))}
          {filteredCases.length === 0 && (
            <p className="text-center text-sm text-fraud-faint py-8">No cases match this filter</p>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-fraud-primary rounded-full flex items-center justify-center shadow-lg shadow-fraud-primary/30 z-40"
        aria-label="New action"
      >
        <Plus className="w-6 h-6 text-fraud-bg" />
      </button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {showSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-fraud-surface rounded-t-2xl z-50 p-5 pb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-fraud-text">Quick Actions</h3>
                <button onClick={() => setShowSheet(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close">
                  <X className="w-5 h-5 text-fraud-muted" />
                </button>
              </div>
              {["New Scan", "Manual Case Entry", "Bulk Upload"].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setShowSheet(false);
                    if (action === "New Scan") navigate("/scan");
                  }}
                  className="w-full text-left p-3 rounded-lg text-sm text-fraud-text hover:bg-fraud-surface2 transition-colors min-h-[44px]"
                >
                  {action}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardPage;
