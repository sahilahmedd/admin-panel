import TableSearch from "./TableSearch";
import { Toaster } from "react-hot-toast";

const TableHeader = ({
  title,
  handleAdd,
  placeholder,
  searchText,
  setSearchText,
  text,
}) => {

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <div className="w-full sm:w-64">
        <TableSearch
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder={placeholder}
        />
      </div>
      <button
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-2 rounded-full shadow-sm transition"
      >
        Add New {text}
        {/* <PlusIcon strokeWidth={3} /> */}
      </button>
    </div>    
    </>
  );
};

export default TableHeader;
