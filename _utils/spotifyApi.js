

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
