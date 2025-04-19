type Option = string | { label: string; value: string | number };

interface SelectProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

const Select = ({ label, name, value, onChange, options }: SelectProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt, index) => {
        if (typeof opt === "string") {
          return (
            <option key={index} value={opt}>
              {opt}
            </option>
          );
        }

        return (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  </div>
);

export default Select;
