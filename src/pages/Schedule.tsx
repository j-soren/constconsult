import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppData, useAppSelectors } from '../context/AppContext';
import { MEETING_HORIZON_DAYS, isWithinDays } from '../utils/dates';
import { formatDate, formatMonthYear } from '../utils/format';
import { isScheduleRelevantTask } from '../utils/schedule';

export function Schedule() {
  const { tasks, meetings } = useAppData();
  const { getProject, getEmployee } = useAppSelectors();

  const upcomingTasks = tasks
    .filter((t) => isScheduleRelevantTask(t))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const upcomingMeetings = meetings
    .filter((m) => isWithinDays(m.date, MEETING_HORIZON_DAYS))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const scheduleItems = [
    ...upcomingTasks.map((t) => ({
      id: t.id,
      type: 'task' as const,
      title: t.name,
      projectId: t.projectId,
      date: t.startDate,
      endDate: t.endDate,
      status: t.status,
      detail: getEmployee(t.employeeId)?.name ?? 'Unassigned',
    })),
    ...upcomingMeetings.map((m) => ({
      id: m.id,
      type: 'meeting' as const,
      title: m.title,
      projectId: m.projectId,
      date: m.date,
      endDate: m.date,
      status: 'scheduled' as const,
      detail: m.time + ' · ' + m.location,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const groupedByMonth = scheduleItems.reduce<Record<string, typeof scheduleItems>>((acc, item) => {
    const month = formatMonthYear(item.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tasks: in-progress, overdue, and upcoming · Meetings: next {MEETING_HORIZON_DAYS} days
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{upcomingTasks.length}</p>
              <p className="text-xs text-slate-500">Upcoming Tasks</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-50 p-2">
              <Calendar className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{upcomingMeetings.length}</p>
              <p className="text-xs text-slate-500">Upcoming Meetings</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2">
              <Calendar className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {tasks.filter((t) => t.status === 'overdue').length}
              </p>
              <p className="text-xs text-slate-500">Overdue Tasks</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {scheduleItems.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No upcoming schedule items"
          description="Tasks and meetings will appear here when scheduled."
        />
      ) : (
        Object.entries(groupedByMonth).map(([month, items]) => (
          <Card key={month} className="mb-6">
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">{month}</h2>
            </CardHeader>
            <CardBody className="space-y-0">
              {items.map((item, index) => {
                const project = getProject(item.projectId);
                const isLast = index === items.length - 1;
                return (
                  <div key={`${item.type}-${item.id}`} className="relative flex gap-4 pb-6">
                    {!isLast && (
                      <div className="absolute left-[15px] top-8 h-full w-0.5 bg-slate-200" />
                    )}
                    <div
                      className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        item.type === 'meeting' ? 'bg-accent-100 text-accent-600' : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <span className="text-xs font-bold">
                        {new Date(item.date + 'T00:00:00').getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">{item.title}</p>
                            <span
                              className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${
                                item.type === 'meeting'
                                  ? 'bg-accent-100 text-accent-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {item.type}
                            </span>
                            {item.type === 'task' && (
                              <Badge variant={item.status as 'pending' | 'in-progress' | 'overdue'}>
                                {item.status}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500">{project?.name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(item.date)}
                            {item.endDate !== item.date ? ` — ${formatDate(item.endDate)}` : ''}
                            {' · '}
                            {item.detail}
                          </p>
                        </div>
                        <Link
                          to={`/projects/${item.projectId}`}
                          className="shrink-0 text-slate-400 hover:text-brand-600"
                          aria-label={`View ${project?.name ?? 'project'}`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
}