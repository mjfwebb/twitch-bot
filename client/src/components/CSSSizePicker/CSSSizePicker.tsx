import './CSSSizePicker.less';

// Optional additional units could be:
const cssUnitTypes = ['px', 'em', 'rem', '%', 'vw', 'vh', 'vmin', 'vmax', 'ex', 'ch', 'cm', 'mm', 'in', 'pt', 'pc'] as const;
type CSSUnit = (typeof cssUnitTypes)[number];

export const CSSSizePicker = ({
  id,
  defaultValue,
  defaultUnit,
  value,
  unit,
  onValueChange,
  onUnitChange,
  cssUnits = ['px', 'em'],
}: {
  id: string;
  defaultValue: number;
  defaultUnit: string;
  value: number;
  unit: string;
  onValueChange: (fontSizeValue: number) => void;
  onUnitChange: (fontSizeUnit: string) => void;
  cssUnits?: CSSUnit[];
}) => {
  return (
    <div className="css-size-picker" id={id}>
      <input value={value} type="number" onChange={(e) => onValueChange(+e.target.value)} />
      <select value={unit} onChange={(e) => onUnitChange(e.target.value)}>
        {cssUnits.map((cssUnit) => (
          <option key={cssUnit} value={cssUnit}>
            {cssUnit}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          onValueChange(defaultValue);
          onUnitChange(defaultUnit);
        }}
      >
        reset
      </button>
    </div>
  );
};
