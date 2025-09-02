import type { LyricPreset } from "../../../styles/lyricPresets";

export function buildPresetTextStyle(
  preset: LyricPreset,
  isPortrait: boolean = false
): React.CSSProperties {
  const style: React.CSSProperties = {
    color: (preset as any).gradientText
      ? "transparent"
      : (preset as any).color ?? "#fff",
    fontWeight: ((preset as any).fontWeight as any) ?? 700,
    fontFamily: (preset as any).fontFamily ?? undefined,
    fontSize: `${isPortrait ? 60 : 100}px`,
    letterSpacing: `${(preset as any).letterSpacingPx ?? 0}px`,
    textTransform: ((preset as any).textTransform as any) ?? "none",
    textAlign: ((preset as any).textAlign as any) ?? "center",
    textShadow: (preset as any).textShadow ?? "0 2px 12px rgba(0,0,0,0.55)",
    WebkitBackgroundClip: (preset as any).gradientText ? "text" : undefined,
    backgroundClip: (preset as any).gradientText ? ("text" as any) : undefined,
    WebkitTextFillColor: (preset as any).gradientText
      ? ("transparent" as any)
      : undefined,
    backgroundImage: (preset as any).gradientText
      ? `linear-gradient(90deg, ${(preset as any).gradientText.from}, ${
          (preset as any).gradientText.to
        })`
      : undefined,
  };
  return style;
}

export function mergeWordStyle(base: React.CSSProperties, override?: any) {
  if (!override) return base;
  const o = override || {};

  // Font size override applied

  const merged: React.CSSProperties = {
    ...base,
    color: o.gradientText ? "transparent" : o.color ?? base.color,
    fontFamily: o.fontFamily ?? base.fontFamily,
    fontWeight: (o.fontWeight as any) ?? base.fontWeight,
    fontSize:
      typeof o.fontSizePx === "number" ? `${o.fontSizePx}px` : base.fontSize,
    letterSpacing:
      typeof o.letterSpacingPx === "number"
        ? `${o.letterSpacingPx}px`
        : base.letterSpacing,
    textTransform: (o.textTransform as any) ?? base.textTransform,
    textAlign: (o.textAlign as any) ?? base.textAlign,
    textShadow: o.textShadow ?? base.textShadow,

    WebkitBackgroundClip: o.gradientText ? "text" : base.WebkitBackgroundClip,
    backgroundClip: o.gradientText
      ? ("text" as any)
      : (base as any).backgroundClip,
    WebkitTextFillColor: o.gradientText
      ? ("transparent" as any)
      : (base as any).WebkitTextFillColor,
    backgroundImage: o.gradientText
      ? `linear-gradient(90deg, ${o.gradientText.from}, ${o.gradientText.to})`
      : base.backgroundImage,
    opacity: o.opacity === 0 ? 0 : base.opacity || 1,
  };
  // If a solid color override is provided and no word-level gradient, disable preset gradient props
  if (typeof o.color === "string" && !o.gradientText) {
    (merged as any).WebkitBackgroundClip = undefined;
    (merged as any).backgroundClip = undefined;
    (merged as any).WebkitTextFillColor = undefined;
    merged.backgroundImage = undefined as any;
  }
  return merged;
}
