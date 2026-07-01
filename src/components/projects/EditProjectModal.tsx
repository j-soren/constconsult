import { useEffect, useState, type FormEvent } from 'react';
import { FormField, inputClassName, selectClassName } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { useAppActions, useAppData } from '../../context/AppContext';
import type { Project, ProjectStatus } from '../../types';

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

const projectTypes = ['Commercial', 'Residential', 'Infrastructure', 'Restoration'];
const projectStatuses: ProjectStatus[] = ['planning', 'active', 'on-hold', 'completed'];

function projectToForm(project: Project) {
  return {
    name: project.name,
    type: project.type,
    location: project.location,
    description: project.description,
    status: project.status,
    clientId: project.clientId,
    startDate: project.startDate,
    endDate: project.endDate,
    estimatedBudget: String(project.estimatedBudget),
    progress: String(project.progress),
  };
}

export function EditProjectModal({ open, onClose, project }: EditProjectModalProps) {
  const { clients } = useAppData();
  const { updateProject } = useAppActions();
  const [form, setForm] = useState(() => projectToForm(project));

  useEffect(() => {
    if (open) setForm(projectToForm(project));
  }, [open, project]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.clientId || !form.startDate || !form.endDate) return;

    updateProject(project.id, {
      name: form.name.trim(),
      type: form.type,
      location: form.location.trim(),
      description: form.description.trim(),
      status: form.status,
      clientId: form.clientId,
      startDate: form.startDate,
      endDate: form.endDate,
      estimatedBudget: Number(form.estimatedBudget) || 0,
      progress: Math.min(100, Math.max(0, Number(form.progress) || 0)),
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Project Name" htmlFor="edit-project-name">
          <input
            id="edit-project-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className={inputClassName}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Type" htmlFor="edit-project-type">
            <select
              id="edit-project-type"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className={selectClassName}
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Status" htmlFor="edit-project-status">
            <select
              id="edit-project-status"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
              className={selectClassName}
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Client" htmlFor="edit-project-client">
          <select
            id="edit-project-client"
            required
            value={form.clientId}
            onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
            className={selectClassName}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Location" htmlFor="edit-project-location">
          <input
            id="edit-project-location"
            type="text"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            className={inputClassName}
          />
        </FormField>

        <FormField label="Description" htmlFor="edit-project-description">
          <textarea
            id="edit-project-description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className={inputClassName}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Start Date" htmlFor="edit-project-start">
            <input
              id="edit-project-start"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>

          <FormField label="End Date" htmlFor="edit-project-end">
            <input
              id="edit-project-end"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Estimated Budget (₹)" htmlFor="edit-project-budget">
            <input
              id="edit-project-budget"
              type="number"
              min="0"
              step="1000"
              value={form.estimatedBudget}
              onChange={(e) => setForm((prev) => ({ ...prev, estimatedBudget: e.target.value }))}
              className={inputClassName}
            />
          </FormField>

          <FormField label="Progress (%)" htmlFor="edit-project-progress">
            <input
              id="edit-project-progress"
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={(e) => setForm((prev) => ({ ...prev, progress: e.target.value }))}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}