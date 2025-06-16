import React from "react";
import { Child } from "./validationSchema"; // Assuming relative path is correct

interface ChildrenDetailsProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  childrenErrors: { name?: string; dob?: string }[];
}

const ChildrenDetails: React.FC<ChildrenDetailsProps> = ({
  children,
  setChildren,
  childrenErrors,
}) => {
  const handleChildChange = (
    index: number,
    field: keyof Child,
    value: string
  ) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };

  const addChild = () => {
    setChildren([...children, { name: "", dob: "" }]);
  };

  const removeChild = (index: number) => {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
        Children Details
      </h3>

      {children.map((child, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 border p-4 rounded-md"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Child Name
            </label>
            <input
              type="text"
              value={child.name}
              onChange={(e) =>
                handleChildChange(index, "name", e.target.value)
              }
              className={`w-full px-3 py-2 border border-gray-300 shadow-sm rounded-lg ${
                childrenErrors[index]?.name ? "border-red-500" : ""
              }`}
            />
            {childrenErrors[index]?.name && (
              <p className="text-sm text-red-500 mt-1">
                {childrenErrors[index]?.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={child.dob}
              onChange={(e) =>
                handleChildChange(index, "dob", e.target.value)
              }
              className={`w-full px-3 py-2 border border-gray-300 shadow-sm rounded-lg ${
                childrenErrors[index]?.dob ? "border-red-500" : ""
              }`}
            />
            {childrenErrors[index]?.dob && (
              <p className="text-sm text-red-500 mt-1">
                {childrenErrors[index]?.dob}
              </p>
            )}
          </div>
          <div className="col-span-2 text-right">
            <button
              type="button"
              onClick={() => removeChild(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right">
        <button
          type="button"
          onClick={addChild}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Child
        </button>
      </div>
    </div>
  );
};

export default ChildrenDetails;
