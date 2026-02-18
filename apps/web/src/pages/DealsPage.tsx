import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, DollarSign } from 'lucide-react';
import { GET_DEALS, CREATE_DEAL, UPDATE_DEAL } from '@/graphql/queries';
import { DealStage } from '@shared/index';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

const stageLabels: Record<string, string> = {
  PROSPECTING: 'Prospecting',
  QUALIFICATION: 'Qualification',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
};

const stageColors: Record<string, string> = {
  PROSPECTING: 'border-t-blue-400',
  QUALIFICATION: 'border-t-yellow-400',
  PROPOSAL: 'border-t-purple-400',
  NEGOTIATION: 'border-t-orange-400',
  CLOSED_WON: 'border-t-emerald-400',
  CLOSED_LOST: 'border-t-red-400',
};

const stageBadgeColors: Record<string, 'blue' | 'yellow' | 'purple' | 'green' | 'red' | 'gray'> = {
  PROSPECTING: 'blue',
  QUALIFICATION: 'yellow',
  PROPOSAL: 'purple',
  NEGOTIATION: 'yellow',
  CLOSED_WON: 'green',
  CLOSED_LOST: 'red',
};

interface DealItem {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  contact?: { id: string; firstName: string; lastName: string };
  company?: { id: string; name: string };
  owner?: { id: string; firstName: string; lastName: string };
}

const DealsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    value: '',
    currency: 'USD',
    stage: DealStage.PROSPECTING,
    probability: '10',
    expectedCloseDate: '',
  });

  const { data, loading, refetch } = useQuery(GET_DEALS);

  const [createDeal, { loading: creating }] = useMutation(CREATE_DEAL, {
    onCompleted: () => {
      setModalOpen(false);
      resetForm();
      refetch();
    },
  });

  const [updateDeal] = useMutation(UPDATE_DEAL, {
    onCompleted: () => refetch(),
  });

  const resetForm = () => {
    setForm({
      title: '',
      value: '',
      currency: 'USD',
      stage: DealStage.PROSPECTING,
      probability: '10',
      expectedCloseDate: '',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createDeal({
      variables: {
        input: {
          title: form.title,
          value: parseFloat(form.value) || 0,
          currency: form.currency,
          stage: form.stage,
          probability: parseInt(form.probability) || 10,
          expectedCloseDate: form.expectedCloseDate || undefined,
        },
      },
    });
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      updateDeal({
        variables: {
          id: dealId,
          input: { stage },
        },
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const deals: DealItem[] = data?.deals ?? [];

  const dealsByStage = Object.values(DealStage).reduce(
    (acc, stage) => {
      acc[stage] = deals.filter((d) => d.stage === stage);
      return acc;
    },
    {} as Record<string, DealItem[]>
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {deals.length} deal{deals.length !== 1 ? 's' : ''} &middot; Total:{' '}
          {formatCurrency(deals.reduce((sum, d) => sum + d.value, 0))}
        </p>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="grid grid-cols-6 gap-4 flex-1">
          {Object.values(DealStage).map((stage) => (
            <div key={stage} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-24 mb-3" />
              <div className="space-y-3">
                <div className="h-24 bg-gray-100 rounded-lg" />
                <div className="h-24 bg-gray-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4 flex-1 min-h-0 overflow-x-auto">
          {Object.values(DealStage).map((stage) => (
            <div
              key={stage}
              onDrop={(e) => handleDrop(e, stage)}
              onDragOver={handleDragOver}
              className="flex flex-col min-w-[200px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {stageLabels[stage]}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {dealsByStage[stage]?.length || 0}
                  </span>
                </div>
              </div>

              {/* Column Body */}
              <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 rounded-xl p-2 min-h-[200px]">
                {dealsByStage[stage]?.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 border-t-4 ${stageColors[stage]} cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow`}
                  >
                    <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                      {deal.title}
                    </h4>
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {formatCurrency(deal.value, deal.currency)}
                    </p>
                    {deal.contact && (
                      <p className="text-xs text-gray-500 truncate">
                        {deal.contact.firstName} {deal.contact.lastName}
                      </p>
                    )}
                    {deal.company && (
                      <p className="text-xs text-gray-500 truncate">
                        {deal.company.name}
                      </p>
                    )}
                    <div className="mt-2">
                      <Badge color={stageBadgeColors[deal.stage] || 'gray'}>
                        {deal.probability}%
                      </Badge>
                    </div>
                  </div>
                ))}

                {(!dealsByStage[stage] || dealsByStage[stage].length === 0) && (
                  <div className="flex items-center justify-center h-24 text-xs text-gray-400">
                    No deals
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Deal Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Deal">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Deal Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., Enterprise License"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Value"
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="10000"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select
                value={form.stage}
                onChange={(e) =>
                  setForm({ ...form, stage: e.target.value as DealStage })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {Object.values(DealStage).map((stage) => (
                  <option key={stage} value={stage}>
                    {stageLabels[stage]}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Probability (%)"
              type="number"
              min="0"
              max="100"
              value={form.probability}
              onChange={(e) => setForm({ ...form, probability: e.target.value })}
            />
          </div>
          <Input
            label="Expected Close Date"
            type="date"
            value={form.expectedCloseDate}
            onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DealsPage;
