// components/TableSearch.tsx
import { Search } from "lucide-react";

type TableSearchProps = {
  searchText: string;
  setSearchText: (value: string) => void;
  placeholder?: string;
};

const TableSearch: React.FC<TableSearchProps> = ({
  searchText,
  setSearchText,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative w-full sm:max-w-sm mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default TableSearch;
