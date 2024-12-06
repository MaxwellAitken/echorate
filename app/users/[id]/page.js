"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../../../_utils/auth";
import { useUser } from "../../../_utils/user-context";
import { usePathname} from "next/navigation";
import { useRouter} from "next/navigation";
import { getUserReviews } from "../../../_services/review-service";
import Image from "next/image";
import { StaticRating } from "@/app/components/static-rating";
import { getUser } from "@/_services/user-service";
import  CircularImage  from "../../components/circular-image";
import Link from "next/link";
import AlbumPreview from "@/app/components/album-preview";

export default function UserReviewsPage() {

    
    const {user} = useUserAuth();
    const { userData } = useUser();
    const router = useRouter();
    const username = usePathname().split("/")[2];
    const [reviews, setReviews] = useState([]);
    const [isOwnPage, setIsOwnPage] = useState(false);


    useEffect(() => {
        if (user && user.displayName === username) {
            setIsOwnPage(true);
        }
    }, [user, username]);

    // // Get user data
    // useEffect(() => {
    //     if (username) {
    //         const loadUser = async () => {
    //             try {
    //                 const user = await getUser(username);
    //                 setUserData(user);
    //             } catch (error) {
    //                 console.error(error);
    //             } 
    //         }
    //         loadUser();
    //     }
    // }, [username]);
    
    // Get user reviews
    useEffect(() => {
        if (username) {
            const loadReviews = async () => {
                try {
                    const reviews = await getUserReviews(username);
                    setReviews(reviews);
                } catch (error) {
                    console.error(error);
                } 
            }
            loadReviews();
        }
    }, [username]);


    const RecentReviews = ({ reviews }) => {
        return (
            <div className="">
                <h1 className="text-2xl">Recent Reviews:</h1>

                {reviews.length > 0 ? 
                (
                    <div className="flex flex-wrap gap-6 mt-4">
                        {reviews
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 4)
                        .map((review) => 
                        (
                            <div key={review.id} className="flex flex-col gap-4">
                                <AlbumPreview album={review.album} size={196} />
                                <div>
                                    <StaticRating rating={review.rating} />
                                    <p className="mt-2">{review.text.length > 50 ? `${review.text.slice(0, 50)}...` : review.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : 
                (
                    <p>No results found</p>
                )}
            </div>
        );
    }

    const FavoriteAlbums = ({ albums }) => {

        return(
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl">Favorite Albums:</h1>
                    <div className="flex gap-6">
                        
                        {(albums?.length < 4
                            ? [...albums || [], ...Array(4 - (albums?.length || 0)).fill(null)]
                            : albums
                        ).slice(0, 4).map((album, index) => (
                            <div key={album?.id || `placeholder-${index}`} className="relative">
                                {album ? 
                                (
                                    <AlbumPreview album={album} size={196} />
                                ) :
                                (
                                    <Image
                                        width={196}
                                        height={196}
                                        className="hover:cursor-pointer shadow-md shadow-black"
                                        src={"/images/album-placeholder.png"}
                                        alt={"Placeholder album"}
                                    />
                                )
                                }
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    const ProfileNavBar = () => {
        return (
            <div className="flex gap-8 items-center justify-between border-gray-800 border-2 px-8 py-1">
                <Link href={`/users/${userData.username}`}>Recent Reviews</Link>
                <Link href={`/users/${userData.username}/albums`}>Favorite Albums</Link>
                <Link href={`/users/${userData.username}/followers`}>Followers</Link>
                <Link href={`/users/${userData.username}/following`}>Following</Link>
            </div>
        );
    }


    return (
        <div>
            {userData ? 
            (
                isOwnPage ? 
                (
                    <div className="flex flex-col gap-12">

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
                                </div>
                                {/* <div className="flex gap-4 items-center">
                                    <h2 className="text-2xl">Followers:</h2>
                                    <p>{userData.followers.length}</p>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <h2 className="text-2xl">Following:</h2>
                                    <p>{userData.following.length}</p>
                                </div> */}
                            </div>
                        </div>
                        <ProfileNavBar />
                        <FavoriteAlbums albums={userData.favoriteAlbums} />
                        <RecentReviews reviews={userData.reviews} />
                    </div>
                ) :
                (
                    <div>
                        <div className="flex gap-8 items-center">
                            <CircularImage size={96} className="max-h-48" src={userData.photoURL} alt={userData.username} />
                            <h1 className="text-3xl">{userData.username}</h1>
                        </div>
                        <RecentReviews user={userData} reviews={reviews} />
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
