import { Building2, Mail, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { useAppData } from '../context/AppContext';
import { formatCurrency } from '../utils/format';

export function Clients() {
  const { clients, projects } = useAppData();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="mt-1 text-sm text-slate-500">Client directory and project associations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {clients.map((client) => {
          const clientProjects = projects.filter((p) => p.clientId === client.id);
          const totalValue = clientProjects.reduce((sum, p) => sum + p.estimatedBudget, 0);
          const activeCount = clientProjects.filter((p) => p.status === 'active').length;

          return (
            <Card key={client.id}>
              <CardBody>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700">
                      {client.name
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{client.name}</h3>
                      <p className="flex items-center gap-1 text-sm text-slate-500">
                        <User className="h-3 w-3" />
                        {client.contact}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {clientProjects.length} project{clientProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="mb-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {client.email}
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    {client.address}
                  </div>
                </div>

                {client.remark && (
                  <p className="mb-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{client.remark}</p>
                )}

                <div className="mb-4 flex gap-4 text-xs">
                  <div>
                    <p className="text-slate-400">Active Projects</p>
                    <p className="font-semibold text-slate-900">{activeCount}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Total Value</p>
                    <p className="font-semibold text-slate-900">{formatCurrency(totalValue)}</p>
                  </div>
                </div>

                {clientProjects.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <p className="mb-2 text-xs font-medium uppercase text-slate-400">Projects</p>
                    <div className="space-y-2">
                      {clientProjects.map((project) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{project.name}</span>
                          </div>
                          <Badge variant={project.status}>{project.status}</Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}