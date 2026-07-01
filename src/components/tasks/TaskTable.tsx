import { ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { Fragment, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelectors } from '../../context/AppContext';
import type { Task } from '../../types';
import { formatCurrency, formatDate, getLabourCost, getMaterialCost } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { TaskManagePanel } from './TaskManagePanel';

interface TaskTableProps {
  tasks: Task[];
  showProjectColumn?: boolean;
  emptyState: ReactNode;
  onEditTask: (taskId: string) => void;
}

export function TaskTable({ tasks, showProjectColumn = true, emptyState, onEditTask }: TaskTableProps) {
  const { getProject, getEmployee } = useAppSelectors();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const columnCount = showProjectColumn ? 9 : 8;

  const toggleExpanded = (taskId: string) => {
    setExpandedTaskId((current) => (current === taskId ? null : taskId));
  };

  if (tasks.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
              <th className="w-10 px-4 py-4" aria-label="Expand" />
              <th className="px-4 py-4">Task</th>
              {showProjectColumn && <th className="px-4 py-4">Project</th>}
              <th className="px-4 py-4">Assignee</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Timeline</th>
              <th className="px-4 py-4">Budget</th>
              <th className="px-4 py-4">Materials</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const project = getProject(task.projectId);
              const employee = getEmployee(task.employeeId);
              const materialTotal = getMaterialCost(task.materials);
              const labourTotal = getLabourCost(task);
              const isExpanded = expandedTaskId === task.id;

              return (
                <Fragment key={task.id}>
                  <tr className="border-b border-slate-50">
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(task.id)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${task.name}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="min-w-[200px] px-4 py-4">
                      <p className="font-medium text-slate-900">{task.name}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{task.description}</p>
                    </td>
                    {showProjectColumn && (
                      <td className="px-4 py-4">
                        <Link
                          to={`/projects/${task.projectId}`}
                          className="font-medium text-brand-600 hover:text-brand-700"
                        >
                          {project?.name ?? 'Unknown'}
                        </Link>
                      </td>
                    )}
                    <td className="px-4 py-4 text-slate-600">{employee?.name ?? 'Unassigned'}</td>
                    <td className="px-4 py-4">
                      <Badge variant={task.status}>{task.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                      {formatDate(task.startDate)} — {formatDate(task.endDate)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-900">{formatCurrency(task.estimatedCost)}</p>
                      <p className={`text-xs ${task.actualCost > task.estimatedCost ? 'text-red-600' : 'text-slate-500'}`}>
                        {formatCurrency(task.actualCost)} actual
                      </p>
                      <p className="text-xs text-slate-400">{formatCurrency(labourTotal)} labour</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-900">{task.materials.length} items</p>
                      <p className="text-xs text-slate-500">{formatCurrency(materialTotal)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onEditTask(task.id)}
                        aria-label={`Edit ${task.name}`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-slate-50">
                      <td colSpan={columnCount} className="p-0">
                        <TaskManagePanel task={task} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}