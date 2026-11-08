// Ícones usados pelo conteúdo (temas.js e servicos.js referenciam pelo nome).
// Para usar um ícone novo: importe de 'lucide-react' e adicione aqui. Lista: https://lucide.dev/icons
import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  IdCard,
  Landmark,
  Newspaper,
  Scale,
  ShieldAlert,
  Smartphone,
  Wallet,
} from 'lucide-react';

export const ICONS = {
  Briefcase,
  GraduationCap,
  HeartPulse,
  IdCard,
  Landmark,
  Newspaper,
  Scale,
  ShieldAlert,
  Smartphone,
  Wallet,
};

export function Icon({ name, ...props }) {
  const Component = ICONS[name] ?? Landmark;
  return <Component aria-hidden="true" {...props} />;
}
