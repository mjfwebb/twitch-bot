import Color from "color";

export const contrastCorrected = (
  foregroundHex: string,
  backgroundHex: string,
): string => {
  const foreground = Color(foregroundHex);
  const background = Color(backgroundHex);

  const constrastRatio = getContrastRatio(
    foreground.luminosity(),
    background.luminosity(),
  );

  const badConstrast = constrastRatio > 1 / 4.5;

  if (badConstrast) {
    if (background.isLight()) {
      return foreground.darken(0.5).hex();
    } else if (background.isDark()) {
      return foreground.lighten(0.5).hex();
    }
  }

  return foregroundHex;
};

function getContrastRatio(
  foregroundLuminance: number,
  backgroundLuminance: number,
): number {
  return foregroundLuminance > backgroundLuminance
    ? (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05)
    : (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05);
}
