import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Dashboard } from '@/pages/admin/Dashboard';
import { EmployeesList } from '@/pages/admin/EmployeesList';
import { EmployeeForm } from '@/pages/admin/EmployeeForm';
import { EmployeeProfile } from '@/pages/admin/EmployeeProfile';
import { Departments } from '@/pages/admin/Departments';
import { Payroll } from '@/pages/admin/Payroll';
import { DocumentTemplates } from '@/pages/admin/DocumentTemplates';
import { TemplateEditor } from '@/pages/admin/TemplateEditor';
import { GenerateDocument } from '@/pages/admin/GenerateDocument';
import { DocumentsHistory } from '@/pages/admin/DocumentsHistory';
import { Settings } from '@/pages/admin/Settings';
import { ROUTES } from '@/constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.ADMIN,
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.DASHBOARD} replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'employees',
            element: <EmployeesList />,
          },
          {
            path: 'employees/add',
            element: <EmployeeForm />,
          },
          {
            path: 'employees/edit/:id',
            element: <EmployeeForm />,
          },
          {
            path: 'employees/profile/:id',
            element: <EmployeeProfile />,
          },
          {
            path: 'departments',
            element: <Departments />,
          },
          {
            path: 'payroll',
            element: <Payroll />,
          },
          {
            path: 'templates',
            element: <DocumentTemplates />,
          },
          {
            path: 'templates/edit/:templateType',
            element: <TemplateEditor />,
          },
          {
            path: 'generate-document',
            element: <GenerateDocument />,
          },
          {
            path: 'documents',
            element: <DocumentsHistory />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);
