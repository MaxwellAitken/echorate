import { fetchAlbumDetails } from "../../../../../_utils/spotifyApi";
import { getReviewsByAlbum, getNumberOfRatings } from "../../../../../_services/review-service";
import { getToken } from "@/_services/token-service";

export async function GET(req, { params }) {
  const { id: albumId } = params;

  if (!albumId) {
    return new Response(JSON.stringify({ error: "Album ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const token = await getToken();
    const albumDetails = await fetchAlbumDetails(albumId, token);

    const reviews = await getReviewsByAlbum(albumId);
    const numberOfRatings = await getNumberOfRatings(albumId);
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : null;

    return new Response(
      JSON.stringify({
        albumDetails,
        reviews,
        avgRating,
        numberOfRatings,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching album or reviews:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
