"use client"
import React, { useEffect, useState } from 'react';

const ArtistInfo = ({ artistId }) => {
	const [artistData, setArtistData] = useState(null);
	
	useEffect(() => {
		const fetchArtist = async () => {
			try {
				const response = await fetch(`/api/spotify/artist?artistId=${artistId}`);
				
				if (!response.ok) {
					console.error('Error: ', response.status, await response.text());
					return;
				}
				
				const data = await response.json();
				setArtistData(data);
			} catch (error) {
				console.error('Error fetching artist:', error.message);
			}
		};
		fetchArtist();
	}, [artistId]);
	
	return (
		<div>
		{artistData ? (
			<div>
				{/* <h2>{artistData.name}</h2> */}
					{/* <p>Artist: {artistData.artists.map(artist => artist.name).join(', ')}</p> */}
					<ul>
						{artistData.items.map(album => (
							<li key={album.id}>{album.name} id: {album.id}</li>
						))}
					</ul>
				{/* <img src={artistData.images[0].url} alt={artistData.name} /> */}
			</div>
		) : (
			<p>Loading...</p>
		)}
		</div>
	);
};

export default ArtistInfo;
