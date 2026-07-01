import type { LucideIcon } from 'lucide-react';
import { Card, CardBody } from './Card';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: string; positive: boolean };
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor = 'text-accent-500', trend }: KpiCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
            {trend && (
              <p className={`mt-1 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className={`rounded-lg bg-slate-50 p-3 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}