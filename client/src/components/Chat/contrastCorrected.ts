type RGB = {
  red: number;
  green: number;
  blue: number;
};

type HSL = {
  hue: number;
  saturation: number;
  lightness: number;
};

function rgbToString({ red, green, blue }: RGB): string {
  return `rgb(${red},${green},${blue})`;
}

function hslToString({ hue, saturation, lightness }: HSL): string {
  return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
}

// Kudos to Alvaro Montoro https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
export const contrastCorrected = (foregroundHex: string, backgroundHex: string): string => {
  const foregroundRGB = convertHexToRgb(foregroundHex);
  const backgroundRGB = convertHexToRgb(backgroundHex);

  if (!foregroundRGB || !backgroundRGB) {
    return foregroundHex;
  }

  const foregroundLuminance = getLuminance(foregroundRGB);
  const backgroundLuminance = getLuminance(backgroundRGB);
  const constrastRatio = getContrastRatio(foregroundLuminance, backgroundLuminance);

  const badConstrast = constrastRatio > 1 / 4.5;

  if (badConstrast) {
    const hsl = convertRGBtoHSL(foregroundRGB);
    if (
      (foregroundLuminance >= backgroundLuminance && backgroundLuminance > 0.5) ||
      (backgroundLuminance >= foregroundLuminance && backgroundLuminance > 0.5)
    ) {
      hsl.lightness = hsl.lightness - 50 * constrastRatio;
    }
    if (
      (foregroundLuminance >= backgroundLuminance && backgroundLuminance < 0.5) ||
      (backgroundLuminance >= foregroundLuminance && backgroundLuminance < 0.5)
    ) {
      hsl.lightness = hsl.lightness + 50 * constrastRatio;
    }
    const result = hslToString(hsl);
    return result;
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
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance({ red, green, blue }: RGB): number {
  const a = [red, green, blue].map(function (value) {
    value /= 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(foregroundLuminance: number, backgroundLuminance: number): number {
  return foregroundLuminance > backgroundLuminance
    ? (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05)
    : (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05);
}

function convertRGBtoHSL({ red, green, blue }: RGB): HSL {
  // Make red, green, and blue fractions of 1
  red /= 255;
  green /= 255;
  blue /= 255;

  // Find greatest and smallest channel values
  const chromaMin = Math.min(red, green, blue);
  const chromaMax = Math.max(red, green, blue);
  const delta = chromaMax - chromaMin;
  let hue = 0;

  // Calculate hue
  // No difference
  if (delta === 0) {
    hue = 0;
  } else if (chromaMax === red) {
    // Red is max
    hue = ((green - blue) / delta) % 6;
  } else if (chromaMax === green) {
    // Green is max
    hue = (blue - red) / delta + 2;
  } else {
    // Blue is max
    hue = (red - green) / delta + 4;
  }

  // Keep 2 decimal places for accuracy
  hue = +(hue * 60).toFixed(2);

  // Make negative hues positive behind 360°
  if (hue < 0) {
    hue += 360;
  }

  // Calculate lightness
  let lightness = 0;
  lightness = (chromaMax + chromaMin) / 2;

  // Calculate saturation
  let saturation = 0;
  saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  // Multiply lightness by 100, keep 2 decimal places for accuracy
  lightness = +(lightness * 100).toFixed(2);
  // Multiply saturation by 100, keep 2 decimal places for accuracy
  saturation = +(saturation * 100).toFixed(2);

  return { hue, saturation, lightness };
}
