"use client"

import { useEffect, useState } from "react";
import { useUserAuth } from "../../_utils/auth";
import { DropdownMenu } from "./user-drop-down";
import { SearchBar } from "./search-bar";
import { AddReview } from "./add-review";
import Link from "next/link";
import Image from "next/image";

let headerStyle = "max-h-18 sticky z-50 top-0 flex justify-center py-4 px-6 bg-zinc-900";
let buttonStyle = "rounded-lg bg-gray-800 drop-shadow-2xl hover:cursor-pointer hover:bg-gray-500 px-2.5 py-2 text-sm";

export default function Header(){

    const {user, googleSignIn, firebaseSignOut} = useUserAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchBarOpen, setSearchBarOpen] = useState(false);

    useEffect(() => {}, [user]);

    async function handleSignIn() {
        try {
            await googleSignIn();
        } catch (error) {
            console.error(error);
        }
    }


    // Open Review Modal
    const openModal = () => setIsModalOpen(true);
    
    // Close Modal
    const closeModal = () =>{
        setIsModalOpen(false);
    };

    
    const handleOpenSearch = (isOpen) => {
        setSearchBarOpen(isOpen);
    }


    return (
        <div className={headerStyle}>
            <div className="flex items-center justify-between gap-16 w-3/4 relative">
                <Link className="flex gap-1" href="/">
                    <Image src="/images/echoRateLogo.png" alt="logo" width={50} height={50} />
                    
                    <h1 className="text-4xl font-bold mr-24">EchoRate</h1>
                </Link>


                {user ?
                (
                    <div className="flex gap-4 absolute right-0 w-96">
                        <DropdownMenu />


                        <div className="flex items-center gap-4">
                            <SearchBar onOpenSearch={handleOpenSearch} />

                            {!searchBarOpen && 
                                <div>
                                    <button className="bg-green-500 w-30 text-white px-2.5 py-1 rounded-lg" onClick={openModal}>
                                        + Add Review
                                    </button>

                                    {isModalOpen &&
                                        <AddReview onClose={closeModal} />
                                    }
                                </div>
                            }
                        </div>
                    </div>
                ) :
                (
                    <div>
                        <button className={buttonStyle} onClick={handleSignIn}>Sign In</button>
                        
                        <SearchBar onOpenSearch={handleOpenSearch} />
                    </div>
                )}
                    
            </div>
        </div>
    );
}