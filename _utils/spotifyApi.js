
export const fetchAlbumDetails = async (albumId, token, refreshToken) => {

    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            await refreshToken();
            return fetchAlbumDetails(albumId, token, refreshToken);
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch album details: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching album details:", error);
        throw error;
    }
};


export const fetchAlbumSearchResults = async (query, token, refreshToken) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album,track&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
    //   if (response.status === 401) {
    //     await refreshToken();
    //     return fetchAlbumSearchResults(query, token, refreshToken);
    //     }
    if (response.status === 401) {
        const newToken = await refreshToken();
        if (!newToken) {
            throw new Error("Failed to refresh token");
        }

        response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album,track&limit=5`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    }
    if (!response.ok) {
        throw new Error('Failed to fetch albums');
    }
    
    const data = await response.json();
    const albumsData = data.albums?.items;
    const albums = await Promise.all(
        albumsData.map(async (album) => {
            try {
                return await fetchAlbumDetails(album.id, token, refreshToken);
            } catch (error) {
                console.error(`Failed to fetch details for album ID ${album.id}:`, error);
                return null;
            }
        })
    );
      
      return albums;
};


export const fetchArtistDetails = async (artistId, token, refreshToken) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            // const newToken = await refreshToken();
            // if (!newToken) {
            //     throw new Error("Failed to refresh token");
            // }

            // response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            //     headers: {
            //         Authorization: `Bearer ${newToken}`,
            //     },
            // });
            
            if (response.status === 401) {
                await refreshToken();
                return fetchAlbumDetails(albumId, token, refreshToken);
            }
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch artist details: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching artist details:", error);
        throw error;
    }
}


export const fetchArtistAlbums = async (artistId, token, refreshToken) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            const newToken = await refreshToken();
            if (!newToken) {
                throw new Error("Failed to refresh token");
            }

            response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
                headers: {
                    Authorization: `Bearer ${newToken}`,
                },
            });
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch artist details: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching artist details:", error);
        throw error;
    }
}