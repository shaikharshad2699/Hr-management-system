export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  photo?: string;
  departmentId: string;
  designation: string;
  joiningDate: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'inactive' | 'on-leave';
  salary: number;
  bankAccount?: string;
  documents?: string[];
  highestEducation?: string;
  educationCompletionDate?: string;
  certifications?: string;
  joiningPackage?: number;
  panNumber?: string;
  aadharNumber?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  lastWorkingDay?: string;
  lastDesignation?: string;
  lastDrawnCTC?: number;
  resume?: string;
  degreeCertificate?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headId?: string;
  employeeCount: number;
  createdAt: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'offer-letter' | 'appointment-letter' | 'increment-letter' | 'experience-letter' | 'salary-slip' | 'relieving-letter' | 'promotion-letter' | 'internship-certificate' | 'warning-letter' | 'custom-document';
  description: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedDocument {
  _id: string;
  employeeId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email?: string;
        employeeId?: string;
      };
  documentType: string;
  status: 'draft' | 'generated' | 'sent';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager';
  avatar?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  monthlyPayroll: number;
  documentsGenerated: number;
  employeesOnLeave: number;
  pendingDocuments: number;
}
