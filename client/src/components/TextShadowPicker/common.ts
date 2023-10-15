import { useEffect, useState } from "react";

import type { TextShadowPickerParams } from "./types";

export const unitRegex = /(-?\d+)((r?em)|(px)|%)$/;

export const parseShadowString = (value: string): TextShadowPickerParams => {
  const parts = value.split(" ");

  const [x, y, blur, color] = parts;
  return { offset: { x: x, y: y }, color, blur };
};

export const buildShadowString = (params: TextShadowPickerParams): string => {
  const values = [
    params.offset?.x || "0",
    params.offset?.y || "0",
    params.blur,
    params.color || "#000000",
  ].filter((p) => !!p);

  return values.join(" ");
};

export const parseHexColor = (
  value: string,
): { color: string; alpha: number } | null => {
  const match = value.match(/#(?<hex>[0-9A-F]{6,8})/i);
  const hex = match?.groups?.hex;
  if (hex) {
    let alpha = 255;
    if (hex.length === 8) {
      alpha = parseInt(hex.substring(6, 8), 16);
    }
    return { alpha, color: "#" + hex.substring(0, 6) };
  }
  return null;
};

export const useUnitValue = (value: string) => {
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState("px");

  useEffect(() => {
    const matches = value.match(unitRegex);

    if (matches?.length === 5) {
      setAmount(parseInt(matches[1]));
      setUnit(matches[2]);
    }
  }, [value]);

  return { unit, amount, setUnit, setAmount };
};
