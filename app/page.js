"use client"

import { useState } from "react";
import { useUserAuth } from "../_utils/auth";
import { SignUpModal } from "./sign-up";
import AlbumInfo from "./components/album-preview";
import PopularTracks from "./components/popular";

const HomePage = () => {

    const {user, emailSignIn, emailSignUp, firebaseSignOut} = useUserAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSignIn = async () => {
        try {
            await emailSignIn(email, password);
        } catch (error) {
            console.error(error);
        }
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    const handleSignOut = async () => {
        try {
            await firebaseSignOut();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    
    return (
        <main>
            <div>
                {user ? 
                (
                    <div>
                        {/* <h1>Album Information</h1> */}
                        {/* <AlbumInfo albumId="0hvT3yIEysuuvkK73vgdcW" />
                        <PopularTracks /> */}
                        <button className="mt-24" onClick={handleSignOut}>Sign Out</button>
                    </div>
                ) : 
                (
                    <div>
                        <p>Don't have an account?</p>
                        <button onClick={handleOpenModal}>Sign up</button>
                        <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
                    </div>
                )
                }
            </div>
        </main>
    );
};

export default HomePage;