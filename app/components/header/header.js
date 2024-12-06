"use client"

import { useState } from "react";
import { useUserAuth } from "../../../_utils/auth";
import { DropdownMenu } from "./user-drop-down";
import { SearchBar } from "./search-bar";
import { AddReview } from "../add-review";
import Link from "next/link";
import Image from "next/image";
import SignInModal from "./sign-in-modal.js";

let headerStyle = "max-h-18 sticky z-50 top-0 flex justify-center py-4 bg-zinc-900";
let buttonStyle = "rounded-lg bg-gray-800 drop-shadow-2xl hover:cursor-pointer hover:bg-gray-500 px-2.5 py-2 text-sm";

export default function Header(){

    const {user} = useUserAuth();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [searchBarOpen, setSearchBarOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    // Open/Close Sign In Modal
    const handleOpenSignInModal = () => setIsSignInModalOpen(true);
    const handleCloseSignInModal = () => setIsSignInModalOpen(false);

    // Open Review Modal
    const openReviewModal = () => setIsReviewModalOpen(true);
    
    // Close Review Modal
    const closeReviewModal = () =>{
        setIsReviewModalOpen(false);
    };

    // Open Search Bar
    const handleOpenSearch = (isOpen) => {
        setSearchBarOpen(isOpen);
    }


    return (
        <div className={headerStyle}>
            <div className="flex items-center justify-between gap-16 w-7/12 relative">
                <Link className="flex gap-1" href="/">
                    <Image src="/images/echoRateLogo.png" alt="logo" width={50} height={50} />
                    <h1 className="text-4xl font-bold mr-24">EchoRate</h1>
                </Link>


                {user ?
                (
                    <div className="flex justify-en gap-8 absolute right-0">

                        {user.displayName && user.photoURL && 
                            <DropdownMenu />
                        }

                        <div className="flex items-center gap-6 w-36">
                            <SearchBar onOpenSearch={handleOpenSearch} />

                            {!searchBarOpen && 
                                <div>
                                    <button className="bg-green-500 w-30 text-white px-3 py-0.5 rounded-lg" onClick={openReviewModal}>
                                        + Review
                                    </button>

                                    {isReviewModalOpen &&
                                        <AddReview onClose={closeReviewModal} />
                                    }
                                </div>
                            }
                        </div>
                    </div>
                ) :
                (
                    <div className="flex justify-end gap-4 absolute right-0">
                        <button className={buttonStyle} onClick={handleOpenSignInModal}>Sign In</button>
                        <SignInModal isOpen={isSignInModalOpen} onClose={handleCloseSignInModal} />
                        
                        <div className="flex items-center gap-5 w-36">
                            <SearchBar onOpenSearch={handleOpenSearch} />
                        </div>
                    </div>
                )}
                    
            </div>
        </div>
    );
}