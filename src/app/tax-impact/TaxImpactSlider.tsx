"use client";

import * as Slider from "@radix-ui/react-slider";

type TaxImpactSliderProps = {
  confirmedValue: number;
  onConfirmedValueChange: (val: number) => void;
};

const SLIDER_MIN = 100_000;
const SLIDER_MAX = 5_000_000;
const SLIDER_STEP = 1_000;

export default function TaxImpactSlider({
  confirmedValue,
  onConfirmedValueChange,
}: TaxImpactSliderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      <Slider.Root
        className="relative flex h-10 w-full touch-none select-none items-center"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={SLIDER_STEP}
        value={[confirmedValue]}
        onValueChange={(values) => onConfirmedValueChange(values[0])}
        aria-label="Assessment value"
      >
        <Slider.Track className="relative h-[3px] w-full grow overflow-hidden bg-rule-strong">
          <Slider.Range className="absolute h-full bg-ink" />
        </Slider.Track>
        <Slider.Thumb className="block h-5 w-5 rounded-full border border-ink bg-bone shadow-[0_1px_2px_rgba(11,23,38,0.2)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-paper" />
      </Slider.Root>
      <div className="flex justify-between font-sans text-xs text-muted px-0.5 tabular-nums">
        <span>${SLIDER_MIN.toLocaleString()}</span>
        <span>${SLIDER_MAX.toLocaleString()}</span>
      </div>
    </div>
  );
}
