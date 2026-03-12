import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { employeeService } from '@/services/employeeService';
import { apiClient } from '@/services/api';

const DOCUMENT_TYPES = [
  { value: 'offer-letter', label: 'Offer Letter' },
  { value: 'appointment-letter', label: 'Appointment Letter' },
  { value: 'experience-letter', label: 'Experience Letter' },
  { value: 'relieving-letter', label: 'Relieving Letter' },
  { value: 'salary-slip', label: 'Salary Slip' },
  { value: 'internship-letter', label: 'Internship Letter' },
  { value: 'promotion-letter', label: 'Promotion Letter' },
  { value: 'warning-letter', label: 'Warning Letter' },
  { value: 'increment-letter', label: 'Increment Letter' },
  { value: 'joining-letter', label: 'Joining Letter' },
];

export const GenerateDocument: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/documents/generate/${selectedEmployee}/${selectedTemplate}`,
        { responseType: 'arraybuffer' }
      );

      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const generatedUrl = window.URL.createObjectURL(blob);
      setPdfUrl(generatedUrl);
      setFileName(`${selectedTemplate}.pdf`);
      setStep(3);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', fileName || `${selectedTemplate}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="page-shell">
      <Button variant="ghost" onClick={() => navigate('/admin/templates')} className="mb-1 w-full sm:mb-2 sm:w-auto">
        <ArrowLeft size={20} className="mr-2" />
        Back to Templates
      </Button>

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Generate Document</h1>

      <div className={`${step === 3 ? 'max-w-6xl' : 'max-w-3xl'} mx-auto w-full`}>
        <div className="mb-8 flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex min-w-[100px] flex-1 items-center">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-4 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Step 1: Select Employee</h2>
            <Select
              label="Choose Employee"
              options={employees.map(emp => ({
                value: emp._id,
                label: `${emp.firstName} ${emp.lastName} - ${emp.designation}`
              }))}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            />
            <div className="mt-6">
              <Button onClick={() => setStep(2)} disabled={!selectedEmployee} className="w-full sm:w-auto">
                Next
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Step 2: Select Template</h2>
            <Select
              label="Choose Document Template"
              options={DOCUMENT_TYPES}
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setStep(1)} variant="secondary" className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={!selectedTemplate || loading} className="w-full sm:w-auto">
                {loading ? 'Generating...' : 'Generate Document'}
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Preview Ready</h2>
                <p className="text-gray-600">Pehle check karein, phir Download karein.</p>
              </div>
            </div>

            {pdfUrl && (
              <object
                data={pdfUrl}
                type="application/pdf"
                className="mb-6 h-[65vh] min-h-[420px] w-full rounded-md border border-gray-300 sm:h-[75vh] lg:h-[82vh]"
              >
                <iframe
                  src={pdfUrl}
                  title="Document Preview"
                  className="w-full h-full"
                />
              </object>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button onClick={handleDownload} className="w-full sm:w-auto">
                <Download size={18} className="mr-2" />
                Download PDF
              </Button>
              <Button onClick={() => {
                if (pdfUrl) {
                  window.URL.revokeObjectURL(pdfUrl);
                }
                setPdfUrl('');
                setFileName('');
                setStep(1);
                setSelectedEmployee('');
                setSelectedTemplate('');
              }} className="w-full sm:w-auto">
                Generate Another
              </Button>
              <Button variant="secondary" onClick={() => navigate('/admin/documents')} className="w-full sm:w-auto">
                View All Documents
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

