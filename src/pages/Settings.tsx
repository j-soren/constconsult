import { Bell, Building2, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { useAppData } from '../context/AppContext';

const initialNotifications = [
  { id: 'task-deadlines', label: 'Task deadline reminders', enabled: true },
  { id: 'overdue-tasks', label: 'Overdue task alerts', enabled: true },
  { id: 'meeting-reminders', label: 'Meeting reminders', enabled: true },
  { id: 'invoice-payments', label: 'Invoice payment notifications', enabled: false },
  { id: 'client-updates', label: 'Client communication updates', enabled: true },
];

export function Settings() {
  const { employees } = useAppData();
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Profile</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label htmlFor="settings-name" className="text-xs font-medium text-slate-500">
                Name
              </label>
              <input
                id="settings-name"
                type="text"
                defaultValue="Michael Torres"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="settings-email" className="text-xs font-medium text-slate-500">
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                defaultValue="m.torres@constconsult.com"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="settings-role" className="text-xs font-medium text-slate-500">
                Role
              </label>
              <input
                id="settings-role"
                type="text"
                defaultValue="Administrator"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                readOnly
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Company</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label htmlFor="settings-company" className="text-xs font-medium text-slate-500">
                Company Name
              </label>
              <input
                id="settings-company"
                type="text"
                defaultValue="ConstConsult"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="settings-industry" className="text-xs font-medium text-slate-500">
                Industry
              </label>
              <input
                id="settings-industry"
                type="text"
                defaultValue="Construction Consultancy & Project Management"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                readOnly
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <label htmlFor={`notification-${item.id}`} className="text-sm text-slate-700">
                  {item.label}
                </label>
                <button
                  id={`notification-${item.id}`}
                  type="button"
                  role="switch"
                  aria-checked={item.enabled}
                  onClick={() => toggleNotification(item.id)}
                  className={`relative h-5 w-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
                    item.enabled ? 'bg-accent-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      item.enabled ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Team Members</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {employees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                      {emp.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{emp.email}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}