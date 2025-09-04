import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const MultiSelect_Tag = forwardRef(function MultiSelect_Tag(
  {
    options = [],
    label = "Select Options",
    placeholder = "Select...",
    onChange,
    labelVisible = true,
    defaultValue = [],
    labelClass = "",
    className = "",
    name,
    error=''
  },
  ref
) {
  const [selected, setSelected] = useState(Array.isArray(defaultValue) ? defaultValue : []);
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const hiddenInputRef = useRef();

  // Pass the ref from react-hook-form to the hidden input
  // useImperativeHandle(ref, () => hiddenInputRef.current);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange({ target: { name, value: selected } });
    }
  }, [selected]);

  useEffect(() => {
    setSelected(Array.isArray(defaultValue) ? defaultValue : []);
  }, [defaultValue]);  

  const selectedLabels = options
    .filter((opt) => selected.includes(opt.value))
    .map((opt) => opt.label);     

  const handleSelect = (option) => {
    if (selected.includes(option.value)) {
      setSelected(selected.filter((val) => val !== option.value));
    } else {
      setSelected([...selected, option.value]);
    }
  };

  const clearSelection = () => {
    setSelected([]);
  };
  
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative" ref={dropdownRef} onMouseDown={(e) => e.stopPropagation()}  onMouseUp={(e) => e.stopPropagation()} >
      {/* ✅ Hidden input to be used with `register()` */}
      <input
        type="hidden"
        name={name}
        // ref={hiddenInputRef}
        ref={ref}
        value={JSON.stringify(selected)}
        readOnly
      />

      {label && (
        <label
          className={`${
            labelVisible ? "inline-block" : "hidden"
          } mb-1 pl-1 text-black ${labelClass}`}
        >
          {label}
        </label>
      )}
      <div className={`flex align-center rounded-lg bg-white border ${error ? 'border-red-500' : 'border-gray-400'}`}>
        <div
          className={`px-3 bg-transparent rounded-lg text-black w-full cursor-pointer flex ${className}`}
          onClick={() => setShowOptions((prev) => !prev)}
        >
          {selected.length > 0 ? selectedLabels.join(", ") : placeholder}
        </div>
        <button
          className="text-sm w-fit font-bold p-1 bg-red-500 w-100 rounded-e text-white hover:underline"
          onClick={clearSelection}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
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
              className="w-full px-2 py-1 text-sm border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ul className="max-h-24 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleSelect(option)}
                  />
                  <span>{option.label}</span>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">
                No options found
              </li>
            )}
          </ul>
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
});

export default MultiSelect_Tag;
