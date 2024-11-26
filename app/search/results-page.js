"use client";

import { useState, useEffect } from "react";
import { useToken } from "../../_utils/token-context";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { token } = useToken();
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    if (!searchQuery) return;

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=album,track,artist&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Error fetching search results:", response.statusText);
          return;
        }

        const data = await response.json();
        setSearchResults(data.albums.items); // You can handle tracks and artists similarly
      } catch (error) {
        console.error("Error fetching search data:", error.message);
      }
    };

    fetchSearchResults();
  }, [searchQuery, token]);

  return (
    <div>
      <h1>Search Results for &quot;{searchQuery}&quot;</h1>

      {searchResults.length > 0 ? (
        <div className="flex flex-wrap gap-8">
          {searchResults.map((result) => (
            <button key={result.id} onClick={() => router.push(`/albums/${result.id}`)}>
                <div className="result-item text-center">
                    <Image width={96} height={96} className="max-h-48" src={result.images[0].url} alt={result.name} />
                    <div>
                        <h2>{result.name}</h2>
                        <p>{result.artists[0].name}</p>
                    </div>
                </div>
            </button>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResultsPage;