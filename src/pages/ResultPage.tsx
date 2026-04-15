import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Link as LinkIcon, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";
import RiskScoreMeter from "@/components/RiskScoreMeter";
import FraudSignalCard from "@/components/FraudSignalCard";
import { aadhaarProfiles, getStatusColor } from "@/lib/mockData";

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = parseInt(searchParams.get("id") || "0");
  const profile = aadhaarProfiles[id] || aadhaarProfiles[0];

  const detectedCount = profile.fraudSignals.filter((s) => s.detected).length;

  const handleEscalate = () => {
    const caseId = `FS-2026-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    toast.success(`Case ${caseId} created`, { description: "Escalated to review team" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-dvh bg-background safe-bottom pb-24"
    >
      <div className="px-5 pt-4">
        {/* Back */}
        <button
          onClick={() => navigate("/scan")}
          className="flex items-center gap-2 text-fraud-muted text-sm mb-4 min-h-[44px]"
          aria-label="Go back to scan"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* Identity Card */}
        <div className="bg-fraud-surface rounded-xl p-4 border border-fraud-faint/20 mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-fraud-text">{profile.name}</h2>
              <p className="text-xs text-fraud-faint font-mono mt-0.5">{profile.aadhaarNumber}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(profile.verificationStatus)}`}>
              {profile.verificationStatus}
            </span>
          </div>
          <div className="flex gap-4 text-xs text-fraud-muted">
            <span>{profile.address}</span>
            <span>DOB: {profile.dob}</span>
          </div>
          <p className="text-[10px] text-fraud-faint mt-2">
            Last verified: {new Date(profile.lastVerified).toLocaleDateString()}
          </p>
        </div>

        {/* Risk Score */}
        <div className="flex justify-center mb-8">
          <RiskScoreMeter score={profile.riskScore} riskLevel={profile.riskLevel} />
        </div>

        {/* Fraud Signals */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-fraud-text">Fraud Signals Detected</h3>
            {detectedCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-fraud-danger/20 text-fraud-danger font-medium">
                {detectedCount}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {profile.fraudSignals.map((signal, i) => (
              <FraudSignalCard key={i} {...signal} />
            ))}
          </div>
        </div>

        {/* Linked Data */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: LinkIcon, label: "Linked Accounts", value: profile.linkedAccounts },
            { icon: CreditCard, label: "Active Loans", value: Math.floor(profile.linkedAccounts / 2) },
            { icon: Smartphone, label: "Mobile Numbers", value: Math.ceil(profile.linkedAccounts / 3) },
          ].map((stat) => (
            <div key={stat.label} className="bg-fraud-surface rounded-lg p-3 text-center border border-fraud-faint/10">
              <stat.icon className="w-4 h-4 text-fraud-muted mx-auto mb-1" />
              <p className="text-lg font-bold text-fraud-text">{stat.value}</p>
              <p className="text-[10px] text-fraud-faint leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Actions */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-5 pb-2 bg-gradient-to-t from-background via-background to-transparent pt-4 z-40">
        <div className="flex gap-2">
          <button
            onClick={handleEscalate}
            className="flex-1 bg-fraud-primary text-fraud-bg font-semibold py-3 rounded-xl text-sm min-h-[44px]"
          >
            Escalate to Review
          </button>
          {(profile.riskLevel === "LOW" || profile.riskLevel === "MEDIUM") && (
            <button
              onClick={() => toast.success("Identity marked as verified")}
              className="flex-1 border border-fraud-success text-fraud-success font-semibold py-3 rounded-xl text-sm min-h-[44px]"
            >
              Mark Verified
            </button>
          )}
          {(profile.riskLevel === "HIGH" || profile.riskLevel === "CRITICAL") && (
            <button
              onClick={() => toast.error("Identity blocked")}
              className="flex-1 border border-fraud-danger text-fraud-danger font-semibold py-3 rounded-xl text-sm min-h-[44px]"
            >
              Block Identity
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultPage;
