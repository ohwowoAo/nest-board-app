'use client';
import React from 'react';

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
}
export function ToggleMyPosts({ checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 select-none">
      <span>내 글만</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-slate-800' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}
