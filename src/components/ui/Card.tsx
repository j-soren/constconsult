import type { KeyboardEvent, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>, onClick: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
}

export function Card({ children, className = '', onClick }: CardProps) {
  const interactive = Boolean(onClick);

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${interactive ? 'cursor-pointer transition-shadow hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive && onClick ? (e) => handleCardKeyDown(e, onClick) : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border-b border-slate-100 px-6 py-4 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}