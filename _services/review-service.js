import { fetchAlbumDetails } from "@/_utils/spotifyApi";
import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query, where, doc, setDoc, deleteDoc, runTransaction, getDoc, orderBy, limit } from "firebase/firestore";


// Get all reviews for a user
export async function getUserReviews(username){
    try {

        const publicProfilesRef = collection(db, "publicProfiles");
        const q = query(publicProfilesRef, where("username", "==", username.toLowerCase()));
        const querySnapshot = await getDocs(q);
        let userId = "";
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                userId = doc.id;
            });
        }

        const allReviews = collection(db, "publicProfiles", userId, "reviews");
        const allReviewsQuery = query(allReviews);
        const allReviewsSnapshot = await getDocs(allReviewsQuery);

        let reviewList = [];
        allReviewsSnapshot.forEach((doc) => {
            let thisReview = {
                id: doc.id,
                ...doc.data()
            };
            reviewList.push(thisReview);
        });
        return reviewList;
    } catch (error) {
        console.error(error);
    }
}

// Get all reviews for an album
export async function getReviewsByAlbum(albumId){
    try {
        const allReviews = collection(db, "reviews", albumId, "albumReviews");
        const allReviewsQuery = query(allReviews);
        const allReviewsSnapshot = await getDocs(allReviewsQuery);

        let reviewList = [];

        allReviewsSnapshot.forEach((doc) => {
            let thisReview = {
                id: doc.id,
                ...doc.data()
            };
            reviewList.push(thisReview);
        });
        return reviewList;
    } catch (error) {
        console.error(error);
    }
}

export async function getAllReviews() {
    try {
        const reviewsCollectionRef = collection(db, "reviews");
        const reviewsSnapshot = await getDocs(reviewsCollectionRef);

        const allReviews = [];

        for (const albumDoc of reviewsSnapshot.docs) {
            const albumId = albumDoc.id;
            const albumReviewsRef = collection(db, "reviews", albumId, "albumReviews");
            // const albumReviewsSnapshot = await getDocs(albumReviewsRef);

            const q = query(albumReviewsRef, orderBy("date", "desc"), limit(6));
            const albumReviewsSnapshot = await getDocs(q);

            albumReviewsSnapshot.forEach((reviewDoc) => {
                allReviews.push({
                    albumId,
                    reviewId: reviewDoc.id,
                    ...reviewDoc.data(),
                });
            });
        }
        allReviews.sort((a, b) => b.date - a.date);
        return allReviews.slice(0, 6);
        // return allReviews;
    } catch (error) {
        console.error("Error fetching all reviews:", error);
    }
}

export async function getPopularAlbums() {
    try {
        const ratingsRef = collection(db, "ratings");
        const ratingsQuery = query(ratingsRef, orderBy("totalRatings", "desc"));
        const ratingsSnapshot = await getDocs(ratingsQuery);

        const popularAlbums = [];

        for (const albumDoc of ratingsSnapshot.docs) {

            const response = await fetch(`/api/spotify/albums/${albumDoc.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch album details and reviews");
            }
            const data = await response.json();
            const albumDetails = data.albumDetails;
            popularAlbums.push({
                ...albumDetails,
                id: albumDoc.id,
                totalRatings: albumDoc.data().totalRatings,
            });
        };
        popularAlbums.sort((a, b) => b.totalRatings - a.totalRatings);
        return popularAlbums.slice(0, 4);
    } catch (error) {
        console.error("Error fetching popular albums:", error);
    }
}



// Add a review to a user's profile
export async function addReviewToUser(userId, review) {
    try {
        const newReviewReference = collection(db, "publicProfiles", userId, "reviews");
        await addDoc(newReviewReference, review);

        const newPrivateReviewReference = collection(db, "users", userId, "reviews");
        await addDoc(newPrivateReviewReference, review);

        let rating = {
            username: review.username,
            album: review.album,
            rating: review.rating,
            date: review.date,
        };
        await addRatingToUser(userId, rating);
    } catch (error){
        console.error(error);
    }
}


// Add a review to an album
export async function addReviewToAlbum(userId, albumId, review) {
    try {
        const newReviewReferenceA = doc(db, "reviews", albumId);
        await setDoc(newReviewReferenceA, review);

        const newReviewReference = collection(db, "reviews", albumId, "albumReviews");
        await addDoc(newReviewReference, review);
        let rating = {
            username: review.username,
            album: review.album,
            rating: review.rating,
            date: review.date,
        };
        await addRatingToAlbum(userId, albumId, rating);
    } catch (error){
        console.error(error);
    }
}


// Add a rating to a user's profile
export async function addRatingToUser(userId, rating) {
    try {
        const newRatingReference = doc(db, "publicProfiles", userId, "ratings", rating.album.id);
        await setDoc(newRatingReference, rating);

        const newPrivateRatingReference = doc(db, "users", userId, "ratings", rating.album.id);
        await setDoc(newPrivateRatingReference, rating);
    } catch (error){
        console.error(error);
    }
}


// Add a rating to an album
// export async function addRatingToAlbum(userId, albumId, rating) {
//     try {
//         const newRatingReference = doc(db, "ratings", albumId, "albumRatings", userId);
//         await setDoc(newRatingReference, rating, { merge: true });
//     } catch (error){
//         console.error(error);
//     }
// }
export async function addRatingToAlbum(userId, albumId, rating) {
    try {
        const albumRef = doc(db, "ratings", albumId);
        const userRatingRef = doc(db, "ratings", albumId, "albumRatings", userId);

        await runTransaction(db, async (transaction) => {
            const albumDoc = await transaction.get(albumRef);

            let avgRating = 0;
            let totalRatings = 0;

            if (albumDoc.exists()) {
                const data = albumDoc.data();
                avgRating = data.avgRating || 0;
                totalRatings = data.totalRatings || 0;
            }

            const userRatingDoc = await transaction.get(userRatingRef);
            let previousRating = 0;

            if (userRatingDoc.exists()) {
                previousRating = userRatingDoc.data().rating.rating;
            }

            const newTotalRatings = previousRating ? totalRatings : totalRatings + 1;
            const newAvgRating = previousRating
                ? avgRating + (rating.rating - previousRating) / newTotalRatings
                : (avgRating * totalRatings + rating.rating) / newTotalRatings;

            transaction.set(albumRef, {
                avgRating: parseFloat(newAvgRating.toFixed(2)),
                totalRatings: newTotalRatings,
                releaseYear: rating.album.release_date.split("-")[0],
            }, { merge: true });

            transaction.set(userRatingRef, { rating }, { merge: true });
        });
    } catch (error) {
        console.error("Error adding rating:", error);
    }
}


export async function deleteRatingFromUser(userId, albumId) {
    const newRatingReference = doc(db, "publicProfiles", userId, "ratings", albumId);
    await deleteDoc(newRatingReference);

    const newPrivateRatingReference = doc(db, "users", userId, "ratings", albumId);
    await deleteDoc(newPrivateRatingReference);

}

// export async function deleteRatingFromAlbum(userId, albumId) {
//     const newRatingReference = doc(db, "ratings", albumId, "albumRatings", userId);
//     await deleteDoc(newRatingReference);
// }
export async function deleteRatingFromAlbum(userId, albumId) {
    const albumRef = doc(db, "ratings", albumId);
    const userRatingRef = doc(db, "ratings", albumId, "albumRatings", userId);

    try {
        await runTransaction(db, async (transaction) => {
            const albumDoc = await transaction.get(albumRef);
            const userRatingDoc = await transaction.get(userRatingRef);

            if (!albumDoc.exists() || !userRatingDoc.exists()) {
                throw new Error("Album or user rating does not exist.");
            }

            const albumData = albumDoc.data();
            const userRating = userRatingDoc.data().rating.rating;

            const totalRatings = albumData.totalRatings || 0;
            const avgRating = albumData.avgRating || 0;

            const newTotalRatings = totalRatings - 1;
            const newAvgRating = 
                newTotalRatings > 0 
                ? ((avgRating * totalRatings) - userRating) / newTotalRatings
                : 0;

            transaction.set(
                albumRef,
                {
                    avgRating: parseFloat(newAvgRating.toFixed(2)),
                    totalRatings: newTotalRatings,
                },
                { merge: true }
            );

            transaction.delete(userRatingRef);
        });
    } catch (error) {
        console.error("Error deleting rating:", error);
    }
}



// Get average rating for an album
export async function getAvgRating(albumId){
    try {
        const albumRef = doc(db, "ratings", albumId);

        const albumDoc = await getDoc(albumRef);

        if (albumDoc.exists()) {
            const data = albumDoc.data();
            return data.avgRating;
        } else {
            console.warn(`No album found with ID: ${albumId}`);
            return null;
        }
    } catch (error) {
        console.error("Error getting average rating:", error);
        return null;
    }
}

export async function getNumberOfRatings(albumId){
    try {
        const albumRef = doc(db, "ratings", albumId);

        const albumDoc = await getDoc(albumRef);
        if (albumDoc.exists()) {
            const data = albumDoc.data();
            return data.totalRatings;
        } else {
            console.warn(`No album found with ID: ${albumId}`);
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getAlbumRank(albumId) {
    try {
        const ratingsRef = collection(db, "ratings");
        const albumsSnapshot = await getDocs(ratingsRef);

        const albumRatings = albumsSnapshot.docs.map((doc) => ({
            albumId: doc.id,
            avgRating: doc.data().avgRating || 0,
        }));

        albumRatings.sort((a, b) => b.avgRating - a.avgRating);
        const rank = albumRatings.findIndex((album) => album.albumId === albumId) + 1;

        return rank;
    } catch (error) {
        console.error("Error getting album rank:", error);
        return null;
    }
}

export async function getAlbumRankByYear(albumId, year) {
    try {
        const ratingsRef = collection(db, "ratings");

        const albumsSnapshot = await getDocs(ratingsRef);

        const albumRatings = albumsSnapshot.docs
            .map((doc) => ({
                albumId: doc.id,
                avgRating: doc.data().avgRating || 0,
                releaseYear: doc.data().releaseYear,
            }))
            .filter((album) => album.releaseYear === year);

        if (albumRatings.length === 0) {
            console.warn(`No albums found for year: ${year}`);
            return null;
        }

        albumRatings.sort((a, b) => b.avgRating - a.avgRating);

        const rank = albumRatings.findIndex((album) => album.albumId === albumId) + 1;
        return rank || null; 
    } catch (error) {
        console.error("Error getting album rank by year:", error);
        return null;
    }
}
