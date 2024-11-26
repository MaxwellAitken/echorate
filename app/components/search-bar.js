import { useState } from "react";
import { useToken } from "../../_utils/token-context";
import { useRouter } from "next/navigation";

export const SearchBar = ({ }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const { token } = useToken();
    const router = useRouter();
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (!searchQuery) return;

        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    };
    
    return (
        <form onSubmit={handleSearchSubmit}>
        <input
        type="text"
        placeholder="Search for albums, tracks, or artists..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
