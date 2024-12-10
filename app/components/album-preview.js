"use client"

import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../_utils/auth";
import Link from "next/link";
import Image from "next/image";
import VinylIcon from "../../public/images/vinyl-icon.svg";
import Ellipsis from "../../public/images/ellipsis.svg";
import { StarRating } from "./star-rating";
import { addRatingToAlbum, addRatingToUser, deleteRatingFromAlbum, deleteRatingFromUser } from "../../_services/review-service";
import { AddReview } from "./add-review";
import { updateUserQueue } from "@/_services/user-service";
import Notification from "./notification";
import { useUser } from "@/_utils/user-context";


const AlbumPreview = ({ album, size }) => {
    const {user} = useUserAuth();
    const {userData, loading} = useUser();
    const [hover, setHover] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [userReviewedAlbum, setUserReviewedAlbum] = useState(false);
    const [alreadyQueued, setAlreadyQueued] = useState(false);
    const [arrowHover, setArrowHover] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
	
    useEffect(() => {
        if (user && userData && album) {
            const checkIfUserReviewedAlbum = () => {
                if (!userData.ratings) return;
                const userRating = userData.ratings.find(rating => rating.album.id === album.id);
                if (userRating) {
                    setRating(userRating.rating);
                    setUserReviewedAlbum(true);
                }

                if (!userData.queue) return;
                const userQueue = userData.queue.find(queueItem => queueItem.album.id === album.id);
                if (userQueue) {
                    setAlreadyQueued(true);
                }
            }
            checkIfUserReviewedAlbum();
        }
    }, [user, album, userData, loading]);
    

    let fill = "text-gray-100";
    if (userReviewedAlbum) fill = "text-green-500";

    const handleRatingChange = async (newRating) => {
        if (newRating === rating) {
            return;
        } 
        else if (newRating === 0) {
            setRating(0);
            await deleteRatingFromUser(user.uid, album.id);
            deleteRatingFromAlbum(user.uid, album.id);
        }
        else {
            setRating(newRating);
            let newUserRating = {
                username: user.displayName,
                album: album,
                rating: newRating,
                date: new Date(),
                relisten: userReviewedAlbum,
            };
            await addRatingToUser(user.uid, newUserRating);
            addRatingToAlbum(user.uid, album.id, newUserRating);
        }
    };

    const handleAddToQueue = async () => {
        if (alreadyQueued) return;

        const currentQueue = userData.queue || [];

        const newQueueItem = {
            album: album,
            addedAt: new Date(),
        };

        currentQueue.push(newQueueItem);

        await updateUserQueue(user.uid, currentQueue);
        setAlreadyQueued(true);
        setShowNotification(true);
    };

    const handleRemoveFromQueue = async () => {
        let newQueue = userData.queue.filter(queueItem => queueItem.album.id !== album.id);
        if (newQueue.length === userData.queue.length) return;
        try{
            await updateUserQueue(user.uid, newQueue);
            setAlreadyQueued(false);
        } catch (error) {
            console.error(error);
        }
        await updateUserQueue(user.uid, newQueue);
        setAlreadyQueued(false);
    };


    const handleMouseEnter = () => setHover(true);
    const handleMouseLeave = () => {
        setHover(false)
        setMenuIsOpen(false)
    };

    const handleOpenMenu = () => setMenuIsOpen(true);
    const handleCloseMenu = () => setMenuIsOpen(false);

    const handleOpenReviewModal = () => setReviewModalOpen(true);
    const handleCloseReviewModal = () => {
        setHover(false);
        setReviewModalOpen(false);
    };

	return (
        <div>
            {album ? 
            (
                user ? 
                (
                <div 
                    className="relative shadow-md shadow-black w-full h-full cursor-pointer bottom-0 hover:outline hover:outline-green-500 outline-4 rounded-sm flex" 
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href={`/albums/${album.id}`}>
                        <Image className="rounded-sm" width={size} height={size} src={album.images[0].url} alt={album.name} />
                    </Link>

                    {hover && 
                    (
                        <div>

                            {/* Tooltip */}
                            <div className="absolute w-full flex items-start justify-center">
                                <div className="relative px-3 py-1 w-fit right-full -mt-4 -translate-y-full bg-gray-600 rounded-md text-sm text-center">
                                    <p>{album.name}</p>
                                    <p className="font-bold text-xs">{album.artists[0].name}</p>
                                    <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-transparent border-t-gray-600"></div>
                                </div>
                            </div>
                            
                            {/* Heard, Logged, Queue */}
                            <div className="absolute bottom-0 mb-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-90 flex gap-2 items-center px-2 py-1">
                                <VinylIcon stroke="currentColor" fill="currentColor" className={`w-8 h-8 ${fill}`} />
                                <div className="relative">
                                    <Ellipsis onClick={handleOpenMenu} className="w-8 h-8 text-gray-100" />
                                </div>
                            </div>
                            
                            {menuIsOpen && 
                            (
                                <div onMouseLeave={handleCloseMenu} className="absolute bottom-0 mb-2 left-1/2 ml-12  bg-gray-400 rounded-sm z-40 shadow-xl shadow-black">
                                    <div className="flex flex-col relative" >
                                        <div className="px-6 py-2">
                                            <StarRating currentRating={rating} onRatingChange={handleRatingChange} />
                                        </div>
                                        <button onClick={handleOpenReviewModal} className="text-gray-800 hover:bg-gray-700 hover:text-white px-8 whitespace-nowrap py-2 rounded-sm text-sm">Review album</button>

                                        <button 
                                            onMouseEnter={() => setArrowHover(true)} 
                                            onMouseLeave={() => setArrowHover(false)} 
                                            onClick={alreadyQueued ? handleRemoveFromQueue : handleAddToQueue}
                                            className="text-gray-800 hover:bg-gray-700 hover:text-white px-8 whitespace-nowrap py-2 rounded-sm text-sm">
                                                {alreadyQueued ? "Remove from queue" : "Add to queue"}
                                        </button>

                                        <div className={`absolute top-full -left-2 transform 
                                                        -translate-y-7 w-0 h-0 border-t-8 
                                                        border-b-8 border-r-8 border-transparent 
                                                        border-r-gray-400 ${arrowHover && "border-r-gray-700"}`}>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {reviewModalOpen && <AddReview album={album} onClose={handleCloseReviewModal} />}
                    {showNotification && <Notification message="Album added to queue" duration={3000} onClose={() => setShowNotification(false)} color="bg-green-500" />}

                </div>
                ) : 
                (
                    <div 
                        className="relative shadow-md shadow-black w-full h-full cursor-pointer bottom-0 hover:outline hover:outline-green-500 outline-4 rounded-sm flex" 
                        onMouseEnter={handleMouseEnter} 
                        onMouseLeave={handleMouseLeave}
                    >
                    <Link href={`/albums/${album.id}`}>
                        <Image className="rounded-sm" width={size} height={size} src={album.images[0].url} alt={album.name} />
                    </Link>

                    {hover && 
                    (
                        <div>

                            {/* Tooltip */}
                            <div className="absolute w-full flex items-start justify-center">
                                <div className="relative px-3 w-fit right-full -mt-4 -translate-y-full bg-gray-600 rounded-md text-sm text-center">
                                    <p>{album.name}</p>
                                    <p className="font-bold text-xs">{album.artists[0].name}</p>
                                    <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-transparent border-t-gray-600"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                )
            ) : 
            (
                <div className="flex items-center justify-center bg-gray-800" style={{width: size, height: size}}>
                    <p>Loading...</p>
                </div>
            )}
        </div>
	);
};

export default AlbumPreview;
