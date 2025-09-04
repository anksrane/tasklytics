import React, { useState, useEffect, useRef } from "react";

const MultiSelect = ({
  options = [],
  label = "Select Options",
  placeholder = "Select...",
  onChange,
  labelVisible=true,
  defaultValue = [],
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Inform parent on change
  useEffect(() => {
    onChange && onChange(selected);
  }, [selected]);

  const handleSelect = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const clearSelection = () => {
    setSelected([]);
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-2 relative" ref={dropdownRef}>
      {label && <label className={`${labelVisible ? 'inline-block' : 'hidden'}mb-1 pl-1`}>{label}</label>}
      <div className="flex align-center rounded-lg bg-white border">
        <div
          className="px-3 py-2 bg-transparent rounded-lg text-black w-full cursor-pointer"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          {selected.length > 0 ? selected.join(", ") : placeholder}
        </div>
        {/* ✅ Clear Button */}
        <button
          className="text-sm w-fit font-bold p-2 bg-red-500 w-100 rounded-e text-white hover:underline"
          onClick={clearSelection}
          type="button"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        </button>
      </div>

      {showOptions && (
        <div className="border rounded-lg shadow-md bg-white z-10 w-full max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 py-1 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)} // ✅ Full li clickable
                  className="px-3 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onClick={(e) => e.stopPropagation()} // ✅ Prevent bubbling
                    onChange={() => handleSelect(option)}
                  />
                  <span>{option}</span>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 text-sm">
                No options found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;