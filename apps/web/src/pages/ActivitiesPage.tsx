import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Plus,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckSquare,
  Activity,
} from 'lucide-react';
import { GET_ACTIVITIES, CREATE_ACTIVITY } from '@/graphql/queries';
import { ActivityType } from '@shared/index';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

const activityIcons: Record<string, React.FC<{ className?: string }>> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Calendar,
  NOTE: FileText,
  TASK: CheckSquare,
};

const activityColors: Record<string, 'blue' | 'green' | 'yellow' | 'gray' | 'purple'> = {
  CALL: 'blue',
  EMAIL: 'green',
  MEETING: 'yellow',
  NOTE: 'gray',
  TASK: 'purple',
};

const activityBgColors: Record<string, string> = {
  CALL: 'bg-blue-100 text-blue-600',
  EMAIL: 'bg-emerald-100 text-emerald-600',
  MEETING: 'bg-amber-100 text-amber-600',
  NOTE: 'bg-gray-100 text-gray-600',
  TASK: 'bg-purple-100 text-purple-600',
};

interface ActivityItem {
  id: string;
  type: string;
  subject: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  contact?: { id: string; firstName: string; lastName: string };
  deal?: { id: string; title: string };
  user?: { id: string; firstName: string; lastName: string };
}

const typeFilters = ['ALL', ...Object.values(ActivityType)];

const ActivitiesPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: ActivityType.CALL,
    subject: '',
    description: '',
    dueDate: '',
  });

  const { data, loading, refetch } = useQuery(GET_ACTIVITIES, {
    variables: { limit: 50 },
  });

  const [createActivity, { loading: creating }] = useMutation(CREATE_ACTIVITY, {
    onCompleted: () => {
      setModalOpen(false);
      resetForm();
      refetch();
    },
  });

  const resetForm = () => {
    setForm({
      type: ActivityType.CALL,
      subject: '',
      description: '',
      dueDate: '',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createActivity({
      variables: {
        input: {
          type: form.type,
          subject: form.subject,
          description: form.description,
          dueDate: form.dueDate || undefined,
        },
      },
    });
  };

  const activities: ActivityItem[] = data?.recentActivities ?? [];
  const filteredActivities =
    typeFilter === 'ALL'
      ? activities
      : activities.filter((a) => a.type === typeFilter);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex gap-4 bg-white rounded-xl p-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredActivities.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const IconComponent = activityIcons[activity.type] || Activity;
              const bgColor = activityBgColors[activity.type] || 'bg-gray-100 text-gray-600';

              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4 bg-white rounded-xl border border-gray-200 p-4 ml-0"
                >
                  {/* Icon */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${bgColor}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {activity.subject}
                        </h4>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <Badge color={activityColors[activity.type] || 'gray'}>
                        {activity.type}
                      </Badge>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      {activity.user && (
                        <span>
                          {activity.user.firstName} {activity.user.lastName}
                        </span>
                      )}
                      {activity.contact && (
                        <span>
                          Contact: {activity.contact.firstName} {activity.contact.lastName}
                        </span>
                      )}
                      {activity.deal && (
                        <span>Deal: {activity.deal.title}</span>
                      )}
                      <span>{formatDate(activity.createdAt)}</span>
                      {activity.completed && (
                        <Badge color="green">Completed</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={<Activity className="h-12 w-12" />}
            title="No activities found"
            description="Start logging activities to keep track of your interactions."
            actionLabel="Log Activity"
            onAction={() => setModalOpen(true)}
          />
        </div>
      )}

      {/* Create Activity Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Activity">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as ActivityType })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {Object.values(ActivityType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="e.g., Follow-up call with client"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[80px] resize-y"
              placeholder="Add details about this activity..."
            />
          </div>
          <Input
            label="Due Date (optional)"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Logging...' : 'Log Activity'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ActivitiesPage;
