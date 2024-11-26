"use client";

import { useState, useEffect } from "react";
import { useToken } from "../../_utils/token-context";
import Image from "next/image";

const PopularTracks = () => {
    const { token } = useToken();  // Using the token from context
    const [popTracks, setPopTracks] = useState([]);
    const [loading, setLoading] = useState(true);  // Track loading state
    const [error, setError] = useState(null);  // Track error state

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                // Make the API request to fetch the playlist tracks
                const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error fetching popular tracks: ${response.statusText}`);
                }

                const data = await response.json();
                setPopTracks(data.items);  // Extract tracks from response
                setLoading(false);  // Update loading state after data is fetched
            } catch (error) {
                setError(error.message);  // Set error message
                setLoading(false);  // Update loading state
            }
        };

        if (token) {
            fetchTracks();  // Only fetch tracks when a valid token is available
        }
    }, [token]);  // Dependency on token to refetch if token changes

    return (
        <div>
            <h1 className="text-3xl font-bold">Popular Tracks</h1>
            
            {loading ? (
                <p>Loading tracks...</p>  // Show loading message while fetching
            ) : error ? (
                <p className="text-red-500">{error}</p>  // Show error message if something goes wrong
            ) : popTracks.length > 0 ? (
                <div className="flex flex-wrap gap-8">
                    {popTracks.map((track) => (
                        <div key={track.track.id} className="flex flex-col items-center max-w-xs">
                            <Image width={96} height={96}
                                className="max-h-48 object-cover rounded-lg"
                                src={track.track.album.images[0]?.url}
                                alt={track.track.name}
                            />
                            <div className="text-center mt-2">
                                <h2 className="text-lg font-semibold">{track.track.name}</h2>
                                <p className="text-sm text-gray-500">{track.track.artists[0].name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No tracks found</p>
            )}
        </div>
    );
};

export default PopularTracks;
