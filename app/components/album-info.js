"use client"
import React, { useEffect, useState } from 'react';

const AlbumInfo = ({ albumId }) => {
	const [albumData, setAlbumData] = useState(null);
	
	useEffect(() => {
		const fetchAlbum = async () => {
			try {
                const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/token`);
                const { token } = await tokenResponse.json();
				const response = await fetch(`/api/spotify/albums/${albumId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
				
				if (!response.ok) {
					console.error('Error: ', response.status, await response.text());
					return;
				}
				
				const data = await response.json();
				setAlbumData(data);
			} catch (error) {
				console.error('Error fetching album:', error.message);
			}
		};
		fetchAlbum();
	}, [albumId]);
	
	return (
		<div>
		{albumData ? (
			<div>
				<h2>{albumData.name}</h2>
				<img className='max-h-96' src={albumData.images[0].url} alt={albumData.name} />
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
