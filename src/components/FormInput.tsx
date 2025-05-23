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
      {...(type !== "file" ? { value } : {})} // 🛡️ Avoid setting value for file inputs
      onChange={onChange}
      className={type !== "file"? "w-full p-2 border rounded": "w-full p-2 border rounded"}
    />
  </div>

  // <div>
  //   <label className="block text-sm font-medium mb-1">{label}</label>

  //   {type === "file" ? (
  //     <div className="flex items-end">

  //       <input
  //         type="file"
  //         name={name}
  //         id={name}
  //         onChange={onChange}
  //         className="hidden"
  //       />


  //       <label
  //         htmlFor={name}
  //         className="inline-block px-2 py-1 border bg-gray-300 rounded cursor-pointer hover:bg-gray-300 transition"
  //       >
  //         Choose File
  //       </label>
  //     </div>
  //   ) : (
  //     <input
  //       type={type}
  //       name={name}
  //       value={value}
  //       onChange={onChange}
  //       className="w-full px-2 py-1 border rounded"
  //     />
  //   )}
  // </div>
);

export default Input;
