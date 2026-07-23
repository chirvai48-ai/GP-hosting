// Extended accent palette for the overview dashboard — the site only defines
// --color-primary (teal) and --color-secondary (gold) as brand tokens, which
// isn't enough range for a chart-heavy page. These stay scoped here rather
// than polluting global design tokens.
export const CHART_COLORS = {
  teal: "#145652",
  gold: "#c9a84c",
  blue: "#3a6ea5",
  coral: "#c4633c",
  plum: "#7a5980",
  slate: "#5b6b69",
} as const;

export type ChartColorName = keyof typeof CHART_COLORS;
