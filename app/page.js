"use client"

import { useState } from "react";
import { useUserAuth } from "../_utils/auth";
import { SignUpModal } from "./sign-up";
import AlbumPreview from "./components/album-preview";

const HomePage = () => {

    const {user, firebaseSignOut} = useUserAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                        {/* <AlbumInfo albumId="0hvT3yIEysuuvkK73vgdcW" /> */}
                        <button className="mt-24" onClick={handleSignOut}>Sign Out</button>
                    </div>
                ) : 
                (
                    <div>
                        <p>Don&apos;t have an account?</p>
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