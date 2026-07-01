import { useEffect, useState, type FormEvent } from 'react';
import { useAppActions } from '../../context/AppContext';
import type { Task } from '../../types';
import { getEstimatedLabourCost, getLabourCost, getMaterialCost } from '../../utils/format';
import { FormField, inputClassName } from '../ui/FormField';
import { Modal } from '../ui/Modal';

interface TaskBudgetModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
}

function taskToBudgetForm(task: Task) {
  return {
    estimatedCost: String(task.estimatedCost),
    actualCost: String(task.actualCost),
    crewSize: String(task.labourRequirement.crewSize),
    estimatedHours: String(task.labourRequirement.estimatedHours),
    estimatedLabourCost: String(getEstimatedLabourCost(task)),
    actualLabourCost: String(getLabourCost(task)),
    allocatedBudget: String(task.financeRequirement.allocatedBudget),
    contingency: String(task.financeRequirement.contingency),
  };
}

export function TaskBudgetModal({ open, onClose, task }: TaskBudgetModalProps) {
  const { updateTask } = useAppActions();
  const [form, setForm] = useState(() => taskToBudgetForm(task));

  useEffect(() => {
    if (open) setForm(taskToBudgetForm(task));
  }, [open, task]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const estimatedLabourCost = Number(form.estimatedLabourCost) || 0;
    const actualLabourCost = Number(form.actualLabourCost) || 0;
    const materialCost = getMaterialCost(task.materials);

    updateTask(task.id, {
      estimatedCost: Number(form.estimatedCost) || 0,
      actualCost: Number(form.actualCost) || materialCost + actualLabourCost,
      labourRequirement: {
        crewSize: Number(form.crewSize) || 0,
        estimatedHours: Number(form.estimatedHours) || 0,
        estimatedLabourCost,
        actualLabourCost,
      },
      financeRequirement: {
        allocatedBudget: Number(form.allocatedBudget) || 0,
        contingency: Number(form.contingency) || 0,
      },
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Manage Budget — ${task.name}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Cost Summary</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Estimated Cost (₹)" htmlFor="budget-estimated">
              <input
                id="budget-estimated"
                type="number"
                min="0"
                step="100"
                value={form.estimatedCost}
                onChange={(e) => setForm((prev) => ({ ...prev, estimatedCost: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Actual Cost (₹)" htmlFor="budget-actual">
              <input
                id="budget-actual"
                type="number"
                min="0"
                step="100"
                value={form.actualCost}
                onChange={(e) => setForm((prev) => ({ ...prev, actualCost: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Labour</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Estimated Labour Cost (₹)" htmlFor="budget-est-labour">
              <input
                id="budget-est-labour"
                type="number"
                min="0"
                step="100"
                value={form.estimatedLabourCost}
                onChange={(e) => setForm((prev) => ({ ...prev, estimatedLabourCost: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Actual Labour Cost (₹)" htmlFor="budget-act-labour">
              <input
                id="budget-act-labour"
                type="number"
                min="0"
                step="100"
                value={form.actualLabourCost}
                onChange={(e) => setForm((prev) => ({ ...prev, actualLabourCost: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Crew Size" htmlFor="budget-crew">
              <input
                id="budget-crew"
                type="number"
                min="0"
                value={form.crewSize}
                onChange={(e) => setForm((prev) => ({ ...prev, crewSize: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Estimated Hours" htmlFor="budget-hours">
              <input
                id="budget-hours"
                type="number"
                min="0"
                value={form.estimatedHours}
                onChange={(e) => setForm((prev) => ({ ...prev, estimatedHours: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Finance Allocation</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Allocated Budget (₹)" htmlFor="budget-allocated">
              <input
                id="budget-allocated"
                type="number"
                min="0"
                step="100"
                value={form.allocatedBudget}
                onChange={(e) => setForm((prev) => ({ ...prev, allocatedBudget: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Contingency (₹)" htmlFor="budget-contingency">
              <input
                id="budget-contingency"
                type="number"
                min="0"
                step="100"
                value={form.contingency}
                onChange={(e) => setForm((prev) => ({ ...prev, contingency: e.target.value }))}
                className={inputClassName}
              />
            </FormField>
          </div>
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
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
}