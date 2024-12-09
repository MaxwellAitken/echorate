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
import { QueueList } from "@/app/components/queue-list";
import Ellipsis from "../../../../public/images/ellipsis.svg";

export default function UserQueuePage() {

    
    const {user} = useUserAuth();
    const { userData } = useUser();
    const username = usePathname().split("/")[2].replace("/albums", "");
    const [isOwnPage, setIsOwnPage] = useState(false);
    const [fetchedUserData, setFetchedUserData] = useState();

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

    return (
        <div>
            {fetchedUserData ? 
            (
                isOwnPage ?
                (
                    <div className="flex flex-col gap-2">
                        <ProfileNavBar userData={userData} currentTab="Queue" />
                        <div className="mt-8">
                            {
                                userData.queue?.length === 0 ? 
                                (
                                    <div className="flex justify-between">
                                        <p className="flex text-lg">
                                            Add albums you want to hear to your queue from the <Ellipsis/> icon on each album cover.
                                        </p>
                                    </div>
                                ) : 
                                (
                                    <div className="flex justify-between">
                                        <div className="text-lg">You want to hear {userData.queue?.length} {userData.queue?.length === 1 ? "album" : "albums"}</div>
                                        <p className="flex">
                                            Add albums you want to hear to your queue from the <Ellipsis/> icon on each album cover.
                                        </p>
                                    </div>
                                )
                            }
                            <div className="border-b-2 border-gray-800 pt-6"></div>
                        </div>
                        <QueueList albums={userData.queue} isOwnPage={isOwnPage} />
                    </div>
                ) : 
                (
                    <div className="flex flex-col gap-12">
                        <ProfileNavBar userData={fetchedUserData} currentTab="Queue" />
                        <div>
                            {username}s Queue
                            <div className="border-b-2 border-gray-800 pt-6"></div>
                        </div>
                        <QueueList albums={fetchedUserData.queue} isOwnPage={isOwnPage} />
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
