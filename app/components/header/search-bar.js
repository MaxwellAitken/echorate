"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ onOpenSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const inputRef = useRef(null);
    

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        if (!searchQuery) return;
        
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        onOpenSearch(false);
        setIsOpen(false);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };
    
    // Open search bar
    const handleOpenSearch = () => {
        onOpenSearch(true);
        setIsOpen(true);
    };

    // Close search bar
    const handleCloseSearch = () => {
        onOpenSearch(false);
        setIsOpen(false);
        setSearchQuery("");
    }
    
    // Focus search bar
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    
    
    return (
        <div className="relative flex items-center">
            {isOpen ? 
                (
                    <button className="w-8" onClick={handleCloseSearch}>✖</button>
                ) : 
                (
                    <FaSearch className="hover:cursor-pointer w-5" onClick={handleOpenSearch} size={20} />
                )
            }

            {/* <div> */}
                <form className={`absolute ml-8 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isOpen ? 'w-32' : 'w-0'} overflow-hidden`} onSubmit={handleSearchSubmit}>
                    <input
                        ref={inputRef}
                        className="p-1 w-full rounded-2xl text-gray-800 focus:outline-none"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            {/* </div> */}
        </div>
    );
};
    
export default SearchBar;
    