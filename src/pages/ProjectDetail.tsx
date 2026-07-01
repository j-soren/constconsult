import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  FileText,
  Mail,
  MapPin,
  Phone,
  Pencil,
  Plus,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AddTaskModal } from '../components/projects/AddTaskModal';
import { EditProjectModal } from '../components/projects/EditProjectModal';
import { EditTaskModal } from '../components/projects/EditTaskModal';
import { TaskTable } from '../components/tasks/TaskTable';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAppSelectors } from '../context/AppContext';
import type { CommunicationLog } from '../types';
import { formatCurrency, formatDate, getLabourCost, getMaterialCost } from '../utils/format';

type Tab = 'overview' | 'client' | 'documents' | 'budget' | 'tasks';

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'client', label: 'Client' },
  { id: 'documents', label: 'Documents' },
  { id: 'budget', label: 'Budget' },
  { id: 'tasks', label: 'Tasks' },
];

const docTypeLabels = { report: 'Project Report', contract: 'Contract', 'work-order': 'Work Order' };

const communicationIcons: Record<CommunicationLog['type'], LucideIcon> = {
  email: Mail,
  phone: Phone,
  meeting: Calendar,
  'site-visit': MapPin,
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    getProject,
    getClient,
    getProjectTasks,
    getProjectMeetings,
    getProjectDocuments,
    getProjectInvoices,
    getProjectCommunications,
  } = useAppSelectors();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, tabId: Tab) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveTab(tabs[nextIndex].id);
    }
  };

  const project = getProject(id ?? '');
  if (!project) {
    return (
      <div className="p-8">
        <EmptyState icon={FileText} title="Project not found" description="The requested project does not exist." />
        <div className="mt-4 text-center">
          <Link to="/projects" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const client = getClient(project.clientId);
  const projectTasks = getProjectTasks(project.id);
  const projectMeetings = getProjectMeetings(project.id);
  const projectDocuments = getProjectDocuments(project.id);
  const projectInvoices = getProjectInvoices(project.id);
  const projectCommunications = getProjectCommunications(project.id);

  const editingTask = editingTaskId ? projectTasks.find((t) => t.id === editingTaskId) : undefined;

  const materialCostTotal = projectTasks.reduce((sum, t) => sum + getMaterialCost(t.materials), 0);
  const labourCostTotal = projectTasks.reduce((sum, t) => sum + getLabourCost(t), 0);

  return (
    <div className="p-8">
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <Badge variant={project.status}>{project.status}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium">{project.type}</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {project.location}
            </span>
            <span>
              {formatDate(project.startDate)} — {formatDate(project.endDate)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => setShowEditProject(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit Project
          </button>
          <div className="text-right">
            <p className="text-sm text-slate-500">Budget</p>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(project.estimatedBudget)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-slate-200">
        <nav role="tablist" aria-label="Project sections" className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
      <div
        role="tabpanel"
        id="tabpanel-overview"
        aria-labelledby="tab-overview"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">Project Description</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>
              <div className="mt-6">
                <ProgressBar value={project.progress} showLabel />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">Quick Stats</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Tasks</p>
                <p className="text-lg font-semibold text-slate-900">{projectTasks.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Completed Tasks</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {projectTasks.filter((t) => t.status === 'completed').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Actual Spend</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(project.actualSpend)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Client</p>
                <p className="text-sm font-medium text-slate-900">{client?.name}</p>
              </div>
            </CardBody>
          </Card>
      </div>
      )}

      {activeTab === 'client' && (
      <div
        role="tabpanel"
        id="tabpanel-client"
        aria-labelledby="tab-client"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">Client Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {client && (
                <>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{client.name}</p>
                      <p className="text-xs text-slate-500">Contact: {client.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-600">{client.email}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-600">{client.address}</p>
                  </div>
                  {client.remark && (
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">Remark</p>
                      <p className="mt-1 text-sm text-slate-600">{client.remark}</p>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">Meeting Schedule</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {projectMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-4">
                  <Calendar className="mt-0.5 h-4 w-4 text-accent-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{meeting.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDate(meeting.date)} at {meeting.time} · {meeting.location}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{meeting.notes}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Attendees: {meeting.attendees.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
              {projectMeetings.length === 0 && (
                <p className="text-sm text-slate-500">No meetings scheduled.</p>
              )}
            </CardBody>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">Communication Log</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {projectCommunications.map((log) => {
                  const CommIcon = communicationIcons[log.type];
                  return (
                    <div key={log.id} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-0">
                      <div className="rounded bg-slate-100 p-1.5">
                        <CommIcon className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900">{log.subject}</p>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs capitalize text-slate-500">
                            {log.type}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-600">{log.summary}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {log.contactPerson} · {formatDate(log.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {projectCommunications.length === 0 && (
                  <p className="text-sm text-slate-500">No communication records yet.</p>
                )}
              </div>
            </CardBody>
          </Card>
      </div>
      )}

      {activeTab === 'documents' && (
      <div
        role="tabpanel"
        id="tabpanel-documents"
        aria-labelledby="tab-documents"
      >
          {projectDocuments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents"
              description="Project reports, contracts, and work orders will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projectDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardBody>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="rounded-lg bg-brand-50 p-2">
                        <FileText className="h-5 w-5 text-brand-600" />
                      </div>
                      <Badge variant={doc.status}>{doc.status}</Badge>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {docTypeLabels[doc.type]}
                    </p>
                    <h3 className="mt-1 font-medium text-slate-900">{doc.title}</h3>
                    <div className="mt-3 flex justify-between text-xs text-slate-500">
                      <span>v{doc.version}</span>
                      <span>Updated {formatDate(doc.lastUpdated)}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
      </div>
      )}

      {activeTab === 'budget' && (
      <div
        role="tabpanel"
        id="tabpanel-budget"
        aria-labelledby="tab-budget"
        className="space-y-6"
      >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardBody>
                <p className="text-xs text-slate-500">Estimated Budget</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(project.estimatedBudget)}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs text-slate-500">Actual Spend</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(project.actualSpend)}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs text-slate-500">Remaining</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {formatCurrency(project.estimatedBudget - project.actualSpend)}
                </p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">Cost Breakdown by Task</h2>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                      <th className="pb-3 pr-4">Task</th>
                      <th className="pb-3 pr-4">Material Cost</th>
                      <th className="pb-3 pr-4">Labour Cost</th>
                      <th className="pb-3 pr-4">Estimated</th>
                      <th className="pb-3">Actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectTasks.map((task) => {
                      const matCost = getMaterialCost(task.materials);
                      const labCost = getLabourCost(task);
                      return (
                        <tr key={task.id} className="border-b border-slate-50">
                          <td className="py-3 pr-4 font-medium text-slate-900">{task.name}</td>
                          <td className="py-3 pr-4 text-slate-600">{formatCurrency(matCost)}</td>
                          <td className="py-3 pr-4 text-slate-600">{formatCurrency(labCost)}</td>
                          <td className="py-3 pr-4 text-slate-600">{formatCurrency(task.estimatedCost)}</td>
                          <td className={`py-3 ${task.actualCost > task.estimatedCost ? 'text-red-600' : 'text-slate-900'}`}>
                            {formatCurrency(task.actualCost)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="font-medium">
                      <td className="pt-3 text-slate-900">Total</td>
                      <td className="pt-3 text-slate-900">{formatCurrency(materialCostTotal)}</td>
                      <td className="pt-3 text-slate-900">{formatCurrency(labourCostTotal)}</td>
                      <td className="pt-3 text-slate-900">
                        {formatCurrency(projectTasks.reduce((s, t) => s + t.estimatedCost, 0))}
                      </td>
                      <td className="pt-3 text-slate-900">
                        {formatCurrency(projectTasks.reduce((s, t) => s + t.actualCost, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-slate-900">Invoices</h2>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                      <th className="pb-3 pr-4">Invoice #</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Due Date</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Description</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-slate-50">
                        <td className="py-3 pr-4 font-medium text-slate-900">{inv.number}</td>
                        <td className="py-3 pr-4 text-slate-600">{formatDate(inv.date)}</td>
                        <td className="py-3 pr-4 text-slate-600">{formatDate(inv.dueDate)}</td>
                        <td className="py-3 pr-4 text-slate-900">{formatCurrency(inv.amount)}</td>
                        <td className="py-3 pr-4 text-slate-600">{inv.description}</td>
                        <td className="py-3">
                          <Badge variant={inv.status}>{inv.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {projectInvoices.length === 0 && (
                  <p className="py-4 text-sm text-slate-500">No invoices yet.</p>
                )}
              </div>
            </CardBody>
          </Card>
      </div>
      )}

      {activeTab === 'tasks' && (
      <div
        role="tabpanel"
        id="tabpanel-tasks"
        aria-labelledby="tab-tasks"
        className="space-y-4"
      >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>

          <TaskTable
            tasks={projectTasks}
            showProjectColumn={false}
            onEditTask={setEditingTaskId}
            emptyState={
              <EmptyState
                icon={CheckSquare}
                title="No tasks yet"
                description="Add tasks to track work, assignments, and costs for this project."
              />
            }
          />
      </div>
      )}

      <AddTaskModal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        projectId={project.id}
      />

      {editingTask && (
        <EditTaskModal
          open
          task={editingTask}
          onClose={() => setEditingTaskId(null)}
        />
      )}

      <EditProjectModal
        open={showEditProject}
        onClose={() => setShowEditProject(false)}
        project={project}
      />
    </div>
  );
}