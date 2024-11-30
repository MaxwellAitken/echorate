"use client"

import AlbumInfo from "./components/album-info";
import { useUserAuth } from "../_utils/auth";
import { useToken } from "../_utils/token-context";
import PopularTracks from "./components/popular";

const HomePage = () => {
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
        <main>

            <div>
                {user ? (
                    <div>
                        {/* <h1>Album Information</h1> */}
                        <AlbumInfo albumId="0hvT3yIEysuuvkK73vgdcW" />
                        <PopularTracks />
                        <button className="mt-24" onClick={handleSignOut}>Sign Out</button>
                    </div>
                ) : (
                    <button onClick={handleSignIn}>Sign In</button>
                )}
            </div>
        </main>
    );
};

export default HomePage;