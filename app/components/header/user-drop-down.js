"use client"

import { useUserAuth } from "../../../_utils/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

const DropdownMenu = () => {

    let hoverStyle;

    const {user, username, emailSignIn, firebaseSignOut} = useUserAuth();

    useEffect(() => {}, [user]);

    async function handleSignIn() {
        try {
            await emailSignIn();
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
    const [isOpen, setIsOpen] = useState(false);

    const handleMouseEnter = () => setIsOpen(true);
    
    const handleMouseLeave = () => setIsOpen(false);

    isOpen ? hoverStyle = "bg-gray-500" : hoverStyle = "bg-zinc-900";
    return (
        <div>
            {user ? 
            (
                <div className="relative hover: cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    
                    <div className={"flex gap-2 items-center px-4 py-1 dropdown-button " + hoverStyle}>
                    {/* <Image width={36} height={36} className="max-h-8" src={user.photoURL} alt={user.displayName} /> */}
                    {/* <Image width={36} height={36} className="max-h-8"  src={user.photoURL ? user.photoURL : null} alt={user.username} /> */}
                        <div className="flex flex-col justify-between py-2">
                            <p>{username}</p>
                        </div>
                    </div>
                    {isOpen && (
                        <ul className="w-full absolute bg-gray-500 p-4 flex flex-col gap-4 text-white font-bold text-sm">
                            
                            <li className=""><Link href={`/users/${username}`}>My Reviews</Link></li>

                            <li className=""><Link href="/">My Profile</Link></li>

                            <li>
                                <button onClick={handleSignOut}>Sign Out</button>
                            </li>
                        </ul>
                    )}
                </div>
            ): (
                <button className="button" onClick={handleSignIn}>Sign In</button>
            )}
        </div>
    );
}

export { DropdownMenu };