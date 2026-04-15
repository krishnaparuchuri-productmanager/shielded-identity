export interface FraudSignal {
  signal: string;
  severity: "low" | "medium" | "high";
  detected: boolean;
}

export interface AadhaarProfile {
  aadhaarNumber: string;
  name: string;
  dob: string;
  address: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  fraudSignals: FraudSignal[];
  linkedAccounts: number;
  lastVerified: string;
  verificationStatus: "VERIFIED" | "PENDING" | "FLAGGED" | "BLOCKED";
}

export interface FraudCase {
  caseId: string;
  aadhaarLast4: string;
  name: string;
  assignedTo: string;
  priority: "P1" | "P2" | "P3";
  status: "OPEN" | "UNDER_REVIEW" | "ESCALATED" | "CLOSED";
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reportedAt: string;
  fraudType: string;
  signals: string[];
}

export interface KycStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: "completed" | "active" | "pending";
}

export const aadhaarProfiles: AadhaarProfile[] = [
  {
    aadhaarNumber: "XXXX-XXXX-4521",
    name: "Priya Sharma",
    dob: "1992-03-15",
    address: "Mumbai, Maharashtra",
    riskScore: 12,
    riskLevel: "LOW",
    fraudSignals: [
      { signal: "SIM Swap Detected", severity: "low", detected: false },
      { signal: "Multiple Loan Applications", severity: "medium", detected: false },
      { signal: "Address Mismatch", severity: "low", detected: false },
      { signal: "Duplicate Identity", severity: "high", detected: false },
      { signal: "Velocity Fraud", severity: "medium", detected: false },
      { signal: "Document Tampering Suspected", severity: "high", detected: false },
      { signal: "OTP Bypass Attempt", severity: "high", detected: false },
      { signal: "Biometric Mismatch", severity: "high", detected: false },
    ],
    linkedAccounts: 2,
    lastVerified: "2026-04-14T10:30:00Z",
    verificationStatus: "VERIFIED",
  },
  {
    aadhaarNumber: "XXXX-XXXX-7832",
    name: "Rajesh Kumar",
    dob: "1988-07-22",
    address: "Delhi, NCR",
    riskScore: 45,
    riskLevel: "MEDIUM",
    fraudSignals: [
      { signal: "SIM Swap Detected", severity: "low", detected: false },
      { signal: "Multiple Loan Applications", severity: "medium", detected: true },
      { signal: "Address Mismatch", severity: "low", detected: true },
      { signal: "Duplicate Identity", severity: "high", detected: false },
      { signal: "Velocity Fraud", severity: "medium", detected: false },
      { signal: "Document Tampering Suspected", severity: "high", detected: false },
      { signal: "OTP Bypass Attempt", severity: "high", detected: false },
      { signal: "Biometric Mismatch", severity: "high", detected: false },
    ],
    linkedAccounts: 5,
    lastVerified: "2026-04-13T14:20:00Z",
    verificationStatus: "PENDING",
  },
  {
    aadhaarNumber: "XXXX-XXXX-3190",
    name: "Anita Desai",
    dob: "1995-11-08",
    address: "Bangalore, Karnataka",
    riskScore: 72,
    riskLevel: "HIGH",
    fraudSignals: [
      { signal: "SIM Swap Detected", severity: "low", detected: true },
      { signal: "Multiple Loan Applications", severity: "medium", detected: true },
      { signal: "Address Mismatch", severity: "low", detected: true },
      { signal: "Duplicate Identity", severity: "high", detected: true },
      { signal: "Velocity Fraud", severity: "medium", detected: false },
      { signal: "Document Tampering Suspected", severity: "high", detected: false },
      { signal: "OTP Bypass Attempt", severity: "high", detected: false },
      { signal: "Biometric Mismatch", severity: "high", detected: false },
    ],
    linkedAccounts: 8,
    lastVerified: "2026-04-10T09:15:00Z",
    verificationStatus: "FLAGGED",
  },
  {
    aadhaarNumber: "XXXX-XXXX-6647",
    name: "Vikram Singh",
    dob: "1990-01-30",
    address: "Jaipur, Rajasthan",
    riskScore: 91,
    riskLevel: "CRITICAL",
    fraudSignals: [
      { signal: "SIM Swap Detected", severity: "low", detected: true },
      { signal: "Multiple Loan Applications", severity: "medium", detected: true },
      { signal: "Address Mismatch", severity: "low", detected: true },
      { signal: "Duplicate Identity", severity: "high", detected: true },
      { signal: "Velocity Fraud", severity: "medium", detected: true },
      { signal: "Document Tampering Suspected", severity: "high", detected: true },
      { signal: "OTP Bypass Attempt", severity: "high", detected: false },
      { signal: "Biometric Mismatch", severity: "high", detected: false },
    ],
    linkedAccounts: 14,
    lastVerified: "2026-04-05T16:45:00Z",
    verificationStatus: "FLAGGED",
  },
  {
    aadhaarNumber: "XXXX-XXXX-9901",
    name: "Meera Patel",
    dob: "1985-05-19",
    address: "Ahmedabad, Gujarat",
    riskScore: 98,
    riskLevel: "CRITICAL",
    fraudSignals: [
      { signal: "SIM Swap Detected", severity: "low", detected: true },
      { signal: "Multiple Loan Applications", severity: "medium", detected: true },
      { signal: "Address Mismatch", severity: "low", detected: true },
      { signal: "Duplicate Identity", severity: "high", detected: true },
      { signal: "Velocity Fraud", severity: "medium", detected: true },
      { signal: "Document Tampering Suspected", severity: "high", detected: true },
      { signal: "OTP Bypass Attempt", severity: "high", detected: true },
      { signal: "Biometric Mismatch", severity: "high", detected: true },
    ],
    linkedAccounts: 21,
    lastVerified: "2026-03-28T08:00:00Z",
    verificationStatus: "BLOCKED",
  },
];

export const fraudCases: FraudCase[] = [
  {
    caseId: "FS-2026-00142",
    aadhaarLast4: "6647",
    name: "Vikram Singh",
    assignedTo: "Kavita Puri",
    priority: "P1",
    status: "ESCALATED",
    riskScore: 91,
    riskLevel: "CRITICAL",
    reportedAt: "12 mins ago",
    fraudType: "Identity Theft",
    signals: ["SIM Swap Detected", "Duplicate Identity", "Document Tampering Suspected"],
  },
  {
    caseId: "FS-2026-00141",
    aadhaarLast4: "9901",
    name: "Meera Patel",
    assignedTo: "Arjun Nair",
    priority: "P1",
    status: "OPEN",
    riskScore: 98,
    riskLevel: "CRITICAL",
    reportedAt: "24 mins ago",
    fraudType: "Synthetic Identity",
    signals: ["Biometric Mismatch", "OTP Bypass Attempt", "Velocity Fraud"],
  },
  {
    caseId: "FS-2026-00139",
    aadhaarLast4: "3190",
    name: "Anita Desai",
    assignedTo: "Kavita Puri",
    priority: "P2",
    status: "UNDER_REVIEW",
    riskScore: 72,
    riskLevel: "HIGH",
    reportedAt: "1 hr ago",
    fraudType: "Account Takeover",
    signals: ["SIM Swap Detected", "Multiple Loan Applications"],
  },
  {
    caseId: "FS-2026-00137",
    aadhaarLast4: "7832",
    name: "Rajesh Kumar",
    assignedTo: "Sanjay Mehta",
    priority: "P2",
    status: "UNDER_REVIEW",
    riskScore: 45,
    riskLevel: "MEDIUM",
    reportedAt: "2 hrs ago",
    fraudType: "Loan Fraud",
    signals: ["Multiple Loan Applications", "Address Mismatch"],
  },
  {
    caseId: "FS-2026-00135",
    aadhaarLast4: "4521",
    name: "Priya Sharma",
    assignedTo: "Arjun Nair",
    priority: "P3",
    status: "CLOSED",
    riskScore: 12,
    riskLevel: "LOW",
    reportedAt: "3 hrs ago",
    fraudType: "False Positive",
    signals: [],
  },
  {
    caseId: "FS-2026-00133",
    aadhaarLast4: "2288",
    name: "Deepak Joshi",
    assignedTo: "Kavita Puri",
    priority: "P1",
    status: "OPEN",
    riskScore: 85,
    riskLevel: "HIGH",
    reportedAt: "4 hrs ago",
    fraudType: "Identity Theft",
    signals: ["Document Tampering Suspected", "Biometric Mismatch"],
  },
  {
    caseId: "FS-2026-00130",
    aadhaarLast4: "5567",
    name: "Sunita Reddy",
    assignedTo: "Sanjay Mehta",
    priority: "P2",
    status: "ESCALATED",
    riskScore: 68,
    riskLevel: "HIGH",
    reportedAt: "5 hrs ago",
    fraudType: "Account Takeover",
    signals: ["SIM Swap Detected", "OTP Bypass Attempt"],
  },
  {
    caseId: "FS-2026-00128",
    aadhaarLast4: "1123",
    name: "Amit Verma",
    assignedTo: "Arjun Nair",
    priority: "P3",
    status: "CLOSED",
    riskScore: 22,
    riskLevel: "LOW",
    reportedAt: "6 hrs ago",
    fraudType: "False Positive",
    signals: [],
  },
];

export const kycSteps: KycStep[] = [
  {
    id: 1,
    title: "Aadhaar Verification",
    description: "Enter your Aadhaar number and verify via OTP",
    icon: "shield-check",
    status: "active",
  },
  {
    id: 2,
    title: "Document Upload",
    description: "Upload your Aadhaar card photo for verification",
    icon: "file-text",
    status: "pending",
  },
  {
    id: 3,
    title: "Liveness Check",
    description: "Complete a selfie verification for liveness detection",
    icon: "scan-face",
    status: "pending",
  },
  {
    id: 4,
    title: "Review & Submit",
    description: "Review your details and submit for verification",
    icon: "check-circle",
    status: "pending",
  },
];

export const getRiskColor = (level: string) => {
  switch (level) {
    case "LOW": return "text-fraud-success";
    case "MEDIUM": return "text-fraud-warning";
    case "HIGH": return "text-fraud-danger";
    case "CRITICAL": return "text-fraud-danger";
    default: return "text-fraud-muted";
  }
};

export const getRiskBg = (level: string) => {
  switch (level) {
    case "LOW": return "bg-fraud-success/20 text-fraud-success";
    case "MEDIUM": return "bg-fraud-warning/20 text-fraud-warning";
    case "HIGH": return "bg-fraud-danger/20 text-fraud-danger";
    case "CRITICAL": return "bg-fraud-danger/20 text-fraud-danger";
    default: return "bg-fraud-muted/20 text-fraud-muted";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "VERIFIED": return "bg-fraud-success/20 text-fraud-success";
    case "PENDING": return "bg-fraud-warning/20 text-fraud-warning";
    case "FLAGGED": return "bg-fraud-danger/20 text-fraud-danger";
    case "BLOCKED": return "bg-fraud-danger/30 text-fraud-danger";
    default: return "bg-fraud-muted/20 text-fraud-muted";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "P1": return "bg-fraud-danger/20 text-fraud-danger";
    case "P2": return "bg-fraud-warning/20 text-fraud-warning";
    case "P3": return "bg-fraud-primary/20 text-fraud-primary";
    default: return "bg-fraud-muted/20 text-fraud-muted";
  }
};

export const getCaseStatusColor = (status: string) => {
  switch (status) {
    case "OPEN": return "bg-fraud-primary/20 text-fraud-primary";
    case "UNDER_REVIEW": return "bg-fraud-warning/20 text-fraud-warning";
    case "ESCALATED": return "bg-fraud-danger/20 text-fraud-danger";
    case "CLOSED": return "bg-fraud-muted/20 text-fraud-muted";
    default: return "bg-fraud-muted/20 text-fraud-muted";
  }
};
