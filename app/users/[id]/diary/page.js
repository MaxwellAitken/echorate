"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../../../../_utils/auth";
import { useUser } from "../../../../_utils/user-context";
import { usePathname} from "next/navigation";
import Image from "next/image";
import { StaticRating } from "@/app/components/static-rating";
import { getUser } from "@/_services/user-service";
import  CircularImage  from "../../../components/circular-image";
import Link from "next/link";
import { ProfileNavBar } from "../nav-bar";

export default function UserAlbumsPage() {

    
    const {user} = useUserAuth();
    const { userData } = useUser();
    const username = usePathname().split("/")[2].replace("/diary", "");
    const [isOwnPage, setIsOwnPage] = useState(false);
    const [fetchedUserData, setFetchedUserData] = useState();
    const [entries, setEntries] = useState();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setIsOwnPage(user.displayName === username);
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



    const Diary = ({reviews, ratings}) => {

        const [entries, setEntries] = useState([]);

        useEffect(() => {
            if (!reviews || !ratings) {
                setLoading(true);
                return;
            }


            const combinedEntries = [...reviews, ...ratings];
            const sortedEntries = combinedEntries.sort((a, b) => getDate(b.date) - getDate(a.date));
            const uniqueEntries = [];
            const seenDates = new Set();

            for (const entry of sortedEntries) {
                const normalizedDate = new Date(getDate(entry.date)).toISOString();
                if (!seenDates.has(normalizedDate)) {
                    seenDates.add(normalizedDate);
                    uniqueEntries.push(entry);
                }
            }
            setEntries(uniqueEntries);
            setLoading(false);
        }, [reviews, ratings]);

        if (!entries || entries.length === 0) {
            return <p>No entries yet</p>;
        }

        return(
            <table className="w-full">
                <thead>
                    <tr className="text-gray-400">
                        <th className="text-left">Month</th>
                        <th className="text-left">Day</th>
                        <th className="text-left">Album</th>
                        <th className="text-left">Released</th>
                        <th className="text-left">Rating</th>
                        <th className="text-left">Re-Listen</th>
                        <th className="text-left">Review</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => {
                        return (
                            <tr key={entry.id}>
                                <td>{convertDate(entry.date).split(" ")[0]}</td>
                                <td>{convertDate(entry.date).split(" ")[1]}</td>
                                <td>
                                    <Link className="flex gap-4 items-center" href={`/albums/${entry.album.id}`}>
                                        <Image src={entry.album.images[2].url} width={32} height={32} alt="" />
                                        <p>{entry.album.name}</p>
                                    </Link>
                                </td>
                                <td>{entry.album.release_date.split("-")[0]}</td>
                                <td>
                                    <StaticRating rating={entry.rating} />
                                </td>
                                <td>{entry.relisten ? "⟲" : ""}</td>
                                <td>{entry.text ? "☴" : ""}</td>
                                {/* ADD LINK TO REVIEW PAGE???? */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <div>
            {fetchedUserData ? 
            (
                isLoading ?
                (
                    <p>Loading...</p>
                ) :
                isOwnPage ?
                (
                    <div className="flex flex-col gap-12">
                        <ProfileNavBar userData={userData} currentTab="Diary" />
                        <Diary reviews={userData.reviews} ratings={userData.ratings} />
                    </div>
                ) : 
                (
                    <div className="flex flex-col gap-12">
                        <ProfileNavBar userData={fetchedUserData} currentTab="Diary" />
                        <Diary reviews={fetchedUserData.reviews} ratings={fetchedUserData.ratings} />
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
