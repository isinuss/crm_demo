import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { ArrowLeft, Edit2, Save, X, Mail, Phone, Building2, Briefcase } from 'lucide-react';
import { GET_CONTACT, UPDATE_CONTACT } from '@/graphql/queries';
import { LifecycleStage } from '@shared/index';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

const stageColors: Record<string, 'blue' | 'yellow' | 'green' | 'red'> = {
  LEAD: 'blue',
  QUALIFIED: 'yellow',
  CUSTOMER: 'green',
  CHURNED: 'red',
};

const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const { data, loading, refetch } = useQuery(GET_CONTACT, {
    variables: { id },
    skip: !id,
  });

  const [updateContact, { loading: updating }] = useMutation(UPDATE_CONTACT, {
    onCompleted: () => {
      setEditing(false);
      refetch();
    },
  });

  const contact = (data as any)?.contact;

  const startEditing = () => {
    if (!contact) return;
    setEditForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || '',
      position: contact.position || '',
      lifecycleStage: contact.lifecycleStage,
      notes: contact.notes || '',
    });
    setEditing(true);
  };

  const handleSave = () => {
    if (!id) return;
    updateContact({
      variables: {
        id,
        input: editForm,
      },
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-64" />
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Contact not found</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/contacts')}>
          Back to Contacts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/contacts')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={stageColors[contact.lifecycleStage] || 'gray'}>
                {contact.lifecycleStage}
              </Badge>
              {contact.position && (
                <span className="text-sm text-gray-500">{contact.position}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="secondary" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updating}>
                <Save className="h-4 w-4 mr-1" />
                {updating ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={startEditing}>
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Contact Information">
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={editForm.firstName || ''}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={editForm.lastName || ''}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
                <Input
                  label="Position"
                  value={editForm.position || ''}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lifecycle Stage
                  </label>
                  <select
                    value={editForm.lifecycleStage || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lifecycleStage: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {Object.values(LifecycleStage).map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.company.name}</span>
                  </div>
                )}
                {contact.position && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{contact.position}</span>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card title="Notes">
            {editing ? (
              <textarea
                value={editForm.notes || ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[120px] resize-y"
                placeholder="Add notes about this contact..."
              />
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {contact.notes || 'No notes yet.'}
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card title="Details">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
                <p className="text-sm text-gray-900 mt-0.5">
                  {formatDate(contact.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Last Updated</p>
                <p className="text-sm text-gray-900 mt-0.5">
                  {formatDate(contact.updatedAt)}
                </p>
              </div>
              {contact.tags?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag: string) => (
                      <Badge key={tag} color="blue">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;
