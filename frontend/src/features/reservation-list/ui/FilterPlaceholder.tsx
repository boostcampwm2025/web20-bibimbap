import FilterInput from './FilterInput';

function FilterPlaceholder() {
  return (
    <div className="bg-bg-main">
      <div className="p-lg max-w-[1200px] mx-auto">
        <h2 className="mt-0 mb-4 text-xl font-bold text-text-primary">
          이벤트 목록
        </h2>
        <div className="flex gap-md">
          <FilterInput placeholder="검색..." />
          <FilterInput placeholder="필터..." />
        </div>
      </div>
    </div>
  );
}

export default FilterPlaceholder;
