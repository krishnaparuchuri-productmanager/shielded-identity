import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Camera, CheckCircle, Loader2 } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import AadhaarInput from "@/components/AadhaarInput";
import { kycSteps } from "@/lib/mockData";

const KycPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [livenessConfirmed, setLivenessConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const steps = kycSteps.map((s) => ({
    ...s,
    status: s.id < currentStep ? "completed" as const : s.id === currentStep ? "active" as const : "pending" as const,
  }));

  const canContinue = () => {
    switch (currentStep) {
      case 1: return otp.length === 6;
      case 2: return uploaded;
      case 3: return livenessConfirmed;
      case 4: return true;
      default: return false;
    }
  };

  const handleContinue = () => {
    if (currentStep === 4) {
      setSubmitting(true);
      setTimeout(() => navigate("/result?id=0"), 2000);
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleSendOtp = () => setOtpSent(true);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 2000);
  };

  const handleLiveness = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setLivenessConfirmed(true);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-dvh bg-background safe-bottom"
    >
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {currentStep > 1 && (
            <button onClick={() => setCurrentStep((s) => s - 1)} className="min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Go back">
              <ArrowLeft className="w-5 h-5 text-fraud-muted" />
            </button>
          )}
          <h1 className="text-xl font-bold text-fraud-text">KYC Verification</h1>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Aadhaar + OTP */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <AadhaarInput value={aadhaar} onChange={setAadhaar} />
                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={aadhaar.length !== 12}
                    className="w-full bg-fraud-primary text-fraud-bg font-semibold py-3 rounded-xl text-sm disabled:opacity-40 min-h-[44px]"
                  >
                    Send OTP
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-fraud-muted">OTP sent to ••••••7823</p>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full bg-fraud-surface border border-fraud-faint/30 rounded-xl px-4 py-3 text-fraud-text text-center text-xl tracking-[0.5em] font-mono placeholder:text-fraud-faint placeholder:tracking-normal placeholder:text-sm outline-none focus:border-fraud-primary/50"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Document Upload */}
            {currentStep === 2 && (
              <div>
                {!uploaded ? (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full border-2 border-dashed border-fraud-faint/30 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-fraud-primary/40 transition-colors min-h-[44px]"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-10 h-10 text-fraud-primary animate-spin" />
                        <p className="text-sm text-fraud-muted">Verifying document...</p>
                        <div className="w-full bg-fraud-surface2 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className="h-full bg-fraud-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-fraud-surface2 flex items-center justify-center">
                          <Camera className="w-7 h-7 text-fraud-muted" />
                        </div>
                        <p className="text-sm text-fraud-muted">Tap to capture or upload</p>
                        <p className="text-xs text-fraud-faint">Aadhaar card photo</p>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-fraud-success/10 border border-fraud-success/30 rounded-xl p-6 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-fraud-success" />
                    <p className="text-sm font-medium text-fraud-success">Document verified ✓</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Liveness Check */}
            {currentStep === 3 && (
              <div>
                {!livenessConfirmed ? (
                  <button
                    onClick={handleLiveness}
                    disabled={scanning}
                    className="w-full flex flex-col items-center min-h-[44px]"
                  >
                    <div className="relative w-48 h-64 border-2 border-fraud-faint/30 rounded-[50%] overflow-hidden bg-fraud-surface flex items-center justify-center">
                      {scanning ? (
                        <div className="absolute inset-0">
                          <motion.div
                            className="absolute left-0 right-0 h-0.5 bg-fraud-primary shadow-[0_0_10px_hsl(177,100%,39%)]"
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 2 }}
                          />
                        </div>
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-fraud-faint" />
                        </>
                      )}
                    </div>
                    <p className="text-sm text-fraud-muted mt-4">
                      {scanning ? "Scanning..." : "Tap to start liveness check"}
                    </p>
                  </button>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-fraud-success/10 border border-fraud-success/30 rounded-xl p-6 flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-fraud-success" />
                    <p className="text-sm font-medium text-fraud-success">Liveness confirmed ✓</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <div className="bg-fraud-surface rounded-xl p-4 border border-fraud-faint/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-fraud-muted">Aadhaar</span>
                    <span className="text-fraud-text font-mono">XXXX-XXXX-{aadhaar.slice(-4) || "0000"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fraud-muted">Document</span>
                    <span className="text-fraud-success text-sm">Verified ✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fraud-muted">Liveness</span>
                    <span className="text-fraud-success text-sm">Confirmed ✓</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Continue Button */}
        {(canContinue() || currentStep === 4) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <button
              onClick={handleContinue}
              disabled={submitting}
              className="w-full bg-fraud-primary text-fraud-bg font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 min-h-[44px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === 4 ? (
                "Submit for Verification"
              ) : (
                "Continue"
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default KycPage;
