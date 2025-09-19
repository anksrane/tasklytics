import React from 'react'
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const InputSearch = React.forwardRef(function InputSearch({
    type = 'text',
    name = '',
    className = '',
    searchBtnClassName='',
    clearBtnClassName='',
    placeholder = 'Please enter Text',     
    value = '',
    onChange,
    onSearch=()=>{},
    onClear=()=>{},
    showClear=false,
    ...props        
},ref) {
    const id=React.useId();
    const inputClass = `pl-2 py-1 rounded-md text-sm focus:outline-none focus:border-transparent z-0 w-full ${className}`;
    return (
        <div className="flex items-center rounded-md focus:outline-none focus:shadow-md focus:border-primary hover:border-primary-hover relative min-w-[250px]">
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
                className={`p-1 text-gray-400 hover:text-gray-600 absolute right-0 ${clearBtnClassName} ${showClear && value.length>0 ? 'opacity-100 z-20 cursor-pointer': 'opacity-0 -z-20 cursor-auto'}`}
                >
                <IoMdClose className="text-lg" />
            </button>  
            {/* <button className={`p-2 bg-black rounded-r-md border-0 ${searchBtnClassName}`} onClick={()=>onSearch(value)}>
                    <FaSearch className='text-gray-50 text-lg' />
            </button> */}
        </div>
    )
});

export default InputSearch
