"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlbumProvider, useAlbum } from '../../../_utils/album-context';
import { fetchAlbumDetails } from '../../../_utils/spotifyApi';
import { useToken } from '../../../_utils/token-context';
import { getReviewsByAlbum } from "../../../_services/review-service";
import Image from 'next/image';
import { StaticRating } from '@/app/components/static-rating';

const AlbumPage = () => {
    const params = useParams();
    const albumId = params?.id;
    const { getAlbum } = useAlbum();
    const [albumDetails, setAlbumDetails] = useState(null);
    const { token, refreshToken } = useToken();
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
        

    useEffect(() => {
        if (!albumId) return;
        const fetchData = async () => {
            try {
                const album = await fetchAlbumDetails(albumId, token, refreshToken);
                setAlbumDetails(album);
            } catch (error) {
                console.error("Error loading album:", error);
            }
        };
        fetchData();
    }, [albumId, getAlbum, token, refreshToken]);


    
    async function loadReviews(){
        try {
            const reviews = await getReviewsByAlbum(albumDetails.id);
            setReviews(reviews);
            setAvgRating(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (albumDetails) {
            loadReviews();
        }
    }, [albumDetails]);



    
    return (
        <AlbumProvider>
        <div className='mt-12 ml-16 text-2xl'>
            {albumDetails ? (
            <div>
                <h1>{albumDetails.name}</h1>
                <p className='italic text-xl'>{albumDetails.artists.map((artist) => artist.name).join(", ")}</p>
                <Image width={196} height={196} className='max-h-96' src={albumDetails.images[0].url} alt={albumDetails.name} />

                <div>
                    <p>Release date: {albumDetails.release_date}</p>
                    <p>Popularity: {albumDetails.popularity}</p>
                    <p>Average rating: {avgRating}</p>
                </div>
                {reviews.length > 0 ? 
                (
                    <div>
                        {reviews.map((review) => (
                            <div className="bg-gray-700 p-8" key={review.id}>
                                <div className="result-item text-center">
                                </div>
                                
                                <div>
                                    <StaticRating rating={review.rating} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : 
                (
                    <p>No reviews found.. Be the first</p>
                )}
            </div>
            ) : (
            <p>Loading...</p>
            )}
        </div>
         </AlbumProvider>
    );
};

  export default AlbumPage;
