import {
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  FolderKanban,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { useAppData, useAppSelectors } from '../context/AppContext';
import { MEETING_HORIZON_DAYS, isWithinDays } from '../utils/dates';
import { formatCurrency, formatDate } from '../utils/format';
import { isScheduleRelevantTask } from '../utils/schedule';

export function Dashboard() {
  const { projects, tasks, meetings, activities } = useAppData();
  const { getProject, getClient, getEmployee } = useAppSelectors();

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const upcomingMeetings = meetings.filter((m) => isWithinDays(m.date, MEETING_HORIZON_DAYS)).length;
  const overdueTasks = tasks.filter((t) => t.status === 'overdue').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.estimatedBudget, 0);
  const totalSpend = projects.reduce((sum, p) => sum + p.actualSpend, 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

  const upcomingTasks = tasks
    .filter((t) => isScheduleRelevantTask(t))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 6);

  const upcomingMeetingsList = meetings
    .filter((m) => isWithinDays(m.date, MEETING_HORIZON_DAYS))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your construction projects and schedule</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Active Projects"
          value={activeProjects}
          subtitle={`${projects.length} total projects`}
          icon={FolderKanban}
          iconColor="text-blue-500"
        />
        <KpiCard
          title="Upcoming Meetings"
          value={upcomingMeetings}
          subtitle="Next 30 days"
          icon={Calendar}
          iconColor="text-accent-500"
        />
        <KpiCard
          title="Overdue Tasks"
          value={overdueTasks}
          subtitle={overdueTasks > 0 ? 'Requires attention' : 'All on track'}
          icon={AlertTriangle}
          iconColor={overdueTasks > 0 ? 'text-red-500' : 'text-emerald-500'}
        />
        <KpiCard
          title="Budget Utilization"
          value={`${budgetUtilization}%`}
          subtitle={`${formatCurrency(totalSpend)} of ${formatCurrency(totalBudget)}`}
          icon={DollarSign}
          iconColor="text-brand-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Upcoming Schedule</h2>
              <Link to="/schedule" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {upcomingTasks.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">No upcoming tasks scheduled.</p>
            )}
            {upcomingTasks.map((task) => {
              const project = getProject(task.projectId);
              const employee = getEmployee(task.employeeId);
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-4 rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="mt-0.5 rounded-lg bg-slate-100 p-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{task.name}</p>
                      <Badge variant={task.status}>{task.status}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {project?.name} · {employee?.name ?? 'Unassigned'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(task.startDate)} — {formatDate(task.endDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-900">Upcoming Meetings</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {upcomingMeetingsList.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">No meetings in the next 30 days.</p>
            )}
            {upcomingMeetingsList.map((meeting) => {
              const project = getProject(meeting.projectId);
              return (
                <div key={meeting.id} className="rounded-lg border border-slate-100 p-3">
                  <p className="text-sm font-medium text-slate-900">{meeting.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{project?.name}</p>
                  <p className="mt-1 text-xs text-accent-600">
                    {formatDate(meeting.date)} at {meeting.time}
                  </p>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const project = getProject(activity.projectId);
              const client = project ? getClient(project.clientId) : undefined;
              return (
                <div key={activity.id} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">{activity.description}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {project?.name}
                      {client ? ` · ${client.name}` : ''} · {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}