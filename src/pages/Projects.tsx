import { MapPin, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddProjectModal } from '../components/projects/AddProjectModal';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAppData, useAppSelectors } from '../context/AppContext';
import type { ProjectStatus } from '../types';
import { formatCurrency } from '../utils/format';

const statusFilters: Array<ProjectStatus | 'all'> = ['all', 'planning', 'active', 'on-hold', 'completed'];

export function Projects() {
  const { projects } = useAppData();
  const { getClient } = useAppSelectors();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [showAddProject, setShowAddProject] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track all construction projects</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddProject(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="project-search"
            type="text"
            placeholder="Search projects by name, location, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search projects by name, location, or type"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => {
          const client = getClient(project.clientId);
          const budgetUsed = Math.round((project.actualSpend / project.estimatedBudget) * 100);
          return (
            <Link key={project.id} to={`/projects/${project.id}`} className="block">
              <Card className="h-full">
                <CardBody>
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="mt-0.5 text-sm text-slate-500">{client?.name}</p>
                    </div>
                    <Badge variant={project.status}>{project.status}</Badge>
                  </div>

                  <div className="mb-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">{project.type}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </span>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm text-slate-600">{project.description}</p>

                  <ProgressBar value={project.progress} showLabel />

                  <div className="mt-3 flex justify-between text-xs text-slate-500">
                    <span>Budget: {formatCurrency(project.estimatedBudget)}</span>
                    <span className={budgetUsed > 90 ? 'text-red-600' : ''}>{budgetUsed}% used</span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-500">No projects match your search criteria.</div>
      )}

      <AddProjectModal open={showAddProject} onClose={() => setShowAddProject(false)} />
    </div>
  );
}