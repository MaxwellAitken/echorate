"use client"

import { useEffect, useState } from "react";
import { useUserAuth } from "../../_utils/auth";
import { DropdownMenu } from "./user-drop-down";
import { SearchBar } from "./search-bar";
import { AddReview } from "./add-review";
import Link from "next/link";
import Image from "next/image";

let headerStyle = "max-h-18 sticky z-50 top-0 flex justify-center items-center gap-8 py-4 px-6 bg-gray-800";
// let headerStyle = "max-h-18 sticky z-50 top-0 flex justify-between items-center py-4 px-6 bg-gray-900 bg-opacity-95";
let buttonStyle = "rounded-lg bg-gray-800 drop-shadow-2xl hover:cursor-pointer hover:bg-gray-500 px-2.5 py-2 text-sm";

export default function Header(){

    const {user, googleSignIn, firebaseSignOut} = useUserAuth();

    useEffect(() => {}, [user]);

    async function handleSignIn() {
        try {
            await googleSignIn();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={headerStyle}>
            <div className="flex items-center justify-between gap-16">
                <Link className="flex gap-1" href="/">
                    <Image src="/images/echoRateLogo.png" alt="logo" width={50} height={50} />
                    
                    <h1 className="text-4xl font-bold mr-24">EchoRate</h1>
                </Link>


                <div className="flex gap-2">
                    {user ?
                    (
                        <div>
                            <DropdownMenu />
                        </div>
                    ) :
                    (
                        <div>
                            <button className={buttonStyle} onClick={handleSignIn}>Sign In</button>
                        </div>
                    )}
                    
                    <SearchBar />
                    <AddReview />
                </div>
            </div>
        </div>
    );
}