import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { getRiskBg, getPriorityColor, getCaseStatusColor, aadhaarProfiles } from "@/lib/mockData";
import type { FraudCase } from "@/lib/mockData";

interface CaseCardProps {
  caseData: FraudCase;
  index: number;
}

const CaseCard = ({ caseData, index }: CaseCardProps) => {
  const navigate = useNavigate();

  const handleTap = () => {
    const profileIndex = aadhaarProfiles.findIndex(
      (p) => p.aadhaarNumber.endsWith(caseData.aadhaarLast4)
    );
    navigate(`/result?id=${profileIndex >= 0 ? profileIndex : 0}`);
  };

  return (
    <button
      onClick={handleTap}
      className="w-full text-left p-4 bg-fraud-surface rounded-xl border border-fraud-faint/20 space-y-3 hover:bg-fraud-surface2 transition-colors min-h-[44px]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-fraud-muted font-mono">{caseData.caseId}</p>
          <p className="text-sm font-semibold text-fraud-text mt-0.5">{caseData.fraudType}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(caseData.priority)}`}>
          {caseData.priority}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm text-fraud-muted">{caseData.name}</p>
        <span className="text-fraud-faint">•</span>
        <p className="text-xs text-fraud-faint font-mono">XXXX-{caseData.aadhaarLast4}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRiskBg(caseData.riskLevel)}`}>
          {caseData.riskScore} — {caseData.riskLevel}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCaseStatusColor(caseData.status)}`}>
          {caseData.status.replace("_", " ")}
        </span>
      </div>

      <div className="flex items-center gap-1 text-fraud-faint">
        <Clock className="w-3 h-3" />
        <span className="text-xs">{caseData.reportedAt}</span>
      </div>
    </button>
  );
};

export default CaseCard;
