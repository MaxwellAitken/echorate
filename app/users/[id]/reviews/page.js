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
import AlbumPreview from "@/app/components/album-preview";
import { ProfileNavBar } from "../nav-bar";
import AlbumPreviewInfo from "@/app/components/album-preview-with-info";

export default function UserReviewsPage() {

    
    const {user} = useUserAuth();
    const { userData } = useUser();
    const username = usePathname().split("/")[2].replace("/reviews", "");
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
    }, [username, user, isOwnPage, userData]);


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



    // Recent Reviews
    const RecentReviews = ({ reviews }) => {

        if (reviews.length === 0 || !reviews) {
            return (
                <div>
                    <div className="flex justify-between items-end border-b-2 border-gray-800 pb-0.5">
                        <h1 className="text-xl">Recent Reviews</h1>
                    </div>
                    <div className="flex flex-col gap-6 mt-4">
                        <p>No reviews yet.</p>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="flex justify-between items-end border-b-2 border-gray-800 pb-0.5">
                    <h1 className="text-xl">Recent Reviews</h1>
                </div>

                <div className="flex flex-col gap-6 mt-6">
                    {reviews
                    .sort((a, b) => getDate(b.date) - getDate(a.date))
                    .slice(0, 4)
                    .map((review) => 
                    (
                        <div key={review.id}>
                            <div className="flex gap-4 items-start w-full">
                                <AlbumPreview album={review.album} size={128} />
                                <div className="flex flex-col gap-2 w-7/12">
                                    <div className="flex gap-2 items-center">
                                        <h2 className="text-lg font-bold">{review.album.name}</h2>
                                        <p className="text-gray-400">{review.album.release_date?.split("-")[0]}</p>
                                    </div>

                                    <div className="flex items-center">
                                        <StaticRating color="fill-green-500" scale={0.65} rating={review.rating} />
                                        <div style={{marginLeft: `${Math.round((review.rating ** 1.65) * -2)}px`}} className="text-sm mt-[3px]">
                                            {review.relisten ? "Relistened" : "Listened"} {convertDate(review.date)}
                                        </div>
                                    </div>

                                    <p className="mt-2 w-full break-words text-wrap">{review.text.length > 200 ? `${review.text.slice(0, 200)}...` : review.text}</p>
                                </div>
                            </div>
                            <div className="border-b-2 border-gray-800 pt-6"></div>
                        </div>
                    ))}

                    
                </div>
            </div>
        );
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
                        <ProfileNavBar userData={userData} currentTab="Reviews" />
                        <RecentReviews reviews={userData.reviews} />
                    </div>
                ) : 
                (
                    <div className="flex flex-col gap-8">
                        <ProfileNavBar userData={fetchedUserData} currentTab="Reviews" />
                        <RecentReviews reviews={fetchedUserData.reviews} />
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
