"use client"

import AlbumInfo from "./components/album-info";
import { useUserAuth } from "../_utils/auth";

export default function HomePage(){
    const {user, googleSignIn, firebaseSignOut} = useUserAuth();
    
    async function handleSignIn() {
        try {
            await googleSignIn();
        } catch (error) {
            console.error(error);
        }
    }
    
    async function handleSignOut() {
        try {
            await firebaseSignOut();
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div>
            {user ? (
                <div>
                    <h1>Album Information</h1>
                    <AlbumInfo albumId="0hvT3yIEysuuvkK73vgdcW" />
                    <button className="mt-5" onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <button onClick={handleSignIn}>Sign In</button>
            )}
        </div>
    );
};