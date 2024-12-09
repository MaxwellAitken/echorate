"use client";

import { useState, useEffect } from "react";
import { useToken } from "../../_utils/token-context";
import { fetchAlbumSearchResults } from "@/_utils/spotifyApi";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import AlbumPreview from "@/app/components/album-preview";
import Link from "next/link";

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, refreshToken } = useToken();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("query") || "";

    const fetchResults = useCallback(async () => {
        if (!searchQuery || !token) return;
        setLoading(true);
        try {
            const albums = await fetchAlbumSearchResults(searchQuery, token, refreshToken);
            setSearchResults(albums);
        } catch (error) {
            console.error("Error fetching search results:", error.message);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, token, refreshToken]);

    useEffect(() => {
        if (searchQuery && token) {
            fetchResults();
        }
    }, [searchQuery, token, fetchResults]);

  return (
    <div>
      <h1 className="mb-8">Showing Results for &quot;{searchQuery}&quot;</h1>

      {loading ? 
      (
        <p>Loading...</p>
      ) : searchResults.length > 0 ? 
      (
        <div className="flex flex-col gap-6 mt-6">
            {searchResults.map((result) => 
            (
                <div key={result.id}>
                    <div className="flex gap-4 items-center w-full">
                        <AlbumPreview album={result} size={128} />
                        <div className="flex flex-col gap-4 w-7/12 items-start">
                            <div className="flex gap-2 items-center">
                                <Link href={`/albums/${result.id}`}>
                                    <h2 className="text-lg font-bold">{result.name}</h2>
                                </Link>
                                <p className="text-gray-400">{result.release_date?.split("-")[0]}</p>
                            </div>
                            <Link href={`/artists/${result.artists[0].id}`}>
                                <p className="text-gray-400 bg-gray-800 p-1 rounded-md">{result.artists.map((artist) => artist.name).join(", ")}</p>
                            </Link>
                        </div>
                    </div>
                    <div className="border-b-2 border-gray-800 pt-6"></div>
                </div>
            ))}
        </div>
      ) : 
      (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResultsPage;