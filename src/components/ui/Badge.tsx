import type { ReactNode } from 'react';
import type { DocumentStatus, InvoiceStatus, ProjectStatus, TaskStatus } from '../../types';

type BadgeVariant = ProjectStatus | TaskStatus | DocumentStatus | InvoiceStatus | 'default';

const variantStyles: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-700',
  active: 'bg-emerald-100 text-emerald-700',
  'in-progress': 'bg-emerald-100 text-emerald-700',
  'on-hold': 'bg-amber-100 text-amber-700',
  completed: 'bg-slate-100 text-slate-600',
  pending: 'bg-slate-100 text-slate-600',
  overdue: 'bg-red-100 text-red-700',
  blocked: 'bg-red-100 text-red-700',
  draft: 'bg-slate-100 text-slate-600',
  review: 'bg-blue-100 text-blue-700',
  approved: 'bg-emerald-100 text-emerald-700',
  signed: 'bg-brand-100 text-brand-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  default: 'bg-slate-100 text-slate-600',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const style = variantStyles[variant] ?? variantStyles.default;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style} ${className}`}
    >
      {children}
    </span>
  );
}