import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { Employee } from '@/types';
import { employeeService } from '@/services/employeeService';

type TabType = 'total' | 'onboard' | 'exited';

export const EmployeesList: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('total');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  const getStatusBadge = (status: Employee['status']) => {
    const variants = {
      active: 'success',
      inactive: 'danger',
      'on-leave': 'warning',
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const filteredEmployees = employees
    .filter((emp: any) => {
      if (activeTab === 'total') return true;
      if (activeTab === 'onboard') return emp.status === 'active' || emp.status === 'on-leave';
      if (activeTab === 'exited') return emp.status === 'inactive';
      return true;
    })
    .sort((a: any, b: any) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const capitalizeWords = (str: string) => {
    // Remove initials pattern (e.g., "AA ", "SA ", "TP ")
    const withoutInitials = str.replace(/^[A-Z]{2}\s+/i, '');
    return withoutInitials
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getEmployeeId = (employee: any, index: number) => {
    const joiningDate = new Date(employee.joiningDate);
    const month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    const year = String(joiningDate.getFullYear()).slice(-2);
    const serial = String(index + 1).padStart(2, '0');
    return `BS${month}${serial}${year}`;
  };

  const tabs = [
    { id: 'total' as TabType, label: 'All Employees', count: employees.length },
    { id: 'onboard' as TabType, label: 'Active Employees', count: employees.filter((e: any) => e.status === 'active' || e.status === 'on-leave').length },
    { id: 'exited' as TabType, label: 'Ex-Employees', count: employees.filter((e: any) => e.status === 'inactive').length },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Employees"
        description="Manage your organization's employees"
        action={{
          label: 'Add Employee',
          onClick: () => navigate('/admin/employees/add'),
          icon: <Plus size={20} />,
        }}
      />

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

      <Card>
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No employees found in this category.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Employee ID</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Department</TableHeader>
                  <TableHeader>Designation</TableHeader>
                  <TableHeader>Salary</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee: any, index: number) => (
                  <TableRow key={employee._id}>
                    <TableCell className="min-w-[180px]">
                      <button
                        onClick={() => navigate(`/admin/employees/profile/${employee._id}`)}
                        className="font-medium text-primary-600 hover:text-primary-700 hover:underline text-left whitespace-nowrap"
                      >
                        {capitalizeWords(`${employee.firstName} ${employee.lastName}`)}
                      </button>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{getEmployeeId(employee, index)}</TableCell>
                    <TableCell className="min-w-[220px] whitespace-nowrap">{employee.email}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.department?.name || 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{employee.designation}</TableCell>
                    <TableCell className="whitespace-nowrap">₹{employee.salary?.toLocaleString('en-IN') || '0'}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(employee._id)}>
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};
