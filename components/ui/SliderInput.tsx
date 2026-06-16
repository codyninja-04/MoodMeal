'use client';

interface SliderInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  lowAnchor: React.ReactNode;
  highAnchor: React.ReactNode;
}

// Reusable 1-5 range slider with emoji/icon anchors at each end and no numbers,
// just the thumb position — matches the energy question spec.
export function SliderInput({
  value,
  min = 1,
  max = 5,
  onChange,
  lowAnchor,
  highAnchor,
}: SliderInputProps) {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-2xl">
        <span aria-hidden>{lowAnchor}</span>
        <span aria-hidden>{highAnchor}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-ember dark:bg-zinc-700"
        aria-label="Level from low to high"
      />
      <div className="mt-3 flex justify-between px-1">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
          <span
            key={n}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              n <= value
                ? 'bg-ember'
                : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
