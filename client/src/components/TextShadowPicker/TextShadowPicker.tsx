import React, { useEffect, useState } from "react";

import { styled } from "styled-components";

import { buildShadowString, parseShadowString } from "./common";
import ColorField from "./fields/ColorField";
import OffsetField from "./fields/OffsetField";
import SliderField from "./fields/SliderField";
import type { ShadowOffset, TextShadowPickerParams } from "./types";

const Wrapper = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  background: #2a2a2a;

  width: 250px;
  height: 190px;
  font-size: 14px;

  font-family: sans-serif;
  color: #bec6cf;
`;

export interface Props {
  onChange: (value: string) => void;
  value?: string;
  className?: string;
  colorPicker?: React.ReactNode;
}

const useShadowParameters = (
  onChange: Props["onChange"],
  value?: string,
): [
  TextShadowPickerParams,
  (
    column: keyof TextShadowPickerParams,
  ) => (value: string | ShadowOffset | undefined) => void,
] => {
  const isControlled = value && onChange;
  const [state, setState] = useState<TextShadowPickerParams>({
    offset: { x: "1px", y: "1px" },
    blur: "2px",
    color: "#000000ff",
  });

  useEffect(() => {
    if (!isControlled) return;

    const p = parseShadowString(value);

    if (p) setState(p);
  }, [isControlled, value]);

  useEffect(() => {
    if (isControlled) return;
    const newValue = buildShadowString(state);
    onChange(newValue);
  }, [isControlled, state, onChange]);

  const updateState =
    (column: keyof TextShadowPickerParams) =>
    (value: string | ShadowOffset | undefined) => {
      const newParams: TextShadowPickerParams = { ...state, [column]: value };
      onChange(buildShadowString(newParams));
      !isControlled && setState(newParams);
    };

  return [state, updateState];
};

export default ({ onChange, value, className = "" }: Props) => {
  const [state, updateState] = useShadowParameters(onChange, value);

  return (
    <Wrapper className={"text-shadow-picker " + className}>
      <OffsetField
        value={state?.offset || { x: "0", y: "0" }}
        onChange={updateState("offset")}
      />
      <SliderField
        value={state?.blur || "0"}
        onChange={updateState("blur")}
        title={"Blur"}
      />
      <ColorField
        value={state?.color || "#000000"}
        onChange={updateState("color")}
      />
    </Wrapper>
  );
};
