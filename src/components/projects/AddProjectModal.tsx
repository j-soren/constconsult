import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, inputClassName, selectClassName } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { useAppActions, useAppData } from '../../context/AppContext';
import type { ProjectStatus } from '../../types';

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const projectTypes = ['Commercial', 'Residential', 'Infrastructure', 'Restoration'];
const projectStatuses: ProjectStatus[] = ['planning', 'active', 'on-hold', 'completed'];

const emptyForm = {
  name: '',
  type: 'Commercial',
  location: '',
  description: '',
  status: 'planning' as ProjectStatus,
  clientId: '',
  startDate: '',
  endDate: '',
  estimatedBudget: '',
};

export function AddProjectModal({ open, onClose }: AddProjectModalProps) {
  const { clients } = useAppData();
  const { addProject } = useAppActions();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);

  const resetAndClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.clientId || !form.startDate || !form.endDate) return;

    const project = addProject({
      name: form.name.trim(),
      type: form.type,
      location: form.location.trim(),
      description: form.description.trim(),
      status: form.status,
      clientId: form.clientId,
      startDate: form.startDate,
      endDate: form.endDate,
      estimatedBudget: Number(form.estimatedBudget) || 0,
    });

    resetAndClose();
    navigate(`/projects/${project.id}`);
  };

  return (
    <Modal open={open} onClose={resetAndClose} title="New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Project Name" htmlFor="project-name">
          <input
            id="project-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className={inputClassName}
            placeholder="e.g. Riverside Office Complex"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Type" htmlFor="project-type">
            <select
              id="project-type"
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

          <FormField label="Status" htmlFor="project-status">
            <select
              id="project-status"
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

        <FormField label="Client" htmlFor="project-client">
          <select
            id="project-client"
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

        <FormField label="Location" htmlFor="project-location">
          <input
            id="project-location"
            type="text"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            className={inputClassName}
            placeholder="e.g. Portland, OR"
          />
        </FormField>

        <FormField label="Description" htmlFor="project-description">
          <textarea
            id="project-description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className={inputClassName}
            placeholder="Brief project overview..."
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Start Date" htmlFor="project-start">
            <input
              id="project-start"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>

          <FormField label="End Date" htmlFor="project-end">
            <input
              id="project-end"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>
        </div>

        <FormField label="Estimated Budget ($)" htmlFor="project-budget">
          <input
            id="project-budget"
            type="number"
            min="0"
            step="1000"
            value={form.estimatedBudget}
            onChange={(e) => setForm((prev) => ({ ...prev, estimatedBudget: e.target.value }))}
            className={inputClassName}
            placeholder="0"
          />
        </FormField>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800"
          >
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
}