"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    
    const inputRef = useRef(null);
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        if (!searchQuery) return;
        
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };
    
    const [isOpen, setIsOpen] = useState(false);
    
    const handleClick = () => setIsOpen(true);
    
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    
    
    return (
        
        <div className="relative flex items-center">
            <div className="absolute">
            
                {isOpen ? 
                (
                    <div className="flex gap-2">
                        <button onClick={() => setIsOpen(false)}>✖</button>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                            ref={inputRef}
                            className="p-1 rounded-2xl text-gray-800 focus:outline-none"
                            type="text"
                            placeholder="" //???
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                ) : 
                (
                    <div className="hover:cursor-pointer" onClick={handleClick}>
                        <FaSearch size={20} />
                    </div>
                )}
            </div>
        </div>
        );
    };
    
    export default SearchBar;
    