import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query, where, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";


// Get user data
export async function getUser(username){
    try {
        const publicProfilesRef = collection(db, "publicProfiles");
        const q = query(publicProfilesRef, where("username", "==", username.toLowerCase()));
        const querySnapshot = await getDocs(q);
        let user = "";
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                user = {
                    id: doc.id,
                    ...doc.data()
                };
            });
        }

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


