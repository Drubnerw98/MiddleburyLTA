"use client";

import * as Slider from "@radix-ui/react-slider";

import {
  ASSESSMENT_MAX,
  ASSESSMENT_MIN,
  ASSESSMENT_STEP,
} from "./constants";

type TaxImpactSliderProps = {
  confirmedValue: number;
  onConfirmedValueChange: (val: number) => void;
};

export default function TaxImpactSlider({
  confirmedValue,
  onConfirmedValueChange,
}: TaxImpactSliderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      <Slider.Root
        className="relative flex h-10 w-full touch-none select-none items-center"
        min={ASSESSMENT_MIN}
        max={ASSESSMENT_MAX}
        step={ASSESSMENT_STEP}
        value={[confirmedValue]}
        onValueChange={(values) => onConfirmedValueChange(values[0])}
        aria-label="Assessment value"
      >
        <Slider.Track className="relative h-[3px] w-full grow overflow-hidden bg-rule-strong">
          <Slider.Range className="absolute h-full bg-ink" />
        </Slider.Track>
        <Slider.Thumb className="block h-7 w-7 sm:h-5 sm:w-5 rounded-full border border-ink bg-bone shadow-[0_1px_2px_rgba(11,23,38,0.2)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-paper" />
      </Slider.Root>
      <div className="flex justify-between font-sans text-xs text-muted px-0.5 tabular-nums">
        <span>${ASSESSMENT_MIN.toLocaleString()}</span>
        <span>${ASSESSMENT_MAX.toLocaleString()}</span>
      </div>
    </div>
  );
}
