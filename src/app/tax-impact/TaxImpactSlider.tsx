"use client";

import React from "react";

type TaxImpactSliderProps = {
    confirmedValue: number;
    setConfirmedValue: (val: number) => void;
};

const SLIDER_MIN = 100000;
const SLIDER_MAX = 10000000;

export default function TaxImpactSlider({
                                            confirmedValue,
                                            setConfirmedValue,
                                        }: TaxImpactSliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmedValue(Number(e.target.value));
    };

    const percentage =
        ((confirmedValue - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-2">
            <div className="relative h-12 rounded-full bg-slate-300 overflow-hidden">
                <div
                    className="absolute h-full rounded-full left-0 top-0 bg-slate-800"
                    style={{ width: `${percentage}%` }}
                />
                <input
                    type="range"
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    step={1000}
                    value={confirmedValue}
                    onChange={handleChange}
                    className="w-full absolute left-0 top-0 h-full opacity-0 cursor-pointer"
                />
            </div>
            <div className="flex justify-between text-sm text-blue-950 mt-1 px-1">
                <span>${SLIDER_MIN.toLocaleString()}</span>
                <span>${SLIDER_MAX.toLocaleString()}</span>
            </div>
        </div>
    );
}
