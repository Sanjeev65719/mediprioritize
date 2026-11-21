// PLACEHOLDER scoring. Replace with the logic/model used in the Base44 app.
// Not for clinical use.
export const LEVELS = ["critical", "urgent", "routine"];

export function levelFromScore(score) {
  if (score >= 0.8) return "critical";
  if (score >= 0.5) return "urgent";
  return "routine";
}

export function priorityScore(caseItem) {
  const { multimodal } = caseItem;
  if (
    multimodal &&
    Number.isFinite(multimodal.imageOnlyScore) &&
    Number.isFinite(multimodal.contextAdjustment)
  ) {
    return Math.max(0, Math.min(1, multimodal.imageOnlyScore + multimodal.contextAdjustment));
  }
  return caseItem.score ?? null;
}

export function sortByPriority(cases) {
  return [...cases].sort((a, b) => {
    const scoreA = priorityScore(a);
    const scoreB = priorityScore(b);
    if (scoreA == null) return scoreB == null ? 0 : 1;
    if (scoreB == null) return -1;
    return scoreB - scoreA;
  });
}
