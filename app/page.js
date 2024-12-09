"use client"

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";
import { SignUpModal } from "./sign-up";
import { getAllReviews, getPopularAlbums } from "../_services/review-service";
import { getProfilePic } from "../_services/user-service";
import { StaticRating } from "./components/static-rating";
import CircularImage from "./components/circular-image";
import Link from "next/link";
import AlbumPreview from "./components/album-preview";



const HomePage = () => {

    const {user} = useUserAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [albumsLoading, setAlbumsLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [popularAlbums, setPopularAlbums] = useState([]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    useEffect(() => {

        const fetchData = async () => {
            try {
                const fetchedReviews = await getAllReviews();
                setReviews(fetchedReviews);
                const fetchedPopularAlbums = await getPopularAlbums();
                setPopularAlbums(fetchedPopularAlbums);
            } catch (error) {
                console.error("Error loading recent reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    function RecentReviews() {
        if (loading) {
            return <p>Loading...</p>
        }

        if (reviews.length === 0) {
            return <p>No reviews yet</p>
        }
        
        const getPhotoURL = async (username) => {
            try {
                const photoURL = await getProfilePic(username); 
                return photoURL;
            } catch (error) {
                console.error("Error fetching profile picture:", error);
                return null;
            }
        };

        return (
            <div>
                <div className="border-b-2 border-gray-600"></div>
                <div className="flex flex-col gap-6">
                    {reviews.slice(0, 4).map((review) => {
                        const [profilePic, setProfilePic] = useState(null);

                        useEffect(() => {
                            const fetchProfilePic = async () => {
                                const pic = await getPhotoURL(review.username);
                                setProfilePic(pic);
                            };
                            fetchProfilePic();
                        }, [review.username]);

                        return (
                            <div key={review.reviewId} className="flex gap-4 border-b-2 border-gray-600 py-4">

                                <div key={review.reviewId} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <AlbumPreview album={review.album} size={164} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2 items-center">
                                            <Link href={`/albums/${review.album.id}`}>
                                                <h2 className="text-lg font-bold">{review.album.name}</h2>
                                            </Link>
                                            <p className="text-gray-400">{review.album.release_date?.split("-")[0]}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link className="flex items-center gap-2" href={`/users/${review.username}`}>
                                                <CircularImage src={profilePic} alt={"user"} size={32} />
                                                {review.username}
                                            </Link>
                                            <div className="-mt-1.5">
                                                <StaticRating color="fill-green-500" scale={0.75} rating={review.rating} />
                                            </div>
                                            {/* <div style={{marginLeft: `${Math.round((review.rating ** 1.65) * -2)}px`}} className="text-sm mt-[3px]">
                                            </div> */}
                                        </div>

                                        <p className="mt-2">{review.text.length > 400 ? `${review.text.slice(0, 400)}...` : review.text}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }

    function PopularAlbums() {
        if (loading) {
            return <p>Loading...</p>
        }

        if (popularAlbums.length === 0) {
            return <p>No popular albums yet</p>
        }

        return (
            <div className="flex flex-col">
                <h2>Popular Albums This Week</h2>
                <div className="border-b-2 border-gray-600"></div>
                <div className="flex gap-4 mt-4">
                    {popularAlbums.map((album) => {
                        return (
                            <div key={album.id} className="flex flex-col gap-2">
                                <AlbumPreview album={album} size={164} />
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }



    return (
        <div>
            {user ? 
            (
                <div className="flex flex-col gap-12 mt-16 items-center">

                    <div className="flex flex-col gap-2 items-center text-3xl text-gray-400 text-center">
                        <p>
                            <span>Welcome back, </span>
                            <Link href={`/users/${user.displayName}`}>
                                <span className="underline">{user.displayName}.</span>
                            </Link>
                        </p>
                    </div>
                    
                    <div className="w-full">
                        <PopularAlbums/>
                    </div>

                    <div className="w-full">
                        <h2>Recent EchoRate Reviews</h2>
                        <RecentReviews/>
                    </div>
                </div>
            ) : 
            (
                <div className="flex flex-col gap-12 mt-24 items-center">
                    <div className="flex flex-col gap-2 items-center text-4xl font-bold text-center">
                        {/* <p>
                            Welcome to EchoRate - Your music journey, amplified.
                        </p> */}
                        <p>
                            Discover, log, and review the music you love.
                        </p>
                        <p>
                            Save albums you want to hear.
                        </p>
                        <p>
                            See what your friends are listening to.
                        </p>
                    </div>

                    <button className="bg-green-600 rounded-md px-4 py-2 text-lg font-bold" onClick={handleOpenModal}>Sign up</button>
                    {isModalOpen &&
                        <SignUpModal onClose={handleCloseModal} />
                    }

                    <div className="w-full">
                        <PopularAlbums/>
                    </div>

                    <div className="w-full">
                        <h2>Recent EchoRate Reviews</h2>
                        <RecentReviews/>
                    </div>
                </div>
            )
            }
        </div>
    );
};

export default HomePage;