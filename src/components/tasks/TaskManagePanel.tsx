import { DollarSign, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAppActions } from '../../context/AppContext';
import type { Material, Task } from '../../types';
import { formatCurrency, getEstimatedLabourCost, getLabourCost, getMaterialCost } from '../../utils/format';
import { MaterialModal } from './MaterialModal';
import { TaskBudgetModal } from './TaskBudgetModal';

interface TaskManagePanelProps {
  task: Task;
}

export function TaskManagePanel({ task }: TaskManagePanelProps) {
  const { removeMaterial } = useAppActions();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();

  const materialTotal = getMaterialCost(task.materials);
  const estimatedLabourCost = getEstimatedLabourCost(task);
  const labourCost = getLabourCost(task);
  const budgetUsed =
    task.financeRequirement.allocatedBudget > 0
      ? Math.round((task.actualCost / task.financeRequirement.allocatedBudget) * 100)
      : 0;

  const openAddMaterial = () => {
    setEditingMaterial(undefined);
    setShowMaterialModal(true);
  };

  const openEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setShowMaterialModal(true);
  };

  const closeMaterialModal = () => {
    setShowMaterialModal(false);
    setEditingMaterial(undefined);
  };

  return (
    <div className="space-y-4 border-t border-slate-100 bg-slate-50/50 px-6 py-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-brand-600" />
              <h3 className="text-sm font-semibold text-slate-900">Budget</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowBudgetModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Budget
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">Estimated</p>
              <p className="font-semibold text-slate-900">{formatCurrency(task.estimatedCost)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Actual</p>
              <p className={`font-semibold ${task.actualCost > task.estimatedCost ? 'text-red-600' : 'text-slate-900'}`}>
                {formatCurrency(task.actualCost)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Allocated</p>
              <p className="font-semibold text-slate-900">{formatCurrency(task.financeRequirement.allocatedBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Contingency</p>
              <p className="font-semibold text-slate-900">{formatCurrency(task.financeRequirement.contingency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Est. Material</p>
              <p className="font-semibold text-slate-900">{formatCurrency(materialTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Est. Labour</p>
              <p className="font-semibold text-slate-900">{formatCurrency(estimatedLabourCost)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Actual Labour</p>
              <p className="font-semibold text-slate-900">{formatCurrency(labourCost)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Crew / Hours</p>
              <p className="font-semibold text-slate-900">
                {task.labourRequirement.crewSize} crew · {task.labourRequirement.estimatedHours.toLocaleString()} hrs
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Budget Used</p>
              <p className={`font-semibold ${budgetUsed > 90 ? 'text-red-600' : 'text-slate-900'}`}>
                {budgetUsed}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-brand-600" />
              <h3 className="text-sm font-semibold text-slate-900">Materials</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {task.materials.length}
              </span>
            </div>
            <button
              type="button"
              onClick={openAddMaterial}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Material
            </button>
          </div>

          {task.materials.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No materials added yet. Add materials to track costs.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                    <th className="pb-2 pr-3">Material</th>
                    <th className="pb-2 pr-3">Qty</th>
                    <th className="pb-2 pr-3">Unit Cost</th>
                    <th className="pb-2 pr-3">Total</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {task.materials.map((material) => (
                    <tr key={material.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5 pr-3 font-medium text-slate-900">{material.name}</td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {material.quantity} {material.unit}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">{formatCurrency(material.unitCost)}</td>
                      <td className="py-2.5 pr-3 font-medium text-slate-900">
                        {formatCurrency(material.quantity * material.unitCost)}
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditMaterial(material)}
                            aria-label={`Edit ${material.name}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMaterial(task.id, material.id)}
                            aria-label={`Remove ${material.name}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-3 text-xs font-medium uppercase text-slate-500">
                      Total Material Cost
                    </td>
                    <td className="pt-3 font-semibold text-slate-900" colSpan={2}>
                      {formatCurrency(materialTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      <TaskBudgetModal
        open={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        task={task}
      />

      <MaterialModal
        open={showMaterialModal}
        onClose={closeMaterialModal}
        taskId={task.id}
        taskName={task.name}
        material={editingMaterial}
      />
    </div>
  );
}