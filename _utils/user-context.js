"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, collection, query, getDocs, onSnapshot } from "firebase/firestore";
import { useUserAuth } from "./auth";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const { user } = useUserAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user-specific data
    const fetchUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
        }
    };

    // const fetchUserReviews = async (uid) => {
    //     try {
    //         const reviewsRef = collection(db, "users", uid, "reviews");
    //         const reviewsQuery = query(reviewsRef);
    //         const reviewsSnapshot = await getDocs(reviewsQuery);
    //         const reviews = reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //         setUserData((prev) => ({ ...prev, reviews }));
    //     } catch (error) {
    //         console.error("Error fetching user reviews:", error.message);
    //     }
    // };
    // // Fetch user ratings from Firestore
    // const fetchUserRatings = async (uid) => {
    //     try {
    //         const allRatings = collection(db, "users", uid, "ratings");
    //         const allRatingsQuery = query(allRatings);
    //         const allRatingsSnapshot = await getDocs(allRatingsQuery);
    //         const ratings = allRatingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //         setUserData(prev => ({ 
    //             ...prev,
    //             ratings
    //         }));
    //     } catch (error) {
    //         console.error("Error fetching user data:", error.message);
    //     }
    // };

    useEffect(() => {
        if (!user) {
            setUserData(null);
            setLoading(false);
            return;
        }

        // Listen for changes to the user's main document
        const unsubscribeMain = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            if (docSnap.exists()) {
                setUserData((prev) => ({ ...prev, ...docSnap.data() }));
            }
        });

        // Listen for changes to the user's reviews
        const unsubscribeReviews = onSnapshot(
            collection(db, "users", user.uid, "reviews"),
            (querySnapshot) => {
                const reviews = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setUserData((prev) => ({ ...prev, reviews }));
            }
        );
        // Listen for changes to the user's ratings
        const unsubscribeRatings = onSnapshot(
            collection(db, "users", user.uid, "ratings"),
            (querySnapshot) => {
                const ratings = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setUserData((prev) => ({ ...prev, ratings }));
            }
        );

        // Cleanup listeners on unmount or user change
        return () => {
            unsubscribeMain();
            unsubscribeReviews();
            unsubscribeRatings();
        };
    }, [user]);

    return (
        <UserContext.Provider value={{ userData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);