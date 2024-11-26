"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAlbumDetails } from '../../_utils/spotifyApi';
import { useToken } from '../../_utils/token-context';
import Image from 'next/image';

const AlbumInfo = ({ albumId }) => {
	const [albumData, setAlbumData] = useState(null);
    const { token, refreshToken } = useToken();

	useEffect(() => {
		const fetchAlbum = async () => {
			try {
                const album = await fetchAlbumDetails(albumId, token, refreshToken);
                setAlbumData(album);
			} catch (error) {
				console.error('Error fetching album:', error.message);
			}
		};
        if (token){
            fetchAlbum();
        }
	}, [albumId, token, refreshToken]);
	

	return (
		<div>
		{albumData ? (
			<div>
				<h2>{albumData.name}</h2>
                <Link href={`/albums/${albumData.id}`}>
				    <Image width={96} height={96} className='max-h-96' src={albumData.images[0].url} alt={albumData.name} />
                </Link>
				<p>Artist: {albumData.artists.map(artist => artist.name).join(', ')}</p>
				<ul>
					{albumData.tracks.items.map(track => (
						<li key={track.id}>{track.name}</li>
					))}
				</ul>
			</div>
		) : (
			<p>Loading...</p>
		)}
		</div>
	);
};

export default AlbumInfo;
