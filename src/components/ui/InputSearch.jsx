import React from 'react'
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const InputSearch = React.forwardRef(function InputSearch({
    type = 'text',
    name = '',
    className = '',
    placeholder = 'Please enter Text',     
    value = '',
    onChange,
    onSearch=()=>{},
    onClear=()=>{},
    showClear=false,
    ...props        
},ref) {
    const id=React.useId();
    const inputClass = `w-full pl-2 py-1 rounded-md text-sm focus:outline-none focus:border-transparent z-0 ${className}`;
    return (
        <div className="flex items-center border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <input
                type={type}
                className={inputClass}
                name={name}
                ref={ref}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(value);
                    }
                }}                
                {...props}
                />

                <button
                type="button"
                onClick={onClear}
                className={`p-1 text-gray-400 hover:text-gray-600 ${showClear && value.length>0 ? 'opacity-100 z-20 cursor-pointer': 'opacity-0 -z-20 cursor-auto'}`}
                >
                <IoMdClose className="text-lg" />
                </button>  
                <button className='p-2 bg-black rounded-r-md border-none' onClick={()=>onSearch(value)}>
                    <FaSearch className='text-gray-50 text-lg' />
                </button>
        </div>
    )
});

export default InputSearch
