import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, Search, Building2, Trash2 } from 'lucide-react';
import { GET_COMPANIES, CREATE_COMPANY, DELETE_COMPANY } from '@/graphql/queries';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Table, { type Column } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

interface CompanyRow {
  id: string;
  name: string;
  industry: string;
  website: string;
  size: string;
  createdAt: string;
  [key: string]: unknown;
}

const CompaniesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    industry: '',
    website: '',
    size: '',
    address: '',
  });

  const { data, loading, refetch } = useQuery(GET_COMPANIES, {
    variables: { search: search || undefined },
  });

  const [createCompany, { loading: creating }] = useMutation(CREATE_COMPANY, {
    onCompleted: () => {
      setModalOpen(false);
      resetForm();
      refetch();
    },
  });

  const [deleteCompany] = useMutation(DELETE_COMPANY, {
    onCompleted: () => refetch(),
  });

  const resetForm = () => {
    setForm({ name: '', industry: '', website: '', size: '', address: '' });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany({ variables: { input: form } });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany({ variables: { id } });
    }
  };

  const columns: Column<CompanyRow>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => (
        <div className="font-medium text-gray-900">{item.name}</div>
      ),
    },
    { key: 'industry', header: 'Industry' },
    {
      key: 'website',
      header: 'Website',
      render: (item) =>
        item.website ? (
          <a
            href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {item.website}
          </a>
        ) : (
          '-'
        ),
    },
    { key: 'size', header: 'Size' },
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

  const companies: CompanyRow[] = data?.companies ?? [];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
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
        ) : companies.length > 0 ? (
          <Table columns={columns} data={companies} />
        ) : (
          <EmptyState
            icon={<Building2 className="h-12 w-12" />}
            title="No companies found"
            description="Get started by adding your first company."
            actionLabel="Add Company"
            onAction={() => setModalOpen(true)}
          />
        )}
      </Card>

      {/* Create Company Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Company">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Company Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Industry"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            placeholder="e.g., Technology, Healthcare"
          />
          <Input
            label="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://example.com"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="City, State"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CompaniesPage;
