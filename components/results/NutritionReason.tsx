interface NutritionReasonProps {
  reason: string;
}

// The "why this meal" line. This is the thing that sells the recommendation,
// so it gets the most readable treatment on the card.
export function NutritionReason({ reason }: NutritionReasonProps) {
  return (
    <p className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200">
      {reason}
    </p>
  );
}
