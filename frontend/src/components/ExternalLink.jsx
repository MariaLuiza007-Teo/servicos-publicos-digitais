import { ExternalLink as ExternalIcon } from 'lucide-react';

/** Link para outro site: abre em nova aba e avisa leitores de tela. */
export function ExternalLink({ href, children, className = '', showIcon = true }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {showIcon && <ExternalIcon className="icon-inline" size={14} aria-hidden="true" />}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/** Mostra só o domínio de um endereço (ex.: www.gov.br). */
export function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
