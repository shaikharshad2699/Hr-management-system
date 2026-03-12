export const APP_NAME = 'HR Waseem';
export const APP_DESCRIPTION = 'Document Management System';

export const ROUTES = {
  LOGIN: '/login',
  ADMIN: '/admin',
  DASHBOARD: '/admin/dashboard',
  EMPLOYEES: '/admin/employees',
  DEPARTMENTS: '/admin/departments',
  PAYROLL: '/admin/payroll',
  TEMPLATES: '/admin/templates',
  GENERATE_DOCUMENT: '/admin/generate-document',
  DOCUMENTS: '/admin/documents',
  SETTINGS: '/admin/settings',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;
