type RGB = {
  r: number;
  g: number;
  b: number;
};

type Hex = `#${string | number}`;

// Kudos to Alvaro Montoro https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
export const contrastCorrected = (foregroundHex: string, backgroundHex: Hex): string => {
  const foregroundRGB = convertHexToRgb(foregroundHex);
  const backgroundRGB = convertHexToRgb(backgroundHex);

  if (!foregroundRGB || !backgroundRGB) {
    return foregroundHex;
  }

  const foregroundLuminance = getLuminance(foregroundRGB);
  const backgroundLuminance = getLuminance(backgroundRGB);
  const constrastRatio = getConstrastRatio(foregroundLuminance, backgroundLuminance);

  const badConstrast = constrastRatio > 1 / 4.5;

  if (badConstrast) {
    return convertRGBtoHSL(foregroundRGB);
  }

  return foregroundHex;
};

function convertHexToRgb(hex: string): RGB | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const parsedHex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(parsedHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance({ r, g, b }: RGB): number {
  const a = [r, g, b].map(function (value) {
    value /= 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getConstrastRatio(foregroundLuminance: number, backgroundLuminance: number): number {
  return foregroundLuminance > backgroundLuminance
    ? (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05)
    : (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05);
}

function convertRGBtoHSL({ r, g, b }: RGB): string {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  const chromaMin = Math.min(r, g, b);
  const chromaMax = Math.max(r, g, b);
  const delta = chromaMax - chromaMin;
  let hue = 0;

  // Calculate hue
  // No difference
  if (delta === 0) {
    hue = 0;
  } else if (chromaMax === r) {
    // Red is max
    hue = ((g - b) / delta) % 6;
  } else if (chromaMax === g) {
    // Green is max
    hue = (b - r) / delta + 2;
  } else {
    // Blue is max
    hue = (r - g) / delta + 4;
  }

  hue = Math.round(hue * 60);

  // Make negative hues positive behind 360°
  if (hue < 0) hue += 360;

  // Calculate lightness
  let lightness = 0;
  lightness = (chromaMax + chromaMin) / 2;
  // Multiply lightness by 100
  lightness = +(lightness * 100).toFixed(1);

  // Calculate saturation
  let saturation = 0;
  saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  // Multiply saturation by 100
  saturation = +(saturation * 100).toFixed(1);

  return `hsl(${hue},${saturation}%,${73.5}%)`;
}
