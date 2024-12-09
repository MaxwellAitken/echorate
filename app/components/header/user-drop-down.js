"use client"

import { useUserAuth } from "../../../_utils/auth";
import Link from "next/link";
import { useState } from "react";
import CircularImage from "../circular-image";
import { useRouter } from "next/navigation";

const DropdownMenu = () => {

    let hoverStyle;
    const router = useRouter();
    const {user, firebaseSignOut} = useUserAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);

    const handleSignOut = async () => {
        try {
            await firebaseSignOut();
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }
    
    isOpen ? hoverStyle = "bg-gray-500" : hoverStyle = "bg-zinc-900";

    let linkStyle = "w-full py-2 px-4 text-gray-900 hover:text-white hover:bg-gray-600";

    return (
        <div className={"relative hover:cursor-pointer rounded-lg " + hoverStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className={"flex gap-2 items-center px-4 py-1 rounded-t-sm " + hoverStyle}>
            <CircularImage size={50} className="rounded-full"  src={user.photoURL} alt={user.displayName} />
            {/* <CircularImage size={36} className="max-h-8"  src={user.photoURL} alt={user.displayName} /> */}
                <div className="flex flex-col justify-between py-2 text-slate-300 font-semi-bold uppercase">
                    <p>{user.displayName}</p>
                </div>
            </div>
            {isOpen && (
                <ul className="w-full absolute bg-gray-500 flex flex-col text-sm rounded-b-sm">
                    
                    <Link className={linkStyle} href="/">Home</Link>

                    <Link className={linkStyle} href={`/users/${user.displayName}`}>Profile</Link>

                    <Link className={linkStyle} href={`/users/${user.displayName}/diary`}>Diary</Link>

                    <Link className={linkStyle} href={`/users/${user.displayName}/reviews`}>Reviews</Link>

                    <Link className={linkStyle} href={`/users/${user.displayName}/queue`}>Queue</Link>

                    <li className={linkStyle}>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </li>
                </ul>
            )}
        </div>
    );
}

export { DropdownMenu };