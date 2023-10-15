const fonts = [
  "Arial Black",
  "Arial",
  "BlinkMacSystemFont",
  "Bookman",
  "Cantarell",
  "Comic Sans MS",
  "Courier New",
  "Cursive",
  "Droid Sans",
  "Fantasy",
  "Fira Sans",
  "Garamond",
  "Georgia",
  "Helvetica Neue",
  "Helvetica",
  "Impact",
  "Monospace",
  "Oxygen",
  "Palatino",
  "Roboto",
  "Sans-Serif",
  "Segoe UI",
  "Serif",
  "System-ui",
  "Times New Roman",
  "Trebuchet MS",
  "Ubuntu",
  "Verdana",
];

export const FontPicker = ({
  id = "font_family",
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (font: string) => void;
}) => {
  return (
    <div className="font-picker">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
};
