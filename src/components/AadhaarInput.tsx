import { Lock, CheckCircle } from "lucide-react";

interface AadhaarInputProps {
  value: string;
  onChange: (value: string) => void;
}

const AadhaarInput = ({ value, onChange }: AadhaarInputProps) => {
  const formatAadhaar = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join("-");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    onChange(raw);
  };

  const isValid = value.replace(/\D/g, "").length === 12;

  return (
    <div className="relative">
      <label htmlFor="aadhaar-input" className="sr-only">
        Aadhaar Number
      </label>
      <div className="flex items-center bg-fraud-surface border border-fraud-faint/30 rounded-xl px-4 py-3 focus-within:border-fraud-primary/50 focus-within:ring-1 focus-within:ring-fraud-primary/30 transition-all">
        <Lock className="w-5 h-5 text-fraud-muted mr-3 flex-shrink-0" />
        <input
          id="aadhaar-input"
          type="text"
          inputMode="numeric"
          placeholder="XXXX-XXXX-XXXX"
          value={formatAadhaar(value)}
          onChange={handleChange}
          className="flex-1 bg-transparent text-fraud-text text-lg font-mono tracking-wider placeholder:text-fraud-faint outline-none"
          autoComplete="off"
        />
        {isValid && (
          <CheckCircle className="w-5 h-5 text-fraud-success flex-shrink-0 ml-2" />
        )}
      </div>
    </div>
  );
};

export default AadhaarInput;
