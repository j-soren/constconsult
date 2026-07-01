export const LOCALE = 'en-IN';
export const CURRENCY = 'INR';

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyFormatterPrecise = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number, precise = false): string {
  const formatter = precise ? currencyFormatterPrecise : currencyFormatter;
  return formatter.format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMonthYear(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(LOCALE, {
    month: 'long',
    year: 'numeric',
  });
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getMaterialCost(materials: { quantity: number; unitCost: number }[]): number {
  return materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0);
}

export function getEstimatedLabourCost(task: {
  estimatedCost: number;
  materials: { quantity: number; unitCost: number }[];
  labourRequirement: { estimatedLabourCost?: number };
}): number {
  if (task.labourRequirement.estimatedLabourCost !== undefined) {
    return task.labourRequirement.estimatedLabourCost;
  }
  return Math.max(0, task.estimatedCost - getMaterialCost(task.materials));
}

export function getLabourCost(task: {
  actualCost: number;
  materials: { quantity: number; unitCost: number }[];
  labourRequirement: { actualLabourCost?: number };
}): number {
  if (task.labourRequirement.actualLabourCost !== undefined) {
    return task.labourRequirement.actualLabourCost;
  }
  return Math.max(0, task.actualCost - getMaterialCost(task.materials));
}