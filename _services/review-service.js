import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export async function getReviews(userId){
    try {
        const allReviews = collection(db, "users", userId, "reviews");
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









export async function addReviewToUser(userId, review) {
    try {
        const newReviewReference = collection(db, "users", userId, "reviews");
        await addDoc(newReviewReference, review);
    } catch (error){
        console.error(error);
    }
}




export async function addReviewToAlbum(albumId, review) {
    try {
        const newReviewReference = collection(db, "reviews", albumId, "albumReviews");
        await addDoc(newReviewReference, review);
    } catch (error){
        console.error(error);
    }
}
