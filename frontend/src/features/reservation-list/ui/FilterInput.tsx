interface FilterInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function FilterInput({ placeholder, value, onChange }: FilterInputProps) {
  return (
    <input
      type="text"
      className="w-64 px-3 py-2 border border-border-main rounded text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default FilterInput;
