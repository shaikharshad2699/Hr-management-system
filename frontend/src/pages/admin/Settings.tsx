import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const Settings: React.FC = () => {
  return (
    <div className="page-shell">
      <PageHeader title="Settings" description="Manage your account and application settings" />

      <div className="max-w-4xl space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Company Name" defaultValue="Tech Corp" />
            <Input label="Email" type="email" defaultValue="admin@techcorp.com" />
            <Input label="Phone" defaultValue="+91 9876543210" />
            <Input label="Address" defaultValue="Mumbai, Maharashtra" className="md:col-span-2" />
            <Button className="mt-2 w-full md:col-span-2 md:w-auto">Save Changes</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm Password" type="password" className="md:col-span-2" />
            <Button className="mt-2 w-full md:col-span-2 md:w-auto">Update Password</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
