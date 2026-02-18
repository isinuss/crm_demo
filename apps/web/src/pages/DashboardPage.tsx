import React from 'react';
import { useQuery } from '@apollo/client';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { GET_DASHBOARD_STATS } from '@/graphql/queries';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const activityTypeColors: Record<string, 'blue' | 'green' | 'yellow' | 'purple' | 'gray'> = {
  CALL: 'blue',
  EMAIL: 'green',
  MEETING: 'yellow',
  NOTE: 'gray',
  TASK: 'purple',
};

const DashboardPage: React.FC = () => {
  const { data, loading } = useQuery(GET_DASHBOARD_STATS);

  const stats = data?.dashboardStats;

  const kpiCards = [
    {
      title: 'Total Contacts',
      value: stats?.totalContacts ?? 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Total Companies',
      value: stats?.totalCompanies ?? 0,
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Open Deals Value',
      value: formatCurrency(stats?.openDealsValue ?? 0),
      icon: DollarSign,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Won Deals Value',
      value: formatCurrency(stats?.wonDealsValue ?? 0),
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="relative overflow-hidden">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <Card title="Recent Activity">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : stats?.recentActivities?.length > 0 ? (
          <div className="space-y-4">
            {stats.recentActivities.map(
              (activity: {
                id: string;
                type: string;
                subject: string;
                createdAt: string;
                user?: { firstName: string; lastName: string };
              }) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <Badge color={activityTypeColors[activity.type] || 'gray'}>
                    {activity.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.user &&
                        `${activity.user.firstName} ${activity.user.lastName}`}{' '}
                      &middot; {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            No recent activities
          </p>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
