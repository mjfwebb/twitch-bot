import { useEffect, useState } from 'react';

import { styled } from 'styled-components';

const Input = styled.input`
  background: transparent;
  color: inherit;
  border: 1px solid #555a;
  border-radius: 2px;
  width: 70px;
  height: 28px;
  margin: 0 8px;
  box-sizing: border-box;
  text-align: right;
`;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default ({ value, onChange }: Props) => {
  const [tmp, setTmp] = useState(value);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      setTmp(value);
    }
  }, [value, active]);

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTmp(e.target.value);
    onChange(e.target.value);
  };

  const blurHandler: React.FocusEventHandler<HTMLInputElement> = () => {
    setActive(false);
    if (/(-?\d+)((r?em)|(px)|%)$/.test(tmp)) onChange(tmp);
  };

  const focusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
    setActive(true);
  };

  return <Input className={'text-shadow-picker__input'} value={tmp} onFocus={focusHandler} onBlur={blurHandler} onChange={changeHandler} />;
};
