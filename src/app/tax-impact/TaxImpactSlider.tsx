"use client";

import React from "react";
import * as RadixSlider from "@radix-ui/react-slider";

type TaxImpactSliderProps = {
    confirmedValue: number;
    setConfirmedValueAction: (val: number) => void;
};

const SLIDER_MIN = 100000;
const SLIDER_MAX = 10000000;

export default function TaxImpactSlider({
                                            confirmedValue,
                                            setConfirmedValueAction,
                                        }: TaxImpactSliderProps) {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            {/* Track */}
            <RadixSlider.Root
                className="relative flex items-center w-full h-6 touch-none select-none"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={1000}
                value={[confirmedValue]}
                onValueChange={([val]) => setConfirmedValueAction(val)}
                aria-label="Home Value"
            >
                <RadixSlider.Track className="bg-slate-300 relative grow rounded-full h-2">
                    <RadixSlider.Range className="absolute bg-slate-800 rounded-full h-full" />
                </RadixSlider.Track>
                <RadixSlider.Thumb
                    className="block w-5 h-5 bg-slate-800 rounded-full shadow transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </RadixSlider.Root>

            {/* Labels */}
            <div className="flex justify-between text-sm text-blue-950 px-1">
                <span>${SLIDER_MIN.toLocaleString()}</span>
                <span>${SLIDER_MAX.toLocaleString()}</span>
            </div>
        </div>
    );
}
