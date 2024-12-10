"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { StaticRating } from "@/app/components/static-rating";
import Link from "next/link";
import { getAvgRating, getNumberOfRatings, getAlbumRank, getAlbumRankByYear, getReviewsByAlbum } from "../../../_services/review-service";
import { getProfilePic } from "../../../_services/user-service";
import { useUserAuth } from "@/_utils/auth";
import AlbumMenu from "@/app/components/album-menu";
import CircularImage from "@/app/components/circular-image";

const AlbumPage = () => {
    const { user } = useUserAuth
    const params = useParams();
    const albumId = params?.id;
    const [albumDetails, setAlbumDetails] = useState(null);
    const [artistDetails, setArtistDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [profilePics, setProfilePics] = useState([]);
    const [numberOfRatings, setNumberOfRatings] = useState(null);
    const [avgRating, setAvgRating] = useState(null);
    const [albumRank, setAlbumRank] = useState(null);
    const [albumRankByYear, setAlbumRankByYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const tableDataClass = "p-2";    

    useEffect(() => {
        if (!albumId) return;

        const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/spotify/albums/${albumId}`);
            if (!response.ok) {
            throw new Error("Failed to fetch album details and reviews");
            }
            const data = await response.json();
            setAlbumDetails(data.albumDetails);
            // const reviews = await getReviewsByAlbum(data.albumDetails.id);
            setReviews(data.reviews);
            // const avgRating = await getAvgRating(data.albumDetails.id);
            setNumberOfRatings(data.numberOfRatings);
            setAvgRating(data.avgRating);
            const albumRank = await getAlbumRank(data.albumDetails.id);
            setAlbumRank(albumRank);
            const albumRankByYear = await getAlbumRankByYear(data.albumDetails.id, data.albumDetails.release_date.split("-")[0]);
            setAlbumRankByYear(albumRankByYear);

            
            const promises = data.reviews.map(async (review) => {
                const photoURL = await getProfilePic(review.username);
                return { username: review.username, url: photoURL };
            });
        
            const results = await Promise.all(promises);
            setProfilePics(results);
            // const reviews = await getReviewsByAlbum(data.albumDetails.id);
            // setReviews(reviews);
            // const avgRating = await getAvgRating(data.albumDetails.id);
            // setAvgRating(avgRating);
            // const albumRank = await getAlbumRank(data.albumDetails.id);
            // setAlbumRank(albumRank);
            // const albumRankByYear = await getAlbumRankByYear(data.albumDetails.id, data.albumDetails.release_date.split("-")[0]);
            // setAlbumRankByYear(albumRankByYear);


            const artistResponse = await fetch(`/api/spotify/artists/${data.albumDetails.artists[0].id}`);
            if (!artistResponse.ok) {
                throw new Error("Failed to fetch artist details");
            }
            const artistData = await artistResponse.json();
            setArtistDetails(artistData.artistDetails);
        } catch (error) {
            console.error("Error loading album:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [albumId]);

  
    const getDate = (date) => {
        const unformattedDate = new Date(date + "T00:00:00");
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(unformattedDate);
        return formattedDate; 
    }

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function GetFeatures({ artists }) {
        const features = artists.slice(1);
        return features.map((artist) => artist.name).join(", ");
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


    function ReviewList({ reviews }) {
        const getPhotoURL = async (username) => {
            try {
                const photoURL = await getProfilePic(username); 
                return photoURL;
            } catch (error) {
                console.error("Error fetching profile picture:", error);
                return null;
            }
        };

        return (
            <div className="mt-16">
                <h1 className="text-xl">Recent Reviews</h1>
                <div className="border-b-2 border-gray-600"></div>
                <div className="flex flex-col gap-6 mt-6">
                    {reviews.length > 0 ? 
                    (
                        reviews.slice(0, 4).map((review) => {
                            return (
                                <div key={review.id} className="flex gap-4 border-b-2 border-gray-600 pb-2">
                                    <div className="flex flex-col gap-2 w-12">
                                        <div className="flex gap-2">
                                            {profilePics ? (
                                                <CircularImage src={profilePics.find(item => item.username === review.username)?.url} alt={`${review.username}'s profile`} size={50} />
                                            ) : (
                                                <span className="text-white font-bold">{review.username}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex gap-2">
                                            <span className="text-white font-bold">
                                                <span className="text-gray-500 font-light">Review by </span> 
                                                <span className="font-normal">{review.username}</span>
                                            </span>
                                            <StaticRating color="fill-green-500" rating={review.rating} />
                                        </div>
                                        <span className="text-gray-400 break-words text-wrap">{review.text.length > 235 ? `${review.text.slice(0, 235)}...` : review.text}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : 
                    (
                        <p>No reviews yet</p>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div>
            {loading ? (
            <p>Loading...</p>
            ) : albumDetails ? 
            (
                <div className="flex gap-8">
                    <div className="flex flex-col gap-8">
                        <div className="shadow-2xl">
                            <Image className="rounded-sm" width={359} height={359}  src={albumDetails.images[0].url} alt={albumDetails.name} />
                        </div>

                        <div className="border-b-2 border-gray-700"></div>

                        {albumDetails.tracks?.items.length > 0 &&
                            <div>
                                <h2 className="text-xl mb-4">Track listing</h2>
                                <div className="flex flex-col border- border-gray-600 text-sm">
                                    {albumDetails.tracks.items.map((track, index) => (
                                        <div key={track.id} className={`flex gap-2 p-4 ${index % 2 == 0 ? "" : "bg-neutral-900"}`}>
                                            <span className="text-gray-400 mr-4">{index + 1}</span>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex gap-2">
                                                    <span className="text-gray-400 font-bold">{FormatTrackName(track.name)}</span>
                                                    <span className="text-gray-500">{formatTime(track.duration_ms)}</span>
                                                </div>
                                                {track.artists.length > 1 && 
                                                (
                                                    <div>
                                                        <span className="text-gray-200">feat.</span>
                                                        {track.artists.slice(1).map((artist, index) => 
                                                        (
                                                            <Link key={artist.id} href={`/artists/${artist.id}`}>
                                                                <span className="text-green-600 hover:text-green-300 font-semibold ml-1">
                                                                    {artist.name}
                                                                </span>
                                                                <span className="text-gray-200">
                                                                    {index < track.artists.length - 2 ? "," : ""}
                                                                </span>
                                                            </Link>
                                                        )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>

                    <div className="flex-1 flex flex-col gap-4">

                        <div>
                            <h1 className="text-3xl">{albumDetails.name}</h1>
                            <div className="border-b-2 border-gray-600"></div>
                        </div>

                        <table className="text-gray-400">
                            <tbody className="space-y-4">
                                <tr>
                                    <td className={tableDataClass}>{albumDetails.artists.length > 1 ? "Artists" : "Artist"}</td>
                                    <td className={tableDataClass}>
                                        {/* <Link className="text-green-600 hover:text-green-300 font-bold" href={`/artists/${albumDetails.artists[0].id}`}>
                                            {albumDetails.artists.map((artist) => artist.name).join(", ")}
                                        </Link> */}
                                        
                                        {albumDetails.artists.map((artist, index) => 
                                        (
                                            <Link key={artist.id} href={`/artists/${artist.id}`}>
                                                <span className="text-green-600 hover:text-green-300 font-semibold ml-1">
                                                    {artist.name}
                                                </span>
                                                <span className="text-gray-200">
                                                    {index < albumDetails.artists.length - 1 ? "," : ""}
                                                </span>
                                            </Link>
                                        )
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={tableDataClass}>Type</td>
                                    <td className={tableDataClass + " capitalize"}>
                                        {albumDetails.album_type}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={tableDataClass}>Released</td>
                                    <td className={tableDataClass}>
                                        {getDate(albumDetails.release_date)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={tableDataClass}>EchoRate Rating</td>
                                    <td className={tableDataClass}>
                                        {avgRating ? 
                                        (
                                            <span className="text-white font-bold text-xl">{avgRating}</span>
                                        ) : 
                                        (
                                            <span>--</span>
                                        )}
                                        <span> / 5.0 from {numberOfRatings ? numberOfRatings : "0"} {numberOfRatings?.length === 1 ? "rating" : "ratings"}</span>
                                    </td>
                                </tr>

                                {albumRank !== null && albumRank !== 0 && numberOfRatings !== 0 ? 
                                (
                                    <tr>
                                        <td className={tableDataClass}>Ranked</td>
                                        <td className={tableDataClass}>
                                            <span className="text-white font-bold text-xl">#{albumRank}</span>
                                            <span> overall,</span>
                                            <span className="text-white font-bold text-xl ml-3">#{albumRankByYear}</span>
                                            <span> for {albumDetails.release_date.split("-")[0]}</span>
                                        </td>
                                    </tr>
                                ) :
                                (
                                    <tr></tr>
                                )}
                                
                                <tr>
                                    <td className={tableDataClass}>Genres</td>
                                    <td className={tableDataClass + " capitalize"}>
                                        {artistDetails.genres && artistDetails.genres.length > 0 && artistDetails.genres[0] !== "" 
                                        ? (
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{artistDetails.genres[0]}</span>
                                                <span>{artistDetails.genres.slice(1).map((genre) => genre).join(", ")}</span>
                                            </div>
                                        ) 
                                        : "N/A"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <ReviewList reviews={reviews}/>
                    </div>

                    <AlbumMenu album={albumDetails} size={200} />

                </div>
            ) : 
            (
                <p>Loading...</p>
            )}
        </div>
    );
};

  export default AlbumPage;
