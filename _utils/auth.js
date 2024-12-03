"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getFirestore, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();
const db = getFirestore();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    
    // Sign in
    const emailSignIn = async (email, password) => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            return userCred;
        } catch (error) {
            console.error("Error signing in:", error.message);
            throw error;
        }
    };
    
    // Sign up
    const emailSignUp = async (email, password, username) => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            
            await updateProfile(userCred.user, { displayName: username });

            const userDoc = doc(db, "users", userCred.user.uid);
            await setDoc(userDoc, {
                username: username,
                email: userCred.user.email,
            });
            return userCred;
        } catch (error) {

            if (error.code === 'auth/email-already-in-use') {
                throw new Error("The email address is already in use.");
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
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };
    
    // Listen for user state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);
    
    // Get username
    useEffect(() => {
        if (user) {
            const userDoc = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userDoc, (docSnap) => {
                if (docSnap.exists()) {
                    setUsername(docSnap.data().username);
                } else {
                    console.error("No such document!");
                }
            });
            return () => unsubscribe();
        }
    }, [user]);
    
    
    return (
        <AuthContext.Provider value={{ user, username, emailSignIn, emailSignUp, firebaseSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUserAuth = () => useContext(AuthContext);
