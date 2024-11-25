import axios from 'axios';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const artistId = searchParams.get('artistId');
    
    if (!artistId) {
        return new Response(JSON.stringify({ error: 'Missing artistId parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    try {
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/token`);
        const { token } = await tokenResponse.json();
        const spotifyResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return new Response(JSON.stringify(spotifyResponse.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching artist:', error.message);
        return new Response(JSON.stringify({ error: 'Error fetching artist' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
