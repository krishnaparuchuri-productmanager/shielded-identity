import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import AadhaarInput from "@/components/AadhaarInput";
import { aadhaarProfiles, getRiskBg } from "@/lib/mockData";

const testChips = [
  { label: "LOW RISK", profileIndex: 0 },
  { label: "MEDIUM RISK", profileIndex: 1 },
  { label: "HIGH RISK", profileIndex: 2 },
  { label: "CRITICAL RISK", profileIndex: 3 },
  { label: "BLOCKED", profileIndex: 4 },
];

const ScanPage = () => {
  const navigate = useNavigate();
  const [aadhaar, setAadhaar] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleScan = (profileIndex?: number) => {
    setScanning(true);
    setTimeout(() => {
      const idx = profileIndex ?? 0;
      navigate(`/result?id=${idx}`);
    }, 1500);
  };

  const isValid = aadhaar.length === 12;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-dvh bg-background safe-bottom"
    >
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-fraud-primary" />
          <h1 className="text-xl font-bold text-fraud-text">Scan Identity</h1>
        </div>
        <p className="text-sm text-fraud-muted mb-8">Verify identity & detect fraud signals</p>

        {/* Aadhaar Input */}
        <div className="mb-4">
          <AadhaarInput value={aadhaar} onChange={setAadhaar} />
        </div>

        {/* Scan Button */}
        <button
          onClick={() => handleScan()}
          disabled={!isValid || scanning}
          className="w-full bg-fraud-primary text-fraud-bg font-semibold py-3.5 rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
        >
          {scanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            "Scan for Fraud"
          )}
        </button>

        {/* Test Chips */}
        <div className="mt-6">
          <p className="text-xs text-fraud-faint mb-3 uppercase tracking-wider">Quick Test</p>
          <div className="flex flex-wrap gap-2">
            {testChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => {
                  const profile = aadhaarProfiles[chip.profileIndex];
                  setAadhaar(profile.aadhaarNumber.replace(/-/g, "").replace(/X/g, "1"));
                  handleScan(chip.profileIndex);
                }}
                disabled={scanning}
                className="text-xs px-3 py-1.5 rounded-full bg-fraud-surface2 text-fraud-muted border border-fraud-faint/20 hover:border-fraud-primary/40 hover:text-fraud-primary transition-all min-h-[32px]"
              >
                Test: {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="mt-8">
          <p className="text-xs text-fraud-faint mb-3 uppercase tracking-wider">Recent Scans</p>
          <div className="space-y-2">
            {aadhaarProfiles.slice(0, 3).map((profile, i) => (
              <button
                key={i}
                onClick={() => navigate(`/result?id=${i}`)}
                className="w-full flex items-center justify-between p-3 bg-fraud-surface rounded-lg border border-fraud-faint/10 hover:bg-fraud-surface2 transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-fraud-surface2 flex items-center justify-center text-xs font-semibold text-fraud-muted">
                    {profile.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-fraud-text">{profile.name}</p>
                    <p className="text-xs text-fraud-faint font-mono">{profile.aadhaarNumber}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRiskBg(profile.riskLevel)}`}>
                  {profile.riskLevel}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScanPage;
