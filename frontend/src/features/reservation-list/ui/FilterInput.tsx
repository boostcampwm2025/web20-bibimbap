interface FilterInputProps {
  placeholder: string;
}

function FilterInput({ placeholder }: FilterInputProps) {
  return (
    <input
      type="text"
      className="w-64 px-3 py-2 border border-border-main rounded text-sm bg-white text-text-secondary disabled:cursor-not-allowed disabled:opacity-60"
      placeholder={placeholder}
      disabled
    />
  );
}

export default FilterInput;
