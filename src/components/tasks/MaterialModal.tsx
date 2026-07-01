import { useEffect, useState, type FormEvent } from 'react';
import { useAppActions } from '../../context/AppContext';
import type { Material } from '../../types';
import { formatCurrency } from '../../utils/format';
import { FormField, inputClassName } from '../ui/FormField';
import { Modal } from '../ui/Modal';

interface MaterialModalProps {
  open: boolean;
  onClose: () => void;
  taskId: string;
  taskName: string;
  material?: Material;
}

const emptyForm = {
  name: '',
  quantity: '',
  unit: '',
  unitCost: '',
};

function materialToForm(material: Material) {
  return {
    name: material.name,
    quantity: String(material.quantity),
    unit: material.unit,
    unitCost: String(material.unitCost),
  };
}

export function MaterialModal({ open, onClose, taskId, taskName, material }: MaterialModalProps) {
  const { addMaterial, updateMaterial } = useAppActions();
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(material);

  useEffect(() => {
    if (open) {
      setForm(material ? materialToForm(material) : emptyForm);
    }
  }, [open, material]);

  const lineTotal =
    (Number(form.quantity) || 0) * (Number(form.unitCost) || 0);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.unit.trim()) return;

    const payload = {
      name: form.name.trim(),
      quantity: Number(form.quantity) || 0,
      unit: form.unit.trim(),
      unitCost: Number(form.unitCost) || 0,
    };

    if (isEditing && material) {
      updateMaterial(taskId, material.id, payload);
    } else {
      addMaterial(taskId, payload);
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Material — ${taskName}` : `Add Material — ${taskName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Material Name" htmlFor="material-name">
          <input
            id="material-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className={inputClassName}
            placeholder="e.g. Concrete (Grade 40)"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Quantity" htmlFor="material-quantity">
            <input
              id="material-quantity"
              type="number"
              min="0"
              step="any"
              required
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              className={inputClassName}
            />
          </FormField>

          <FormField label="Unit" htmlFor="material-unit">
            <input
              id="material-unit"
              type="text"
              required
              value={form.unit}
              onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
              className={inputClassName}
              placeholder="e.g. tons, sq ft"
            />
          </FormField>

          <FormField label="Unit Cost (₹)" htmlFor="material-unit-cost">
            <input
              id="material-unit-cost"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.unitCost}
              onChange={(e) => setForm((prev) => ({ ...prev, unitCost: e.target.value }))}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-500">Line total: </span>
          <span className="font-semibold text-slate-900">{formatCurrency(lineTotal, true)}</span>
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
            {isEditing ? 'Save Changes' : 'Add Material'}
          </button>
        </div>
      </form>
    </Modal>
  );
}