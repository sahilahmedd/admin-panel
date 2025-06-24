/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface TableHeaderProps {
  title: string;
  searchText?: string;
  text?: string;
  placeholder?: string;
  handleAdd?: () => void;
  setSearchText?: (text: string) => void;
  onSearchChange?: (text: string) => void;
  addNewLink?: string;
  addNewText?: string;
  onAddClick?: () => void;
}

const TableHeader = ({
  title,
  searchText = "",
  text = "New",
  placeholder = "Search...",
  handleAdd,
  setSearchText,
  onSearchChange,
  addNewLink,
  addNewText,
  onAddClick,
}: TableHeaderProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (setSearchText) setSearchText(value);
    if (onSearchChange) onSearchChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex gap-4 w-full sm:w-auto">
        <input
          type="text"
          placeholder={placeholder}
          value={searchText}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
        />
        {addNewLink && addNewLink !== "#" && addNewLink !== null ? (
          <Link
            href={addNewLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 whitespace-nowrap"
          >
            <PlusCircle size={20} />
            <span>{addNewText || `Add ${text}`}</span>
          </Link>
        ) : (
          <button
            onClick={onAddClick || handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 whitespace-nowrap"
          >
            <PlusCircle size={20} />
            <span>{addNewText || `Add ${text}`}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
