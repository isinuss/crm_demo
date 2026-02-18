import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Search, Users, Trash2 } from 'lucide-react';
import { GET_CONTACTS, CREATE_CONTACT, DELETE_CONTACT } from '@/graphql/queries';
import { LifecycleStage } from '@shared/index';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Table, { type Column } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

const stageColors: Record<string, 'blue' | 'yellow' | 'green' | 'red'> = {
  LEAD: 'blue',
  QUALIFIED: 'yellow',
  CUSTOMER: 'green',
  CHURNED: 'red',
};

const stages = ['ALL', ...Object.values(LifecycleStage)];

interface ContactRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  lifecycleStage: string;
  tags: string[];
  createdAt: string;
  company?: { id: string; name: string };
  [key: string]: unknown;
}

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    lifecycleStage: LifecycleStage.LEAD,
  });

  const { data, loading, refetch } = useQuery(GET_CONTACTS, {
    variables: {
      search: search || undefined,
      lifecycleStage: stageFilter !== 'ALL' ? stageFilter : undefined,
    },
  });

  const [createContact, { loading: creating }] = useMutation(CREATE_CONTACT, {
    onCompleted: () => {
      setModalOpen(false);
      resetForm();
      refetch();
    },
  });

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    onCompleted: () => refetch(),
  });

  const resetForm = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      lifecycleStage: LifecycleStage.LEAD,
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createContact({ variables: { input: form } });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact({ variables: { id } });
    }
  };

  const columns: Column<ContactRow>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => (
        <div className="font-medium text-gray-900">
          {item.firstName} {item.lastName}
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'company',
      header: 'Company',
      render: (item) => item.company?.name || '-',
    },
    {
      key: 'lifecycleStage',
      header: 'Stage',
      render: (item) => (
        <Badge color={stageColors[item.lifecycleStage] || 'gray'}>
          {item.lifecycleStage}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <button
          onClick={(e) => handleDelete(e, item.id)}
          className="p-1 text-gray-400 hover:text-danger transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const contacts: ContactRow[] = (data as any)?.contacts ?? [];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stage filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setStageFilter(stage)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              stageFilter === stage
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card padding={false}>
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        ) : contacts.length > 0 ? (
          <Table
            columns={columns}
            data={contacts}
            onRowClick={(item) => navigate(`/contacts/${item.id}`)}
          />
        ) : (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No contacts found"
            description="Get started by adding your first contact."
            actionLabel="Add Contact"
            onAction={() => setModalOpen(true)}
          />
        )}
      </Card>

      {/* Create Contact Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Contact">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lifecycle Stage
            </label>
            <select
              value={form.lifecycleStage}
              onChange={(e) =>
                setForm({ ...form, lifecycleStage: e.target.value as LifecycleStage })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {Object.values(LifecycleStage).map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactsPage;
