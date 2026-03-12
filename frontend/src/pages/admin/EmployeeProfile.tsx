import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { employeeService } from '@/services/employeeService';

type TabType = 'profile' | 'job' | 'salary' | 'increment' | 'attendance' | 'leave' | 'documents';

export const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getById(id!);
      setEmployee(data);
    } catch (error) {
      console.error('Failed to fetch employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile' },
    { id: 'job' as TabType, label: 'Job Details' },
    { id: 'salary' as TabType, label: 'Salary' },
    { id: 'increment' as TabType, label: 'Increment History' },
    { id: 'attendance' as TabType, label: 'Attendance' },
    { id: 'leave' as TabType, label: 'Leave' },
    { id: 'documents' as TabType, label: 'Documents' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: 'success',
      inactive: 'danger',
      'on-leave': 'warning',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!employee) {
    return <div className="text-center py-12">Employee not found</div>;
  }

  const salary = employee.salary || 0;
  const basicSalary = Math.round(salary * 0.30);
  const hra = Math.round(salary * 0.20);
  const allowances = Math.round(salary * 0.30);
  const bonus = Math.round(salary * 0.20);
  const monthlySalary = Math.round(salary / 12);

  const getEmployeeId = () => {
    const joiningDate = new Date(employee.joiningDate);
    const month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    const year = String(joiningDate.getFullYear()).slice(-2);
    // Use a hash of the _id to generate consistent serial number
    const idStr = employee._id || '';
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = ((hash << 5) - hash) + idStr.charCodeAt(i);
      hash = hash & hash;
    }
    const serial = String(Math.abs(hash) % 100).padStart(2, '0');
    return `BS${month}${serial}${year}`;
  };

  const capitalizeWords = (str: string) => {
    // Remove initials pattern (e.g., "AA ", "SA ", "TP ")
    const withoutInitials = str.replace(/^[A-Z]{2}\s+/i, '');
    return withoutInitials
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Mock increment data
  const incrementHistory = [
    {
      id: 'INC001',
      previousSalary: 350000,
      newSalary: 450000,
      incrementAmount: 100000,
      incrementPercentage: 28.57,
      incrementDate: '10 Jan 2025',
      approvedBy: 'Waseem Sajjad',
    },
  ];

  const lastIncrement = incrementHistory[0];
  const nextReviewDate = 'Jan 2026';

  return (
    <div className="page-shell">
      <Button variant="ghost" onClick={() => navigate('/admin/employees')} className="mb-1 w-full sm:mb-2 sm:w-auto">
        <ArrowLeft size={20} className="mr-2" />
        Back to Employees
      </Button>

      {/* Header Card */}
      <Card className="mb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700 sm:h-24 sm:w-24 sm:text-3xl">
            {capitalizeWords(`${employee.firstName} ${employee.lastName}`).split(' ').slice(0, 2).map(word => word.charAt(0)).join('')}
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {capitalizeWords(`${employee.firstName} ${employee.lastName}`)}
                </h1>
                <p className="text-gray-600 mt-1">{employee.designation} • {getEmployeeId()}</p>
              </div>
              {getStatusBadge(employee.status)}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                {employee.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase size={16} />
                {employee.department?.name || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="responsive-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  shrink-0 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="table-scroll">
          <table className="w-full min-w-[640px]">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700 w-1/3">Full Name</td>
                <td className="py-3 text-gray-900">{capitalizeWords(`${employee.firstName} ${employee.lastName}`)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Email</td>
                <td className="py-3 text-gray-900">{employee.email}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Phone Number</td>
                <td className="py-3 text-gray-900">{employee.phone}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Local Address</td>
                <td className="py-3 text-gray-900">{employee.address || 'Pune, Maharashtra'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Permanent Address</td>
                <td className="py-3 text-gray-900">{employee.permanentAddress || 'Pune, Maharashtra'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Marital Status</td>
                <td className="py-3 text-gray-900">{employee.maritalStatus || 'Single'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Gender</td>
                <td className="py-3 text-gray-900">{employee.gender || 'Male'}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Emergency Contact Number</td>
                <td className="py-3 text-gray-900">{employee.emergencyContact || employee.phone}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </Card>
      )}

      {activeTab === 'job' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Job Details</h2>
          <div className="table-scroll">
          <table className="w-full min-w-[640px]">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700 w-1/3">Employee ID</td>
                <td className="py-3 text-gray-900 font-semibold">{getEmployeeId()}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Department</td>
                <td className="py-3 text-gray-900">{employee.department?.name || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Designation</td>
                <td className="py-3 text-gray-900">{employee.designation}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Employment Type</td>
                <td className="py-3 text-gray-900">Full Time</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Joining Date</td>
                <td className="py-3 text-gray-900">{new Date(employee.joiningDate).toLocaleDateString('en-IN')}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Work Location</td>
                <td className="py-3 text-gray-900">Pune Office</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Reporting Manager</td>
                <td className="py-3 text-gray-900">Waseem Sajjad</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Status</td>
                <td className="py-3">{getStatusBadge(employee.status)}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </Card>
      )}

      {activeTab === 'salary' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Salary Breakdown</h2>
            <div className="table-scroll">
            <table className="w-full min-w-[640px]">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700 w-1/3">Current CTC (Annual)</td>
                  <td className="py-3 text-gray-900 font-semibold">₹{salary.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700">Basic Salary</td>
                  <td className="py-3 text-gray-900">₹{basicSalary.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700">HRA</td>
                  <td className="py-3 text-gray-900">₹{hra.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700">Allowances</td>
                  <td className="py-3 text-gray-900">₹{allowances.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700">Bonus</td>
                  <td className="py-3 text-gray-900">₹{bonus.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-gray-700">Total Monthly Salary</td>
                  <td className="py-3 text-gray-900 font-semibold">₹{monthlySalary.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Last Increment Information</h2>
            <div className="table-scroll">
            <table className="w-full min-w-[640px]">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700 w-1/3">Last Increment Date</td>
                  <td className="py-3 text-gray-900">{lastIncrement.incrementDate}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700">Current Salary</td>
                  <td className="py-3 text-gray-900 font-semibold">₹{salary.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-gray-700">Next Review Date</td>
                  <td className="py-3 text-gray-900">{nextReviewDate}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'increment' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Increment History</h2>
          <div className="table-scroll">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Increment ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Increment Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incrementHistory.map((inc) => (
                  <tr key={inc.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{inc.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{inc.previousSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">₹{inc.newSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-semibold">+₹{inc.incrementAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{inc.incrementPercentage}%</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{inc.incrementDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{inc.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Attendance Records</h2>
          <p className="text-gray-500">Attendance tracking coming soon...</p>
        </Card>
      )}

      {activeTab === 'leave' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Leave Records</h2>
          <p className="text-gray-500">Leave management coming soon...</p>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          <p className="text-gray-500">Document management coming soon...</p>
        </Card>
      )}
    </div>
  );
};
