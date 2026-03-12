import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/helpers';
import { Download, Search, Eye, CheckCircle, DollarSign } from 'lucide-react';
import { employeeService } from '@/services/employeeService';
import { PayrollRecord, PayrollSummary } from '@/types/payroll';

export const Payroll: React.FC = () => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    loadPayrollData();
  }, [selectedMonth, selectedYear]);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      
      // Generate mock data based on real employees
      const employees = await employeeService.getAll();
      const monthName = months[selectedMonth];
      
      const mockPayroll: PayrollRecord[] = employees.map((emp, idx) => {
        const basicSalary = emp.salary * 0.5;
        const hra = emp.salary * 0.2;
        const conveyance = 2000;
        const medical = 1500;
        const special = emp.salary * 0.15;
        const other = emp.salary * 0.15;
        
        const grossSalary = basicSalary + hra + conveyance + medical + special + other;
        
        const pf = basicSalary * 0.12;
        const pt = 200;
        const incomeTax = grossSalary * 0.1;
        const esi = grossSalary * 0.0075;
        
        const totalDeductions = pf + pt + incomeTax + esi;
        const netSalary = grossSalary - totalDeductions;
        
        const statuses: Array<'pending' | 'processed' | 'paid'> = ['pending', 'processed', 'paid'];
        const status = statuses[idx % 3];
        
        return {
          id: `PAY-${selectedYear}-${selectedMonth + 1}-${idx + 1}`,
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          employeeCode: `EMP${String(idx + 1).padStart(4, '0')}`,
          department: emp.designation,
          designation: emp.designation,
          month: monthName,
          year: selectedYear,
          
          basicSalary,
          hra,
          conveyanceAllowance: conveyance,
          medicalAllowance: medical,
          specialAllowance: special,
          otherAllowances: other,
          
          providentFund: pf,
          professionalTax: pt,
          incomeTax,
          esi,
          loanDeduction: 0,
          otherDeductions: 0,
          
          workingDays: 26,
          presentDays: 24 + (idx % 3),
          absentDays: 2 - (idx % 3),
          paidLeaves: 2,
          unpaidLeaves: 0,
          
          grossSalary,
          totalDeductions,
          netSalary,
          
          status,
          paymentDate: status === 'paid' ? `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-28` : undefined,
          paymentMode: status === 'paid' ? 'bank-transfer' : undefined,
          transactionId: status === 'paid' ? `TXN${Date.now()}${idx}` : undefined,
        };
      });
      
      setPayrollRecords(mockPayroll);
      
      // Calculate summary
      const summaryData: PayrollSummary = {
        month: monthName,
        year: selectedYear,
        totalEmployees: mockPayroll.length,
        totalGrossSalary: mockPayroll.reduce((sum, p) => sum + p.grossSalary, 0),
        totalDeductions: mockPayroll.reduce((sum, p) => sum + p.totalDeductions, 0),
        totalNetSalary: mockPayroll.reduce((sum, p) => sum + p.netSalary, 0),
        processedCount: mockPayroll.filter(p => p.status === 'processed').length,
        pendingCount: mockPayroll.filter(p => p.status === 'pending').length,
        paidCount: mockPayroll.filter(p => p.status === 'paid').length,
      };
      
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading payroll data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Salary & Payroll Management" 
        description="Manage employee payroll, salary processing, and payment tracking"
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalEmployees}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gross Salary</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalGrossSalary)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalDeductions)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Payable</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalNetSalary)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Status Summary */}
      {summary && (
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{summary.pendingCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Processed</p>
              <p className="text-xl font-bold text-blue-600">{summary.processedCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-xl font-bold text-green-600">{summary.paidCount}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Payroll Table */}
      <Card>
        <div className="table-scroll">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Basic</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">HRA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Allowances</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gross</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Deductions</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.employeeName}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.employeeCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.designation}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{formatCurrency(record.basicSalary)}</td>
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(record.hra)}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    {formatCurrency(record.conveyanceAllowance + record.medicalAllowance + record.specialAllowance + record.otherAllowances)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">
                    {formatCurrency(record.grossSalary)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-red-600">
                    {formatCurrency(record.totalDeductions)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-blue-600">
                    {formatCurrency(record.netSalary)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    <div className="text-gray-900">{record.presentDays}/{record.workingDays}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button className="w-full sm:w-auto">
          Process Payroll
        </Button>
      </div>
    </div>
  );
};
