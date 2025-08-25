'use client';

import { useCallback } from 'react';

type Props = {
  checked: boolean; // true = "내 글"
  onChange: (next: boolean) => void;
};

export default function ToggleSwitch({ checked, onChange }: Props) {
  const toggle = useCallback(() => onChange(!checked), [checked, onChange]);

  return (
    <label className="inline-flex items-center gap-3 select-none">
      <span className={`text-sm ${checked ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
        전체
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors 
          ${checked ? 'bg-sky-500' : 'bg-gray-300'}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`}
      >
        <span
          className={`pointer-events-none absolute left-0.5 top-0.5 h-6 w-6 transform rounded-full bg-white shadow transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>

      <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
        내 글
      </span>
    </label>
  );
}
