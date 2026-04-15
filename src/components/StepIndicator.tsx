import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { id: number; title: string; status: "completed" | "active" | "pending" }[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      {steps.map((step, i) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? "bg-fraud-primary text-fraud-bg"
                    : isActive
                    ? "bg-fraud-primary/20 border-2 border-fraud-primary text-fraud-primary animate-pulse"
                    : "bg-fraud-surface2 text-fraud-faint border border-fraud-faint/30"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`text-[10px] text-center leading-tight max-w-[60px] ${
                  isActive ? "text-fraud-primary font-medium" : "text-fraud-muted"
                }`}
              >
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mt-[-18px] ${
                  isCompleted ? "bg-fraud-primary" : "bg-fraud-faint/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
