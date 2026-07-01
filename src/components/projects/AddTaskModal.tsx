import { useState, type FormEvent } from 'react';
import { FormField, inputClassName, selectClassName } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { useAppActions, useAppData } from '../../context/AppContext';
import type { TaskStatus } from '../../types';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
}

const taskStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed', 'overdue', 'blocked'];

const emptyForm = {
  projectId: '',
  name: '',
  description: '',
  status: 'pending' as TaskStatus,
  startDate: '',
  endDate: '',
  employeeId: '',
  estimatedCost: '',
};

export function AddTaskModal({ open, onClose, projectId }: AddTaskModalProps) {
  const { employees, projects } = useAppData();
  const { addTask } = useAppActions();
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    projectId: projectId ?? '',
  }));

  const resetAndClose = () => {
    setForm({ ...emptyForm, projectId: projectId ?? '' });
    onClose();
  };

  const resolvedProjectId = projectId ?? form.projectId;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !resolvedProjectId || !form.startDate || !form.endDate) return;

    addTask({
      projectId: resolvedProjectId,
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      employeeId: form.employeeId,
      estimatedCost: Number(form.estimatedCost) || 0,
    });

    resetAndClose();
  };

  return (
    <Modal open={open} onClose={resetAndClose} title="New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!projectId && (
          <FormField label="Project" htmlFor="task-project">
            <select
              id="task-project"
              required
              value={form.projectId}
              onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
              className={selectClassName}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </FormField>
        )}

        <FormField label="Task Name" htmlFor="task-name">
          <input
            id="task-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className={inputClassName}
            placeholder="e.g. Foundation & Excavation"
          />
        </FormField>

        <FormField label="Description" htmlFor="task-description">
          <textarea
            id="task-description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className={inputClassName}
            placeholder="What needs to be done..."
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Status" htmlFor="task-status">
            <select
              id="task-status"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
              className={selectClassName}
            >
              {taskStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Assigned To" htmlFor="task-employee">
            <select
              id="task-employee"
              value={form.employeeId}
              onChange={(e) => setForm((prev) => ({ ...prev, employeeId: e.target.value }))}
              className={selectClassName}
            >
              <option value="">Unassigned</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} — {employee.role}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Start Date" htmlFor="task-start">
            <input
              id="task-start"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>

          <FormField label="End Date" htmlFor="task-end">
            <input
              id="task-end"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>
        </div>

        <FormField label="Estimated Cost (₹)" htmlFor="task-cost">
          <input
            id="task-cost"
            type="number"
            min="0"
            step="100"
            value={form.estimatedCost}
            onChange={(e) => setForm((prev) => ({ ...prev, estimatedCost: e.target.value }))}
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
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}