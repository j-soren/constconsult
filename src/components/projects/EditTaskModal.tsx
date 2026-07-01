import { useEffect, useState, type FormEvent } from 'react';
import { FormField, inputClassName, selectClassName } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { useAppActions, useAppData } from '../../context/AppContext';
import type { Task, TaskStatus } from '../../types';

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
}

const taskStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed', 'overdue', 'blocked'];

function taskToForm(task: Task) {
  return {
    name: task.name,
    description: task.description,
    status: task.status,
    startDate: task.startDate,
    endDate: task.endDate,
    employeeId: task.employeeId,
    estimatedCost: String(task.estimatedCost),
    actualCost: String(task.actualCost),
  };
}

export function EditTaskModal({ open, onClose, task }: EditTaskModalProps) {
  const { employees } = useAppData();
  const { updateTask } = useAppActions();
  const [form, setForm] = useState(() => taskToForm(task));

  useEffect(() => {
    if (open) setForm(taskToForm(task));
  }, [open, task]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.startDate || !form.endDate) return;

    updateTask(task.id, {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      employeeId: form.employeeId,
      estimatedCost: Number(form.estimatedCost) || 0,
      actualCost: Number(form.actualCost) || 0,
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Task Name" htmlFor="edit-task-name">
          <input
            id="edit-task-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className={inputClassName}
          />
        </FormField>

        <FormField label="Description" htmlFor="edit-task-description">
          <textarea
            id="edit-task-description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className={inputClassName}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Status" htmlFor="edit-task-status">
            <select
              id="edit-task-status"
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

          <FormField label="Assigned To" htmlFor="edit-task-employee">
            <select
              id="edit-task-employee"
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
          <FormField label="Start Date" htmlFor="edit-task-start">
            <input
              id="edit-task-start"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>

          <FormField label="End Date" htmlFor="edit-task-end">
            <input
              id="edit-task-end"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Estimated Cost (₹)" htmlFor="edit-task-estimated">
            <input
              id="edit-task-estimated"
              type="number"
              min="0"
              step="100"
              value={form.estimatedCost}
              onChange={(e) => setForm((prev) => ({ ...prev, estimatedCost: e.target.value }))}
              className={inputClassName}
            />
          </FormField>

          <FormField label="Actual Cost (₹)" htmlFor="edit-task-actual">
            <input
              id="edit-task-actual"
              type="number"
              min="0"
              step="100"
              value={form.actualCost}
              onChange={(e) => setForm((prev) => ({ ...prev, actualCost: e.target.value }))}
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