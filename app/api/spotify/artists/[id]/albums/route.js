import { fetchArtistAlbums } from "../../../../../../_utils/spotifyApi";
import { getToken } from "@/_services/token-service";

export async function GET(req, { params }) {
  const { id: artistId } = params;

  if (!artistId) {
    return new Response(JSON.stringify({ error: "Artist ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const token = await getToken();
    const artistAlbums = await fetchArtistAlbums(artistId, token);


    return new Response(
      JSON.stringify({
        artistAlbums,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching artist or reviews:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
