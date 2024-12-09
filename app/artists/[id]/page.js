"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { StaticRating } from "@/app/components/static-rating";
import Link from "next/link";
import { getAvgRating, getNumberOfRatings, getArtistRank, getArtistRankByYear, getReviewsByArtist } from "../../../_services/review-service";
import { useUserAuth } from "@/_utils/auth";

const ArtistPage = () => {
    const { user } = useUserAuth
    const params = useParams();
    const artistId = params?.id;
    const [artistDetails, setArtistDetails] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState(null);
    const [loading, setLoading] = useState(true);
    const tableDataClass = "p-2";    

    useEffect(() => {
        if (!artistId) return;

        const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/spotify/artists/${artistId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch artist details");
            }
            const data = await response.json();
            setArtistDetails(data.artistDetails);
            
            const albumsResponse = await fetch(`/api/spotify/artists/${artistId}/albums`);
            if (!albumsResponse.ok) {
                throw new Error("Failed to fetch artist albums");
            }
            const albumsData = await albumsResponse.json();
            setArtistAlbums(albumsData.artistAlbums.items);

        } catch (error) {
            console.error("Error loading artist:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [artistId]);

  
    const getDate = (date) => {
        const unformattedDate = new Date(date + "T00:00:00");
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(unformattedDate);
        return formattedDate; 
    }


    function FormatTrackName(name) {
        const featKeywords = [
            " (feat.", " (with", " (and", " (vs", " (vs.", " (ft.", " (ft", " (featuring", " (featuring."
        ];
        const featIndex = featKeywords
        .map(keyword => name.indexOf(keyword))
        .filter(index => index !== -1)
        .sort((a, b) => a - b)[0];

        if (featIndex !== undefined) {
            return name.slice(0, featIndex);
        }
        return name.length > 35 ? `${name.slice(0, 35)}...` : name;
    }



    return (
        <div>
            {loading ? (
            <p>Loading...</p>
            ) : artistDetails ? 
            (
                <div className="flex flex-col gap-8">
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-8">
                            <div className="shadow-2xl">
                                <Image width={359} height={359}  src={artistDetails.images[0].url} alt={artistDetails.name} />
                            </div>
                            {/* <div className="border-b-2 border-gray-700"></div> */}
                        </div>

                        <div className="flex-1 flex flex-col gap-4">

                            <div>
                                <h1 className="text-3xl">{artistDetails.name}</h1>
                                <div className="border-b-2 border-gray-600"></div>
                            </div>

                            <table className="text-gray-400">
                                <tbody className="space-y-4">
                                    <tr>
                                        <td className={tableDataClass}>Type</td>
                                        <td className={tableDataClass + " capitalize"}>
                                            {artistDetails.type}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className={tableDataClass}>Genres</td>
                                        <td className={tableDataClass + " capitalize"}>
                                            {artistDetails.genres && artistDetails.genres.length > 0 && artistDetails.genres[0] !== "" 
                                            ? (
                                                <span>{artistDetails.genres.map((genre) => genre).join(", ")}</span>
                                            ) 
                                            : "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div className="flex flex-col gap-4">
                        {artistAlbums.length > 0 &&
                            <div>
                                <h2 className="text-xl mb-4">Discography</h2>
                                <div className="flex flex-col border- border-gray-600 text-sm">
                                    {artistAlbums.map((album, index) => (
                                        <div key={album.id} className={`flex gap-2 p-4`}>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex gap-2">
                                                    <Image className="rounded-sm" width={64} height={64} src={album.images[0].url} alt={album.name} />
                                                    <div className="flex flex-col">
                                                        <Link href={`/albums/${album.id}`}>
                                                            <span className="font-semibold hover:text-green-300">{album.name}</span>
                                                        </Link>
                                                        <span className="text-gray-400">{getDate(album.release_date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>

                </div>
            ) : 
            (
                <p>Loading...</p>
            )}
        </div>
    );
};

  export default ArtistPage;
