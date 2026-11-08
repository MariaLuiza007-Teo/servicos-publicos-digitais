import { useEffect, useState } from 'react';

const SIZES = [
  { id: 'normal', label: 'A', name: 'Letra normal' },
  { id: 'grande', label: 'A+', name: 'Letra grande' },
  { id: 'maior', label: 'A++', name: 'Letra maior' },
];
const STORAGE_KEY = 'guia-tamanho-letra';

function readSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SIZES.some((size) => size.id === saved) ? saved : 'normal';
  } catch {
    return 'normal';
  }
}

/** Botões para aumentar a letra do site inteiro (acessibilidade). */
export function FontSizeControl() {
  const [size, setSize] = useState(readSaved);

  useEffect(() => {
    document.documentElement.dataset.fonte = size;
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch {
      // navegador sem armazenamento: o tamanho só vale nesta visita
    }
  }, [size]);

  return (
    <div className="font-size" role="group" aria-label="Tamanho da letra">
      {SIZES.map((option) => (
        <button
          key={option.id}
          type="button"
          className="font-size__button"
          aria-pressed={size === option.id}
          aria-label={option.name}
          title={option.name}
          onClick={() => setSize(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
