'use client';

import { useEffect, useState } from 'react';
import TaxImpactSlider from './TaxImpactSlider';
import { ASSESSMENT_MIN, ASSESSMENT_MAX } from './constants';

type Props = {
  label: string;
  helper?: string;
  value: number;
  onChange: (value: number) => void;
};

const formatMoney = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

export default function AssessmentInput({ label, helper, value, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(value.toLocaleString());

  // Keep the displayed input text in sync with external value changes
  // (e.g. the slider above moving, or town-average derivation flipping on).
  useEffect(() => {
    if (!isEditing) setInputText(value.toLocaleString());
  }, [value, isEditing]);

  const commit = () => {
    const parsed = parseInt(inputText.replace(/[^\d]/g, ''), 10);
    if (!parsed || isNaN(parsed)) {
      setInputText(value.toLocaleString());
    } else {
      const clean = Math.max(ASSESSMENT_MIN, Math.min(parsed, ASSESSMENT_MAX));
      onChange(clean);
      setInputText(clean.toLocaleString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          {helper && <p className="text-xs text-slate-400 mt-0.5">{helper}</p>}
        </div>
        <div className="flex items-center gap-2 min-h-[44px]">
          {!isEditing ? (
            <>
              <span className="text-2xl sm:text-3xl font-bold tabular-nums text-slate-900">
                {formatMoney(value)}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setInputText(value.toLocaleString());
                }}
                className="text-sm bg-sky-600 text-white px-3 py-1.5 rounded-md hover:bg-sky-700 transition shadow-sm"
              >
                Edit
              </button>
            </>
          ) : (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={inputText}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/[^\d]/g, '');
                  if (digitsOnly.length <= 8) setInputText(digitsOnly);
                }}
                onKeyDown={handleKeyDown}
                onBlur={commit}
                className="pl-7 w-40 text-xl font-semibold bg-white border-2 border-sky-300 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 text-center text-slate-900"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
      <div className="px-2 sm:px-6">
        <TaxImpactSlider confirmedValue={value} onConfirmedValueChange={onChange} />
      </div>
    </div>
  );
}
