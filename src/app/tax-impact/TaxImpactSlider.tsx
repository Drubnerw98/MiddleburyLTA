// src/app/components/TaxImpactSlider.tsx
"use client";

import React, { useRef, useEffect, useCallback } from "react";

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
    const barRef = useRef<HTMLDivElement>(null);

    const percentage =
        ((confirmedValue - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

    const handleInteraction = useCallback(
        (e: MouseEvent | TouchEvent) => {
            const clientX =
                "touches" in e
                    ? (e as TouchEvent).touches[0].clientX
                    : (e as MouseEvent).clientX;

            const bar = barRef.current;
            if (!bar) return;

            const rect = bar.getBoundingClientRect();
            const offsetX = clientX - rect.left;
            const percent = Math.max(0, Math.min(offsetX / rect.width, 1));
            const newValue =
                Math.round((SLIDER_MIN + percent * (SLIDER_MAX - SLIDER_MIN)) / 1000) *
                1000;

            setConfirmedValueAction(newValue);
        },
        [setConfirmedValueAction]
    );

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => handleInteraction(e);
        const handleMouseMove = (e: MouseEvent) => handleInteraction(e);
        const handleEnd = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchend", handleEnd);
        };

        const handleStart = (e: MouseEvent | TouchEvent) => {
            handleInteraction(e);
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("mouseup", handleEnd);
            window.addEventListener("touchend", handleEnd);
        };

        const bar = barRef.current;
        if (!bar) return;

        bar.addEventListener("mousedown", handleStart);
        bar.addEventListener("touchstart", handleStart, { passive: false });

        return () => {
            bar.removeEventListener("mousedown", handleStart);
            bar.removeEventListener("touchstart", handleStart);
        };
    }, [handleInteraction]);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-2">
            <div
                ref={barRef}
                className="relative h-12 bg-slate-300 rounded-full overflow-hidden touch-none"
            >
                <div
                    className="absolute h-full bg-slate-800 left-0 top-0"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-sm text-blue-950 mt-1 px-1">
                <span>${SLIDER_MIN.toLocaleString()}</span>
                <span>${SLIDER_MAX.toLocaleString()}</span>
            </div>
        </div>
    );
}
