import React from 'react';

interface SegmentedControlProps {
  value: boolean;
  onChange: (val: boolean) => void;
  labels?: [string, string];
  disabled?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  onChange,
  labels = ['Pending', 'Completed'],
  disabled = false,
}) => {
  return (
    <div className="inline-flex p-1 bg-gray-100/80 rounded-xl border border-gray-200/60 select-none shrink-0 max-w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
          !value
            ? 'bg-white text-gray-700 shadow-sm border border-gray-200/80 font-semibold'
            : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
          value
            ? 'bg-emerald-600 text-white shadow-sm font-semibold'
            : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        {labels[1]}
      </button>
    </div>
  );
};
