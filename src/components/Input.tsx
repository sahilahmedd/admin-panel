const Input = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  type = "text",
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none ${
        disabled
          ? "bg-gray-100 cursor-not-allowed text-gray-500"
          : "border-gray-300 focus:ring focus:ring-blue-200"
      }`}
    />
  </div>
);

export default Input;
