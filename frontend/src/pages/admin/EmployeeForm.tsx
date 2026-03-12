import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { employeeService } from '@/services/employeeService';
import { departmentService } from '@/services/departmentService';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  highestEducation: z.string().optional(),
  educationCompletionDate: z.string().optional(),
  certifications: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(2, 'Designation is required'),
  joiningDate: z.string(),
  joiningPackage: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract']).optional(),
  salary: z.string().min(1, 'Salary is required'),
  panNumber: z.string().optional(),
  aadharNumber: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  ifscCode: z.string().optional(),
  lastWorkingDay: z.string().optional(),
  lastDesignation: z.string().optional(),
  lastDrawnCTC: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        salary: Number(data.salary),
        joiningPackage: data.joiningPackage ? Number(data.joiningPackage) : undefined,
        lastDrawnCTC: data.lastDrawnCTC ? Number(data.lastDrawnCTC) : undefined,
      };
      
      if (isEdit && id) {
        await employeeService.update(id, payload);
      } else {
        await employeeService.create(payload as any);
      }
      navigate('/admin/employees');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Button variant="ghost" onClick={() => navigate('/admin/employees')} className="mb-1 w-full sm:mb-2 sm:w-auto">
        <ArrowLeft size={20} className="mr-2" />
        Back to Employees
      </Button>

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
            <Select
              label="Gender"
              {...register('gender')}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              error={errors.gender?.message}
            />
            <Input label="PAN Number" {...register('panNumber')} placeholder="ABCDE1234F" />
            <Input label="Aadhar Number" {...register('aadharNumber')} placeholder="1234 5678 9012" />
            <div className="md:col-span-2">
              <Input label="Local Address (Pune)" {...register('address')} error={errors.address?.message} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Education & Certification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Highest Education Qualification"
              {...register('highestEducation')}
              options={[
                { value: '10th', label: '10th' },
                { value: '12th', label: '12th' },
                { value: 'degree', label: 'Degree' },
                { value: 'graduation', label: 'Graduation' },
                { value: 'post-graduation', label: 'Post Graduation' },
              ]}
            />
            <Input label="Date of Completion" type="date" {...register('educationCompletionDate')} />
            <div className="md:col-span-2">
              <Input label="Certification / Courses Completed" {...register('certifications')} placeholder="e.g., AWS Certified, React Developer" />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Department"
              {...register('department')}
              options={departments.map(dept => ({ value: dept._id, label: dept.name }))}
              error={errors.department?.message}
            />
            <Input label="Designation" {...register('designation')} error={errors.designation?.message} />
            <Input label="Date of Joining" type="date" {...register('joiningDate')} error={errors.joiningDate?.message} />
            <Input label="Joining Package (₹)" type="number" {...register('joiningPackage')} placeholder="Annual CTC" />
            <Select
              label="Employment Type"
              {...register('employmentType')}
              options={[
                { value: 'full-time', label: 'Full Time' },
                { value: 'part-time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
              ]}
              error={errors.employmentType?.message}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Salary & Bank Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Current Annual Salary (₹)" type="number" {...register('salary')} error={errors.salary?.message} />
            <Input label="Bank Account Number" {...register('bankAccount')} />
            <Input label="Bank Name" {...register('bankName')} placeholder="e.g., HDFC Bank" />
            <Input label="Branch" {...register('bankBranch')} placeholder="e.g., Pune Main Branch" />
            <Input label="IFSC Code" {...register('ifscCode')} placeholder="e.g., HDFC0001234" />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Previous Employment (If Applicable)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Last Working Day" type="date" {...register('lastWorkingDay')} />
            <Input label="Last Designation" {...register('lastDesignation')} placeholder="Previous job title" />
            <Input label="Last Drawn CTC (₹)" type="number" {...register('lastDrawnCTC')} placeholder="Annual CTC" />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Aadhar Card</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">2. PAN Card</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3. Last Sem Mark Sheet</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">4. Degree</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">5. Course Certificate</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6. Experience Letter</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">7. Bank Passbook</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">8. Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB per file)</p>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/employees')} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
