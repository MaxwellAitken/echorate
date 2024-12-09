"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, getAuth, setLog } from "firebase/auth";
import { auth, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getFirestore, onSnapshot, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { set } from "date-fns";

const AuthContext = createContext();
const db = getFirestore();
const defaultProfilePicture = `${process.env.NEXT_PUBLIC_BASE_URL}/images/DefaultProfilePic.png`;

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    // Sign in
    const emailSignIn = async (email, password) => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            return userCred;
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                throw new Error("Email or password is incorrect.");
            } else{
                console.error("Error signing in:", error.message);
                throw error;
            }
        }
    };
    
    // Sign up
    const emailSignUp = async (email, password, username) => {
        try {

            // Check if username is already taken
            const publicProfilesRef = collection(db, "publicProfiles");
            const q = query(publicProfilesRef, where("username", "==", username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                throw new Error("Username is already taken.");
            }

            // Create user
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCred.user, { displayName: username.toLowerCase(), photoURL: defaultProfilePicture });
            // Add user to database (private)
            const userDoc = doc(db, "users", userCred.user.uid);
            await setDoc(userDoc, {
                username: username.toLowerCase(),
                email: userCred.user.email,
                photoURL: defaultProfilePicture,
                bio: "",
                favoriteAlbums: [],
                queue: [],
            });

            // Add user to database (public)
            const publicUserDoc = doc(db, "publicProfiles", userCred.user.uid);
            await setDoc(publicUserDoc, {
                username: username.toLowerCase(),
                photoURL: defaultProfilePicture,
                bio: "",
                favoriteAlbums: [],
                queue: [],
            });

            return userCred;
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                throw new Error("Email address is already in use.");
            } 
            if (error.message === "Username is already taken.") {
                throw new Error("Username is already taken.");
            }
            else {
                console.error("Error signing up:", error.message);
                throw error;
            }
        }
    };
    
    // Sign out
    const firebaseSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };
    
    // Listen for user state changes
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         setUser(currentUser);
    //     });
    //     return () => unsubscribe();
    // }, []);

    // Update Profile Picture
    const uploadProfilePicture = async (file) => {
        if (!auth.currentUser) {
            throw new Error("User not logged in");
        }

        try {
            const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            await updateProfile(auth.currentUser, { photoURL: url });
            

            const userDoc = doc(db, "users", auth.currentUser.uid);
            await setDoc(userDoc, {
                photoURL: defaultProfilePicture,
            }, { merge: true });

            
            const publicUserDoc = doc(db, "publicProfiles", auth.currentUser.uid);
            await setDoc(publicUserDoc, {
                photoURL: defaultProfilePicture,
            }, { merge: true });
            return url;
        } catch (error) {
            console.error("Error uploading profile picture:", error.message);
            throw error;
        }
    };


    // Listen for user state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);
    
    return (
        <AuthContext.Provider value={{ user, emailSignIn, emailSignUp, firebaseSignOut, uploadProfilePicture }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUserAuth = () => useContext(AuthContext);
