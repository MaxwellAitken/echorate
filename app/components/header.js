"use client"

import { useUserAuth } from "../../_utils/auth";
import Link from "next/link";

let headerStyle = "sticky z-50 top-0 flex justify-between items-center py-4 px-6 bg-gray-900 bg-opacity-95";
let buttonStyle = "rounded-lg bg-gray-800 drop-shadow-2xl hover:cursor-pointer hover:bg-gray-500 px-2.5 py-2 text-sm";

export default function Header(){

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
        <div className={headerStyle}>
            <h1 className="text-4xl font-bold">EchoRate</h1>
            {user ?
            (
                <div className="flex gap-4 items-center">
                    <Link href="/" className="flex gap-2 items-center">
                        <img className="max-h-8" src={user.photoURL} alt={user.displayName} />
                        <div className="flex flex-col justify-between py-2">
                            <p>{user.displayName}</p>
                        </div>
                    </Link>
                    <button className={buttonStyle} onClick={handleSignOut}>Sign Out</button>
                </div>
            ) :
            (
                <div>
                    <button className={buttonStyle} onClick={handleSignIn}>Sign In</button>
                </div>
            )}
        </div>
    );
}