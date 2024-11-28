"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlbumProvider, useAlbum } from '../../../_utils/album-context';
import { fetchAlbumDetails } from '../../../_utils/spotifyApi';
import { useToken } from '../../../_utils/token-context';
import Image from 'next/image';

const AlbumPage = () => {
    const params = useParams();
    const albumId = params?.id;
    const { getAlbum } = useAlbum();
    const [albumDetails, setAlbumDetails] = useState(null);
    const { token, refreshToken } = useToken();
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
    
    return (
        <AlbumProvider>
        <div className='mt-12 ml-16 text-2xl'>
            {albumDetails ? (
            <>
                <h1>{albumDetails.name}</h1>
                <p>Artists: {albumDetails.artists.map((artist) => artist.name).join(", ")}</p>
                <Image width={196} height={196} className='max-h-96' src={albumDetails.images[0].url} alt={albumDetails.name} />
            </>
            ) : (
            <p>Loading...</p>
            )}
        </div>
         </AlbumProvider>
    );
};

  export default AlbumPage;
