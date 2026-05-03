"use client";

import * as Slider from "@radix-ui/react-slider";

type TaxImpactSliderProps = {
  confirmedValue: number;
  onConfirmedValueChange: (val: number) => void;
};

const SLIDER_MIN = 100_000;
const SLIDER_MAX = 10_000_000;
const SLIDER_STEP = 1_000;

export default function TaxImpactSlider({
  confirmedValue,
  onConfirmedValueChange,
}: TaxImpactSliderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      <Slider.Root
        className="relative flex h-12 w-full touch-none select-none items-center"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={SLIDER_STEP}
        value={[confirmedValue]}
        onValueChange={(values) => onConfirmedValueChange(values[0])}
        aria-label="Home value"
      >
        <Slider.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-slate-300">
          <Slider.Range className="absolute h-full bg-slate-800" />
        </Slider.Track>
        <Slider.Thumb className="block h-7 w-7 rounded-full border-2 border-slate-800 bg-white shadow-md transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2" />
      </Slider.Root>
      <div className="flex justify-between text-sm text-blue-950 mt-1 px-1">
        <span>${SLIDER_MIN.toLocaleString()}</span>
        <span>${SLIDER_MAX.toLocaleString()}</span>
      </div>
    </div>
  );
}
