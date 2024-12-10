"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../../../_utils/auth";
import { useUser } from "../../../_utils/user-context";
import { usePathname} from "next/navigation";
import Image from "next/image";
import { StaticRating } from "@/app/components/static-rating";
import { getUser } from "@/_services/user-service";
import  CircularImage  from "../../components/circular-image";
import Link from "next/link";
import AlbumPreview from "@/app/components/album-preview";
import { ProfileNavBar } from "./nav-bar";
import AlbumPreviewInfo from "@/app/components/album-preview-with-info";

export default function UserReviewsPage() {

    
    const {user} = useUserAuth();
    const { userData } = useUser();
    const username = usePathname().split("users/")[1];
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

    // Recent Activity
    const RecentActivity = ({ reviews }) => {

        const [reviewToolTipOpen, setReviewToolTipOpen] = useState({
            0: false,
            1: false,
            2: false,
            3: false
        });

        if (!reviews || reviews.length === 0) {
            return (
                <div>
                    <div className="flex justify-between items-end border-b-2 border-gray-800 pb-0.5">
                        <h1 className="text-xl">Recent Activity</h1>
                    </div>
                    <div className="flex flex-col gap-6 mt-4">
                        <p>No activity yet.</p>
                    </div>
                </div>
            );
        }

        const handleHoverReview = (index) => setReviewToolTipOpen((prev) => ({ ...prev, [index]: true }));
        const handleUnHoverReview = (index) => setReviewToolTipOpen((prev) => ({ ...prev, [index]: false }));
    

        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end border-b-2 border-gray-800 pb-0.5">
                    <h1 className="text-xl">Recent Activity</h1>
                    <Link href={`/users/${fetchedUserData.username}/albums`}>see all</Link>
                </div>
                <div className="flex gap-4">
                    {reviews
                    .sort((a, b) => getDate(b.date) - getDate(a.date))
                    .slice(0, 4)
                    .map((review, index) => 
                    (
                        <AlbumPreviewInfo key={review.id} review={review} size={172} starScale={1} infoOffset={0} />
                    ))}
                </div>
            </div>
        );
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
                    <Link href={`/users/${fetchedUserData.username}/reviews`}>see all</Link>
                </div>

                <div className="flex flex-col gap-6 mt-4">
                    {reviews
                    .sort((a, b) => getDate(b.date) - getDate(a.date))
                    .slice(0, 4)
                    .map((review) => 
                    (
                        <div key={review.id} className="flex gap-4">
                            <AlbumPreview album={review.album} size={128} />

                            <div className="flex flex-col gap-2">
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

                                <p className="mt-2">{review.text.length > 40 ? `${review.text.slice(0, 40)}...` : review.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Favorite Albums
    const FavoriteAlbums = ({ albums }) => {

        if (!fetchedUserData || !albums) {
            return <p>Loading...</p>;
        }

        return(
            <div className="flex flex-col gap-4">
                <div className="border-b-2 border-gray-800 pb-0.5">
                    <h1 className="text-xl">Favorite Albums</h1>
                </div>
                    <div className="flex gap-4">

                        {albums?.length === 0 ?
                        (
                            <div>
                                <span>Add your favorite albums </span>
                                <Link href={`/settings`}>
                                    <span className="underline text-green-600">here</span>
                                </Link>
                            </div>
                        ) : 
                        (
                            albums?.length < 4 
                            ? [...albums || [], ...Array(4 - (albums?.length || 0)).fill(null)]
                            : albums
                            ).slice(0, 4).map((album, index) => (
                                <div key={album?.id || `placeholder-${index}`} className="relative">
                                    {album ? 
                                    (
                                        <AlbumPreview album={album} size={172} />
                                    ) :
                                    (
                                        <Image
                                            width={172}
                                            height={172}
                                            className="shadow-md shadow-black"
                                            src={"/images/album-placeholder.png"}
                                            alt={"Placeholder album"}
                                        />
                                    )
                                    }
                                </div>
                                )
                        )
                        }

                        {/* {(albums?.length < 4 
                            ? [...albums || [], ...Array(4 - (albums?.length || 0)).fill(null)]
                            : albums
                        ).slice(0, 4).map((album, index) => (
                            <div key={album?.id || `placeholder-${index}`} className="relative">
                                {album ? 
                                (
                                    <AlbumPreview album={album} size={172} />
                                ) :
                                (
                                    <Image
                                        width={172}
                                        height={172}
                                        className="shadow-md shadow-black"
                                        src={"/images/album-placeholder.png"}
                                        alt={"Placeholder album"}
                                    />
                                )
                                }
                            </div>
                        ))} */}
                </div>
            </div>
        );
    }

    return (
        <div>
            {fetchedUserData ? 
            (
                isOwnPage ?
                (
                    <div className="flex flex-col gap-8">

                        <div className="flex gap-8 items-center justify-between">
                            <div className="flex gap-8 items-center">
                                <CircularImage size={96} className="max-h-48" src={userData.photoURL} alt={userData.username} />

                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <h1 className="text-3xl">{userData.username}</h1>
                                        <Link className="bg-gray-600 px-3 py-1 rounded-lg flex items-center" href="/settings">Edit Profile</Link>
                                    </div>
                                    <div>
                                        <p>{userData.bio}</p>
                                    </div>
                                </div>
                            </div>


                            <div className="flex gap-4">
                                <div className="flex flex-col gap-4 items-center border-r-2 border-gray-800 px-4">
                                    <p className="text-2xl">{userData.reviews?.length}</p>
                                    <h2 className="text-zinc-500">Reviews</h2>
                                </div>
                                <div className="flex flex-col gap-4 items-center">
                                    <p className="text-2xl">{userData.ratings?.length}</p>
                                    <h2 className="text-zinc-500">Albums</h2>
                                    {/*
                                    
                                    CHANGE
                                    
                                    */}
                                </div>
                            </div>
                        </div>
                        <ProfileNavBar userData={userData} currentTab="Profile" />

                        <div className="w-3/4 flex flex-col gap-6">
                            <FavoriteAlbums albums={userData.favoriteAlbums} />
                            <RecentActivity reviews={userData.reviews} ratings={userData.ratings} />
                            <RecentReviews reviews={userData.reviews} />

                        </div>
                    </div>
                ) : 
                (
                    <div className="flex flex-col gap-8">

                        <div className="flex gap-8 items-center justify-between">
                            <div className="flex gap-8 items-center">
                                <CircularImage size={96} className="max-h-48" src={fetchedUserData.photoURL} alt={fetchedUserData.username} />

                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <h1 className="text-3xl">{fetchedUserData.username}</h1>
                                    </div>
                                    <div>
                                        <p>{fetchedUserData.bio}</p>
                                    </div>
                                </div>
                            </div>


                            <div className="flex gap-4">
                                <div className="flex flex-col gap-4 items-center border-r-2 border-gray-800 px-4">
                                    <p className="text-2xl">{fetchedUserData.reviews?.length}</p>
                                    <h2 className="text-zinc-500">Reviews</h2>
                                </div>
                                <div className="flex flex-col gap-4 items-center">
                                    <p className="text-2xl">{fetchedUserData.ratings?.length}</p>
                                    <h2 className="text-zinc-500">Albums</h2>
                                    {/*
                                    
                                    CHANGE
                                    
                                    */}
                                </div>
                            </div>
                        </div>
                        <ProfileNavBar userData={fetchedUserData} currentTab="Profile" />

                        <div className="w-3/4 flex flex-col gap-6">
                            <FavoriteAlbums albums={fetchedUserData.favoriteAlbums} />
                            <RecentActivity reviews={fetchedUserData.reviews} ratings={fetchedUserData.ratings} />
                            <RecentReviews reviews={fetchedUserData.reviews} />

                        </div>
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
