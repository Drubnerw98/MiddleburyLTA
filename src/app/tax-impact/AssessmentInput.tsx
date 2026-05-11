'use client';

import { useEffect, useState } from 'react';
import TaxImpactSlider from './TaxImpactSlider';
import { ASSESSMENT_MIN, ASSESSMENT_MAX } from './constants';

type Props = {
  label: string;
  helper?: string;
  value: number | null;
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
  const [inputText, setInputText] = useState(value !== null ? value.toLocaleString() : '');

  // Keep the displayed input text in sync with external value changes
  // (slider moves, etc.). Skip while editing so we don't clobber typing.
  useEffect(() => {
    if (!isEditing) setInputText(value !== null ? value.toLocaleString() : '');
  }, [value, isEditing]);

  const commit = () => {
    const parsed = parseInt(inputText.replace(/[^\d]/g, ''), 10);
    if (!parsed || isNaN(parsed)) {
      // Invalid: revert to whatever value was set externally.
      setInputText(value !== null ? value.toLocaleString() : '');
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

  // Slider needs a number. When empty, anchor it at the minimum so it
  // doesn't render in an undefined state. The user has to commit a real
  // number before the slider can do anything useful.
  const sliderValue = value ?? ASSESSMENT_MIN;
  const hasValue = value !== null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline gap-3 flex-wrap">
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {label}
          </p>
          {helper && <p className="font-sans text-xs text-muted/80 mt-1">{helper}</p>}
        </div>
        <div className="flex items-baseline gap-3 min-h-[40px]">
          {!isEditing ? (
            <>
              <span
                className={`font-serif text-3xl sm:text-4xl font-semibold tabular-nums ${
                  hasValue ? 'text-ink' : 'text-rule-strong'
                }`}
              >
                {hasValue ? formatMoney(value) : '$ —'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setInputText(value !== null ? value.toLocaleString() : '');
                }}
                className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-oxblood hover:text-ink underline-offset-4 hover:underline transition-colors"
              >
                {hasValue ? 'Edit' : 'Enter'}
              </button>
            </>
          ) : (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-sans">$</span>
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
                placeholder="0"
                className="pl-7 w-44 font-sans text-xl font-semibold bg-bone border border-ink/40 px-3 py-2 focus:outline-none focus:border-ink text-right text-ink"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
      <div className={`px-1 ${hasValue ? '' : 'opacity-40'}`}>
        <TaxImpactSlider confirmedValue={sliderValue} onConfirmedValueChange={onChange} />
      </div>
    </div>
  );
}
