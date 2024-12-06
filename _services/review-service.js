import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query, where, doc, setDoc } from "firebase/firestore";


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
        };
        await addRatingToUser(userId, rating);
    } catch (error){
        console.error(error);
    }
}


// Add a review to an album
export async function addReviewToAlbum(userId, albumId, review) {
    try {
        const newReviewReference = collection(db, "reviews", albumId, "albumReviews");
        await addDoc(newReviewReference, review);
        let rating = {
            username: review.username,
            album: review.album,
            rating: review.rating
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
export async function addRatingToAlbum(userId, albumId, rating) {
    try {
        const newRatingReference = doc(db, "ratings", albumId, "albumRatings", userId);
        await setDoc(newRatingReference, rating, { merge: true });
    } catch (error){
        console.error(error);
    }
}
