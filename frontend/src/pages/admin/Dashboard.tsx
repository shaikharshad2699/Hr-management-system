import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, DollarSign, FileText, Calendar, Clock } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';
import { employeeService } from '@/services/employeeService';
import { departmentService } from '@/services/departmentService';
import { documentService } from '@/services/documentService';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalDocuments: 0,
    monthlyPayroll: 0,
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [employees, depts, documents] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        documentService.getAll(),
      ]);

      const totalPayroll = employees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0);
      const monthlyPayroll = Math.round(totalPayroll / 12);

      setStats({
        totalEmployees: employees.length,
        totalDepartments: depts.length,
        totalDocuments: documents.length,
        monthlyPayroll,
      });

      setDepartments(depts);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: 'Total Employees',
      value: loading ? '...' : stats.totalEmployees.toString(),
      icon: Users,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/admin/employees',
    },
    {
      title: 'Total Departments',
      value: loading ? '...' : stats.totalDepartments.toString(),
      icon: Building2,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/admin/departments',
    },
    {
      title: 'Monthly Payroll',
      value: loading ? '...' : formatCurrency(stats.monthlyPayroll),
      icon: DollarSign,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/admin/employees',
    },
    {
      title: 'Documents Generated',
      value: loading ? '...' : stats.totalDocuments.toString(),
      icon: FileText,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: '/admin/documents',
    },
  ];

  const leaveStats = [
    { label: 'Employees on Leave', value: '12', icon: Calendar, color: 'text-yellow-600' },
    { label: 'Pending Approvals', value: '8', icon: Clock, color: 'text-red-600' },
    { label: 'Pending Documents', value: '15', icon: FileText, color: 'text-blue-600' },
  ];

  return (
    <div className="page-shell">
      <Card className="overflow-hidden border-white/80 bg-gradient-to-br from-white to-primary-50/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-700">Operations Overview</p>
            <h1 className="text-3xl font-bold tracking-tight text-[#2f3733] sm:text-4xl">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">Welcome back. Track people ops, payroll movement, and document activity from one place.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-primary-100">
              <p className="text-xs uppercase tracking-wide text-gray-500">This Month</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalDocuments}</p>
              <p className="text-xs text-gray-500">documents generated</p>
            </div>
            <div className="rounded-2xl bg-primary-600 p-4 text-white shadow-sm">
              <p className="text-xs uppercase tracking-wide text-primary-100">Payroll</p>
              <p className="mt-1 text-2xl font-bold">{loading ? '...' : formatCurrency(stats.monthlyPayroll)}</p>
              <p className="text-xs text-primary-100">monthly run rate</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {statsData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {leaveStats.map((stat) => (
          <Card 
            key={stat.label}
            className="cursor-pointer transition-all hover:shadow-[0_28px_60px_-34px_rgba(18,38,31,0.42)]"
            onClick={() => navigate('/admin/employees')}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary-50 p-3">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'New employee added', name: 'John Doe', time: '2 hours ago' },
              { action: 'Offer letter generated', name: 'Jane Smith', time: '4 hours ago' },
              { action: 'Salary slip created', name: 'Mike Johnson', time: '1 day ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex flex-col gap-2 border-b py-2 last:border-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.name}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Department Overview</h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : departments.length === 0 ? (
            <p className="text-center text-gray-500">No departments found</p>
          ) : (
            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept._id}>
                  <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <span className="text-sm text-gray-500">{dept.description}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
