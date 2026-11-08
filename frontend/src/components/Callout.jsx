import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

const ICONS = {
  info: Info,
  ok: CircleCheck,
  alerta: TriangleAlert,
  perigo: CircleAlert,
};

/** Caixa de destaque. variant: info | ok | alerta | perigo */
export function Callout({ variant = 'info', title, children, className = '' }) {
  const Icon = ICONS[variant] ?? ICONS.info;
  return (
    <div className={`callout callout--${variant} ${className}`}>
      <Icon className="callout__icon" size={22} aria-hidden="true" />
      <div className="callout__body">
        {title && <p className="callout__title">{title}</p>}
        {children}
      </div>
    </div>
  );
}
