const Input = ({
    label,
    name,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
  
  export default Input;
  