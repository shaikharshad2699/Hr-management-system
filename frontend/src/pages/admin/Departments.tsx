import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { departmentService } from '@/services/departmentService';

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await departmentService.update(editId, formData);
      } else {
        await departmentService.create(formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      setEditId(null);
      fetchDepartments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save department');
    }
  };

  const handleEdit = (dept: any) => {
    setFormData({ name: dept.name, description: dept.description });
    setEditId(dept._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.delete(id);
        fetchDepartments();
      } catch (error) {
        console.error('Failed to delete department:', error);
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ name: '', description: '' });
    setEditId(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Departments"
        description="Manage organizational departments"
        action={{
          label: 'Add Department',
          onClick: handleAddNew,
          icon: <Plus size={20} />,
        }}
      />

      {departments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No departments found. Add your first department!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept._id} className="hover:shadow-md transition-shadow">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(dept._id)}>
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Department ID</span>
                  <span className="text-sm font-medium text-gray-900">{dept._id.slice(-6)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Department Name" 
            placeholder="e.g., Engineering" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input 
            label="Description" 
            placeholder="Brief description" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button type="submit" className="w-full sm:w-auto">{editId ? 'Update' : 'Add'} Department</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
