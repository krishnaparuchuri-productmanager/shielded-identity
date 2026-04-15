import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { FraudSignal } from "@/lib/mockData";

const FraudSignalCard = ({ signal, severity, detected }: FraudSignal) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        detected
          ? "bg-fraud-danger/10 border-fraud-danger/20"
          : "bg-fraud-surface border-fraud-faint/20 opacity-50"
      }`}
    >
      <div className="flex-shrink-0">
        {detected ? (
          <XCircle className="w-5 h-5 text-fraud-danger" />
        ) : (
          <CheckCircle className="w-5 h-5 text-fraud-success" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${detected ? "text-fraud-text" : "text-fraud-muted"}`}>
          {signal}
        </p>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          severity === "high"
            ? "bg-fraud-danger/20 text-fraud-danger"
            : severity === "medium"
            ? "bg-fraud-warning/20 text-fraud-warning"
            : "bg-fraud-success/20 text-fraud-success"
        }`}
      >
        {severity}
      </span>
      {detected && (
        <AlertTriangle className="w-4 h-4 text-fraud-warning flex-shrink-0" />
      )}
    </div>
  );
};

export default FraudSignalCard;
