import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Download, Eye, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { documentService } from '@/services/documentService';
import { employeeService } from '@/services/employeeService';
import { Employee, GeneratedDocument } from '@/types';

export const DocumentsHistory: React.FC = () => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [streamStatus, setStreamStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const [selectedEmployeeKey, setSelectedEmployeeKey] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncData = async () => {
      try {
        const [documentData, employeeData] = await Promise.all([
          documentService.getAll(),
          employeeService.getAll(),
        ]);

        if (isMounted) {
          setDocuments(documentData);
          setEmployees(employeeData);
        }
      } catch (error) {
        console.error('Failed to fetch document history:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    syncData();

    const eventSource = documentService.subscribe({
      onSnapshot: (snapshot) => {
        if (!isMounted) return;
        setDocuments(snapshot);
        setStreamStatus('live');
        setLoading(false);
      },
      onUpsert: (document) => {
        if (!isMounted) return;
        setDocuments((current) => {
          const next = current.filter((item) => item._id !== document._id);
          return [document, ...next];
        });
        setStreamStatus('live');
      },
      onDelete: (id) => {
        if (!isMounted) return;
        setDocuments((current) => current.filter((item) => item._id !== id));
      },
    });

    eventSource.onopen = () => {
      if (isMounted) {
        setStreamStatus('live');
      }
    };

    eventSource.onerror = () => {
      if (isMounted) {
        setStreamStatus('offline');
      }
    };

    return () => {
      isMounted = false;
      eventSource.close();
    };
  }, []);

  const employeeDirectory = useMemo(
    () => new Map(
      employees.map((employee) => [
        (employee as Employee & { _id?: string })._id ?? employee.id,
        employee,
      ])
    ),
    [employees]
  );

  const sortedEmployees = useMemo(
    () => [...employees].sort((left, right) => {
      const leftName = `${left.firstName} ${left.lastName}`.toLowerCase();
      const rightName = `${right.firstName} ${right.lastName}`.toLowerCase();
      return leftName.localeCompare(rightName);
    }),
    [employees]
  );

  const getEmployeesPageId = (employee: Employee & { _id?: string }) => {
    const employeeKey = employee._id ?? employee.id;
    const index = sortedEmployees.findIndex((item) => {
      const itemKey = (item as Employee & { _id?: string })._id ?? item.id;
      return itemKey === employeeKey;
    });

    if (index === -1) {
      return employeeKey;
    }

    const joiningDate = new Date(employee.joiningDate);
    const month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    const year = String(joiningDate.getFullYear()).slice(-2);
    const serial = String(index + 1).padStart(2, '0');

    return `BS${month}${serial}${year}`;
  };

  const getEmployeeMeta = (document: GeneratedDocument) => {
    if (typeof document.employeeId === 'string') {
      const employee = employeeDirectory.get(document.employeeId);
      const resolvedId = employee
        ? getEmployeesPageId(employee as Employee & { _id?: string })
        : document.employeeId;

      return {
        name: employee ? `${employee.firstName} ${employee.lastName}`.trim() : 'Unknown Employee',
        code: resolvedId,
      };
    }

    const populatedEmployee = document.employeeId as {
      _id?: string;
      id?: string;
      firstName: string;
      lastName: string;
    };
    const employee = employeeDirectory.get(populatedEmployee._id ?? populatedEmployee.id ?? '');

    return {
      name: `${populatedEmployee.firstName} ${populatedEmployee.lastName}`.trim(),
      code: employee
        ? getEmployeesPageId(employee as Employee & { _id?: string })
        : populatedEmployee._id ?? populatedEmployee.id ?? 'ID unavailable',
    };
  };

  const formatDocumentType = (value: string) => value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const shouldIncludeDocument = (document: GeneratedDocument) => {
    const employee = getEmployeeMeta(document);
    const normalizedName = employee.name.trim().toLowerCase();

    if (normalizedName === 'shaikh arshad') {
      return ['offer-letter', 'increment-letter'].includes(document.documentType);
    }

    return true;
  };

  const employeeGroups = useMemo(() => {
    const groups = new Map<string, {
      key: string;
      name: string;
      code: string;
      documents: GeneratedDocument[];
    }>();

    for (const document of documents) {
      if (!shouldIncludeDocument(document)) {
        continue;
      }

      const employee = getEmployeeMeta(document);
      const key = typeof document.employeeId === 'string'
        ? document.employeeId
        : ((document.employeeId as { _id?: string; id?: string })._id
          ?? (document.employeeId as { _id?: string; id?: string }).id
          ?? employee.code);

      const current = groups.get(key);

      if (current) {
        current.documents.push(document);
        continue;
      }

      groups.set(key, {
        key,
        name: employee.name,
        code: employee.code,
        documents: [document],
      });
    }

    return Array.from(groups.values()).map((group) => ({
      ...group,
      documents: group.documents.sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      ),
    }));
  }, [documents, employeeDirectory]);

  useEffect(() => {
    if (employeeGroups.length === 0) {
      setSelectedEmployeeKey(null);
      return;
    }

    setSelectedEmployeeKey((current) => {
      if (current && employeeGroups.some((group) => group.key === current)) {
        return current;
      }

      return employeeGroups[0].key;
    });
  }, [employeeGroups]);

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'default',
      generated: 'success',
      sent: 'info',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const streamBadge = useMemo(() => {
    const variants = {
      connecting: 'default',
      live: 'success',
      offline: 'warning',
    } as const;

    return (
      <Badge variant={variants[streamStatus]}>
        {streamStatus === 'live' ? 'Live' : streamStatus === 'offline' ? 'Offline' : 'Connecting'}
      </Badge>
    );
  }, [streamStatus]);

  return (
    <div className="page-shell">
      <PageHeader
        title="Documents History"
        description="View and manage all generated documents"
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Employee name par click karne ke baad uske ready documents dikhenge.
          </p>
          <div className="flex items-center gap-2">
            {streamBadge}
            {loading && <RefreshCw size={16} className="animate-spin text-gray-400" />}
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">Employees</h2>
              <p className="text-xs text-gray-500">{employeeGroups.length} employees with documents</p>
            </div>
            <div className="divide-y divide-gray-200">
              {employeeGroups.map((group) => {
                const isActive = selectedEmployeeKey === group.key;

                return (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => setSelectedEmployeeKey(group.key)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition ${
                      isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{group.name}</p>
                      <p className="text-xs text-gray-500">ID: {group.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{group.documents.length}</Badge>
                      {isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </button>
                );
              })}
              {!loading && employeeGroups.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No employees with ready documents yet.
                </div>
              )}
            </div>
          </div>

          <div className="table-scroll">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Document Type</TableHeader>
                  <TableHeader>Generated Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeGroups
                  .find((group) => group.key === selectedEmployeeKey)
                  ?.documents.map((doc) => (
                    <TableRow key={doc._id}>
                      <TableCell className="min-w-[180px]">{formatDocumentType(doc.documentType)}</TableCell>
                      <TableCell className="min-w-[200px]">{new Date(doc.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" disabled>
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" disabled={!doc.fileUrl}>
                            <Download size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {!loading && employeeGroups.length > 0 && !selectedEmployeeKey && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      Select an employee to see ready documents.
                    </TableCell>
                  </TableRow>
                )}
                {!loading && employeeGroups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      No documents have been generated yet.
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  employeeGroups.length > 0 &&
                  selectedEmployeeKey &&
                  employeeGroups.find((group) => group.key === selectedEmployeeKey)?.documents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-gray-500">
                        No ready documents for the selected employee.
                      </TableCell>
                    </TableRow>
                  )}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      Loading document history...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};
