export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  month: string;
  year: number;
  
  // Earnings
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
  
  // Deductions
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  esi: number;
  loanDeduction: number;
  otherDeductions: number;
  
  // Attendance
  workingDays: number;
  presentDays: number;
  absentDays: number;
  paidLeaves: number;
  unpaidLeaves: number;
  
  // Calculated
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  
  status: 'pending' | 'processed' | 'paid';
  paymentDate?: string;
  paymentMode?: 'bank-transfer' | 'cash' | 'cheque';
  transactionId?: string;
}

export interface PayrollSummary {
  month: string;
  year: number;
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  processedCount: number;
  pendingCount: number;
  paidCount: number;
}
