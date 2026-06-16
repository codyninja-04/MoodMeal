'use client';

interface OptionPillProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

// Selectable pill used by the stress and craving questions.
export function OptionPill({ label, selected, onClick, icon }: OptionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base font-medium transition-all active:scale-[0.97] ${
        selected
          ? 'border-ember bg-ember/10 text-ember'
          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-surface dark:text-zinc-200 dark:hover:border-zinc-600'
      }`}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {label}
    </button>
  );
}
