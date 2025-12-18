import FilterInput from './FilterInput';
import { MESSAGES } from '../../../constants/messages.constants';

interface FilterPlaceholderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterQuery: string;
  onFilterChange: (filter: string) => void;
}

function FilterPlaceholder({
  searchQuery,
  onSearchChange,
  filterQuery,
  onFilterChange
}: FilterPlaceholderProps) {
  return (
    <div className="bg-bg-main">
      <div className="p-lg max-w-[1200px] mx-auto">
        <h2 className="mt-0 mb-4 text-xl font-bold text-text-primary">
          {MESSAGES.EVENT_LIST_TITLE}
        </h2>
        <div className="flex gap-md">
          <FilterInput
            placeholder={MESSAGES.SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChange={onSearchChange}
          />
          <FilterInput
            placeholder={MESSAGES.FILTER_PLACEHOLDER}
            value={filterQuery}
            onChange={onFilterChange}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterPlaceholder;
