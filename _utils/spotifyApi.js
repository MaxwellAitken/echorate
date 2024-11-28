
export const fetchAlbumDetails = async (albumId, token, refreshToken) => {

    try {
        const response = await fetch(`/api/spotify/albums/${albumId}`, {
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
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album,track&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
    
      const data = await response.json();
      return data.albums.items; // Returns list of albums


};
