import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AddTaskModal } from '../components/projects/AddTaskModal';
import { EditTaskModal } from '../components/projects/EditTaskModal';
import { TaskTable } from '../components/tasks/TaskTable';
import { Card, CardBody } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppData, useAppSelectors } from '../context/AppContext';
import type { TaskStatus } from '../types';
import { formatCurrency, getMaterialCost } from '../utils/format';

const statusFilters: Array<TaskStatus | 'all'> = [
  'all',
  'pending',
  'in-progress',
  'completed',
  'overdue',
  'blocked',
];

export function Tasks() {
  const { tasks, projects } = useAppData();
  const { getProject, getEmployee } = useAppSelectors();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const project = getProject(task.projectId);
      const employee = getEmployee(task.employeeId);
      const matchesSearch =
        search === '' ||
        task.name.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()) ||
        project?.name.toLowerCase().includes(search.toLowerCase()) ||
        employee?.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [tasks, search, statusFilter, projectFilter, getProject, getEmployee]);

  const stats = useMemo(() => {
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const overdue = tasks.filter((t) => t.status === 'overdue').length;
    const materialSpend = tasks.reduce((sum, t) => sum + getMaterialCost(t.materials), 0);
    return { total: tasks.length, inProgress, overdue, materialSpend };
  }, [tasks]);

  const editingTask = editingTaskId ? tasks.find((t) => t.id === editingTaskId) : undefined;

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage tasks, budgets, and material requirements across all projects
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddTask(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardBody>
            <p className="text-xs text-slate-500">Total Tasks</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-slate-500">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{stats.inProgress}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-slate-500">Overdue</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{stats.overdue}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-slate-500">Material Spend</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(stats.materialSpend)}</p>
          </CardBody>
        </Card>
      </div>

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative max-w-md flex-1">
          <label htmlFor="task-search" className="sr-only">
            Search tasks
          </label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="task-search"
            type="text"
            placeholder="Search by task, project, or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          aria-label="Filter by project"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {statusFilters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-brand-700 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <TaskTable
        tasks={filtered}
        onEditTask={setEditingTaskId}
        emptyState={
          <EmptyState
            icon={Search}
            title="No tasks found"
            description="Try adjusting your search or filters, or create a new task."
          />
        }
      />

      <AddTaskModal open={showAddTask} onClose={() => setShowAddTask(false)} />

      {editingTask && (
        <EditTaskModal
          open
          task={editingTask}
          onClose={() => setEditingTaskId(null)}
        />
      )}
    </div>
  );
}