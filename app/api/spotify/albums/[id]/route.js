import axios from 'axios';
const cache = new Map();

export async function GET(req, { params }) {

    const { id } = params;
    const token = req.headers.get('authorization');

    if (cache.has(id)) {
        return new Response(JSON.stringify(cache.get(id)), { status: 200 });
      }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        const albumData = response.data;

        cache.set(id, albumData);
        setTimeout(() => cache.delete(id), 60 * 60 * 1000); // Cache expires after 1 hour
    

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching album:', error.message);
        return new Response(JSON.stringify({ error: 'Error fetching album' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
