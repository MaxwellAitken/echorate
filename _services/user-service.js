import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query, where, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";


// Get user data
export async function getUser(username){
    try {
        const publicProfilesRef = collection(db, "publicProfiles");
        const q = query(publicProfilesRef, where("username", "==", username.toLowerCase()));
        const querySnapshot = await getDocs(q);
        let user = {};
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                user = {
                    id: doc.id,
                    ...doc.data()
                };
            });
        }

        const reviewsRef = collection(db, "publicProfiles", user.id, "reviews");
        const reviewsQuerySnapshot = await getDocs(reviewsRef);
        const reviews = reviewsQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        user.reviews = reviews;

        const ratingsRef = collection(db, "publicProfiles", user.id, "ratings");
        const ratingsQuerySnapshot = await getDocs(ratingsRef);
        const ratings = ratingsQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        user.ratings = ratings;

        return user;
    } catch (error) {
        console.error(error);
    }
}


export async function updateUserProfile(userId, newProfile){
    try {
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, {
            bio: newProfile.bio,
            photoURL: newProfile.profilePic,
            favoriteAlbums: newProfile.favoriteAlbums,
            queue: newProfile.queue,
        }, { merge: true });

        const publicUserDoc = doc(db, "publicProfiles", userId);

        await setDoc(publicUserDoc, {
            bio: newProfile.bio,
            photoURL: newProfile.profilePic,
            favoriteAlbums: newProfile.favoriteAlbums,
            queue: newProfile.queue,
        }, { merge: true });
    } catch (error) {
        console.error(error);
    }
}


export async function getProfilePic(username) {
    try {
        const usersRef = collection(db, "publicProfiles");
        const usernameQuery = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(usernameQuery);

        if (querySnapshot.empty) {
            console.warn("No user found with the specified username.");
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        return userData.photoURL;
    } catch (error) {
        console.error("Error retrieving photoURL:", error);
        return null;
    }
}

export async function updateUserQueue(userId, newQueue){
    try {
        const userDoc = doc(db, "users", userId);
        await updateDoc(userDoc, {
            queue: newQueue,
        });

        const publicUserDoc = doc(db, "publicProfiles", userId);
        await updateDoc(publicUserDoc, {
            queue: newQueue,
        });
    } catch (error) {
        console.error(error);
    }
}


