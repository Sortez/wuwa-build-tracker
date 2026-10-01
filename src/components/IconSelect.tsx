import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface IconOption {
  id: string;
  label: string;
  meta?: ReactNode;
  icon: ReactNode;
}

interface Props {
  options: IconOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export default function IconSelect({
  options,
  value,
  onChange,
  placeholder = '— none —',
  ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = value
    ? options.find((option) => option.id === value) ?? null
    : null;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (id: string | null) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="icon-select" ref={rootRef}>
      <button
        type="button"
        className={open ? 'icon-select-trigger open' : 'icon-select-trigger'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
      >
        {selected?.icon ?? (
          <span className="item-icon item-icon-md item-icon-empty">
            <span className="item-icon-fallback" aria-hidden="true">
              ?
            </span>
          </span>
        )}
        <span className="icon-select-text">
          <span className="icon-select-name">
            {selected ? selected.label : placeholder}
          </span>
          {selected?.meta && (
            <span className="icon-select-meta">{selected.meta}</span>
          )}
        </span>
        <svg
          className="icon-select-caret"
          viewBox="0 0 16 16"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="icon-select-menu" role="listbox" aria-label={ariaLabel}>
          <button
            type="button"
            role="option"
            aria-selected={!selected}
            className={selected ? 'icon-option' : 'icon-option selected'}
            onClick={() => choose(null)}
          >
            <span className="icon-option-none">{placeholder}</span>
          </button>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={option.id === value}
              className={
                option.id === value ? 'icon-option selected' : 'icon-option'
              }
              onClick={() => choose(option.id)}
            >
              {option.icon}
              <span className="icon-option-name">{option.label}</span>
              {option.meta && (
                <span className="icon-option-meta">{option.meta}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
