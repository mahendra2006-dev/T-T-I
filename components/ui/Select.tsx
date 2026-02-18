
import React from 'react';

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}

export const Select = <T extends string,>({ label, value, options, onChange }: SelectProps<T>) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all hover:border-zinc-700"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
