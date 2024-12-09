"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../../../../_utils/auth";
import { useUser } from "../../../../_utils/user-context";
import { usePathname} from "next/navigation";
import Image from "next/image";
import { getUser } from "@/_services/user-service";
import Link from "next/link";
import AlbumPreview from "@/app/components/album-preview";
import { ProfileNavBar } from "../nav-bar";
import AlbumPreviewInfo from "@/app/components/album-preview-with-info";
import { getAvgRating } from "@/_services/review-service";
import { AlbumList } from "@/app/components/album-list";

export default function UserAlbumsPage() {

    
    const {user} = useUserAuth();
    const { userData } = useUser();
    const username = usePathname().split("/")[2].replace("/albums", "");
    const [isOwnPage, setIsOwnPage] = useState(false);
    const [fetchedUserData, setFetchedUserData] = useState();
    const [sortBy, setSortBy] = useState({type: "date", order: "desc"});

    useEffect(() => {
        if (user && user.displayName === username) {
            setIsOwnPage(true);
        }
        else {
            setIsOwnPage(false);
        }
    }, [user, username, fetchedUserData]);

    // Get user data
    useEffect(() => {
        if (username) {
            if (isOwnPage) {
                setFetchedUserData(userData);
                return;
            }
            const loadUser = async () => {
                try {
                    const fetchedUser = await getUser(username);
                    setFetchedUserData(fetchedUser);
                } catch (error) {
                    console.error(error);
                } 
            }
            loadUser();
        }
    }, [username, user, isOwnPage]);


    const getDate = (timestamp) => {
        if (timestamp.toDate) {
            return timestamp.toDate();
        }
        return new Date(timestamp.seconds * 1000); 
    }

    const convertDate = (timestamp) => {
        const date = getDate(timestamp);
        return date.toDateString().split(" ").slice(1).join(" ");
    }


    return (
        <div>
            {fetchedUserData ? 
            (
                isOwnPage ?
                (
                    <div className="flex flex-col gap-12">
                        <ProfileNavBar userData={userData} currentTab="Albums" />
                        {/* <div className="w-full flex flex-col gap-2">

                            <div className="flex items-center justify-end gap-4">
                                <p className="text-lg text-gray-400">Sort by:</p>
                                <select className="bg-transparent text-gray-400 p-1 rounded-md focus:outline-none" 
                                    value={`${sortBy.type}`}
                                    onChange={(e) => {
                                        const [type, order] = e.target.value.split(" ");
                                        setSortBy({ type, order });
                                      }}
                                >

                                    <option className="bg-gray-800" value="name desc">Album Name</option>
                                    <option className="bg-gray-800" value="popularity desc">Popularity</option>


                                    <option className="bg-gray-800" disabled value="date">Date Listened</option>
                                    <option className="bg-gray-800" value="date desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Newest First</option>
                                    <option className="bg-gray-800" value="date asc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Earliest First</option>

                                    <option className="bg-gray-800" disabled value="release">Release Date</option>
                                    <option className="bg-gray-800" value="release desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Newest First</option>
                                    <option className="bg-gray-800" value="release asc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Earliest First</option>

                                    <option className="bg-gray-800" disabled value="rating">{isOwnPage ? "Your Rating" : userData.username + "s rating"}</option>
                                    <option className="bg-gray-800" value="rating desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highest First</option>
                                    <option className="bg-gray-800" value="rating asc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lowest First</option>

                                    <option className="bg-gray-800" disabled value="avgrating">Average Rating</option>
                                    <option className="bg-gray-800" value="avgrating desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highest First</option>
                                    <option className="bg-gray-800" value="avgrating asc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lowest First</option>

                                </select>
                            </div>

                            <div className="border-b-2 border-gray-800 pb-0.5"></div>
                            <AlbumList reviews={userData.reviews} ratings={userData.ratings} />
                        </div> */}
                        <AlbumList reviews={userData.reviews} ratings={userData.ratings} isOwnPage={isOwnPage} />
                    </div>
                ) : 
                (
                    <div className="flex flex-col gap-12">
                        <ProfileNavBar userData={fetchedUserData} currentTab="Albums" />
                        <AlbumList reviews={fetchedUserData.reviews} ratings={fetchedUserData.ratings} username={fetchedUserData.username} />
                    </div>
                )
            ) : 
            (
                <p>Loading...</p>
            )
            }
        </div>
    );
};
