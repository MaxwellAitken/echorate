import axios from 'axios';

export async function GET() {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        return new Response(JSON.stringify({ error: 'Missing CLIENT_ID or CLIENT_SECRET' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                },
            }
        );
        
        return new Response(JSON.stringify({ token: response.data.access_token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching Spotify token:', error.message);
        return new Response(JSON.stringify({ error: 'Error fetching token' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
