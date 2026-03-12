import React, { useState } from 'react';
import { FileText, Eye, Edit, FilePlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/services/api';

const templates = [
  {
    id: '1',
    name: 'Offer Letter',
    type: 'offer-letter',
    description: 'Standard offer letter template for new hires',
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '2',
    name: 'Appointment Letter',
    type: 'appointment-letter',
    description: 'Official appointment letter',
    icon: FileText,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: '3',
    name: 'Increment Letter',
    type: 'increment-letter',
    description: 'Salary increment notification letter',
    icon: FileText,
    color: 'bg-teal-100 text-teal-600',
  },
  {
    id: '4',
    name: 'Experience Letter',
    type: 'experience-letter',
    description: 'Experience certificate for employees',
    icon: FileText,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: '5',
    name: 'Salary Slip',
    type: 'salary-slip',
    description: 'Monthly salary slip template',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: '6',
    name: 'Relieving Letter',
    type: 'relieving-letter',
    description: 'Relieving letter for exiting employees',
    icon: FileText,
    color: 'bg-red-100 text-red-600',
  },
  {
    id: '7',
    name: 'Promotion Letter',
    type: 'promotion-letter',
    description: 'Employee promotion notification letter',
    icon: FileText,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: '8',
    name: 'Internship Letter',
    type: 'internship-letter',
    description: 'Certificate for completed internship',
    icon: FileText,
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    id: '9',
    name: 'Warning Letter',
    type: 'warning-letter',
    description: 'Disciplinary warning letter',
    icon: FileText,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: '10',
    name: 'Joining Letter',
    type: 'joining-letter',
    description: 'Joining confirmation letter',
    icon: FileText,
    color: 'bg-pink-100 text-pink-600',
  },
];

export const DocumentTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const handlePreview = async (templateType: string, templateName: string) => {
    try {
      const response = await apiClient.get(`/templates/preview/${templateType}`, {
        responseType: 'text',
        headers: {
          Accept: 'text/html',
        },
      });

      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/html' })
      );
      setPreviewUrl(url);
      setPreviewTitle(templateName);
    } catch (error: any) {
      alert('Failed to preview template');
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewTitle('');
  };

  const handleEdit = (templateType: string) => {
    // Navigate to template editor (future feature)
    navigate(`/admin/templates/edit/${templateType}`);
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Document Templates"
        description="Manage and customize document templates"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-34px_rgba(18,38,31,0.42)]">
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl p-3 ${template.color}`}>
                <template.icon size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreview(template.type, template.name)}
                className="w-full sm:w-auto"
              >
                <Eye size={16} className="mr-1" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(template.type)} className="w-full sm:w-auto">
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/admin/generate-document', { state: { templateId: template.id } })}
                className="w-full sm:w-auto"
              >
                <FilePlus size={16} className="mr-1" />
                Generate
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 p-3 sm:items-center sm:p-4" onClick={closePreview}>
          <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl bg-white sm:h-[90vh] sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold sm:text-xl">
                {previewTitle ? `${previewTitle} Preview` : 'Document Preview'}
              </h2>
              <button onClick={closePreview} className="p-2 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
