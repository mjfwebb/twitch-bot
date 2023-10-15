import { useEffect, useState } from "react";

import { styled } from "styled-components";

import { parseHexColor } from "../common";
import Input from "../inputs/Input";
import { Label } from "../inputs/Label";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Slider = styled.input`
  flex: 1;

  appearance: none;
  width: 100%;
  height: 2px;
  background: #555a;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4285f4;
    cursor: pointer;
  }
`;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const useHex = (value: string) => {
  const [alpha, setAlpha] = useState(0);
  const [color, setColor] = useState("");

  useEffect(() => {
    const values = parseHexColor(value);
    if (values) {
      setAlpha(values.alpha);
      setColor(values.color);
    }
  }, [value]);

  return { color, alpha };
};

export default ({ value, onChange }: Props) => {
  const { color, alpha } = useHex(value);

  const updated: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value + alpha.toString(16).padStart(2, "0"));
  };

  const updatedInput: (value: string) => void = (e) => {
    onChange(e);
  };

  const updatedAlpha: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const hex = parseInt(e.target.value).toString(16).padStart(2, "0");
    onChange(color + hex);
  };

  return (
    <Wrapper>
      <Label>Color</Label>
      <Input value={value} onChange={updatedInput} />
      <input value={color} onChange={updated} type={"color"} />
      <Slider
        className={"text-shadow-picker__slider"}
        type={"range"}
        value={alpha}
        onChange={updatedAlpha}
        max={255}
      />
    </Wrapper>
  );
};
