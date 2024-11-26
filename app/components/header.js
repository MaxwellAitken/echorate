"use client"

import { useUserAuth } from "../../_utils/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchBar } from "./search-bar";

let headerStyle = "sticky z-50 top-0 flex justify-between items-center py-4 px-6 bg-gray-900 bg-opacity-95";
let buttonStyle = "rounded-lg bg-gray-800 drop-shadow-2xl hover:cursor-pointer hover:bg-gray-500 px-2.5 py-2 text-sm";

export default function Header(){

    const {user, googleSignIn, firebaseSignOut} = useUserAuth();

    // const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {}, [user]);

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
                <div className="flex gap-8">
                    {/* {searchResults.length > 0 && (
                        <div className="absolute top-16 right-0 w-96 bg-gray-900 bg-opacity-95 p-4 rounded-lg">
                            {searchResults.map((result) => (
                                <Link href={`/albums/${result.id}`} key={result.id}>
                                    <div className="flex gap-4 items-center hover:bg-gray-800 rounded-lg p-2">
                                        <img className="max-h-16" src={result.images[0].url} alt={result.name} />
                                        <div className="flex flex-col justify-between py-2">
                                            <p>{result.name}</p>
                                            <p className="text-xs text-gray-400">{result.artists[0].name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )} */}
                    <SearchBar  />
                    <div className="flex gap-4 items-center">
                        <Link href="/" className="flex gap-2 items-center">
                            <img className="max-h-8" src={user.photoURL} alt={user.displayName} />
                            <div className="flex flex-col justify-between py-2">
                                <p>{user.displayName}</p>
                            </div>
                        </Link>
                        <button className={buttonStyle} onClick={handleSignOut}>Sign Out</button>
                    </div>
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