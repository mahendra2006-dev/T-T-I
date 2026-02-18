
import React from 'react';

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        {description && <span className="text-xs text-zinc-500">{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`${
          checked ? 'bg-blue-600' : 'bg-zinc-700'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900`}
      >
        <span
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};
