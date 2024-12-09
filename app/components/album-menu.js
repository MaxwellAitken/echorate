"use client"

import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../_utils/auth";
import { StarRating } from "./star-rating";
import { addRatingToAlbum, addRatingToUser, deleteRatingFromAlbum, deleteRatingFromUser } from "../../_services/review-service";
import { AddReview } from "./add-review";
import { updateUserQueue } from "@/_services/user-service";
import Notification from "./notification";
import { useUser } from "@/_utils/user-context";
import SignInModal from "./header/sign-in-modal";


const AlbumMenu = ({ album, size }) => {
    const {user} = useUserAuth();
    const {userData, loading} = useUser();
    const [userReviewedAlbum, setUserReviewedAlbum] = useState(false);
    const [alreadyQueued, setAlreadyQueued] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [signInModalOpen, setSignInModalOpen] = useState(false);
	
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
    
    const handleOpenSignInModal = () => setSignInModalOpen(true);

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

    const handleOpenReviewModal = () => setReviewModalOpen(true);
    const handleCloseReviewModal = () => setReviewModalOpen(false);


	return (
        <div>
            {album ? 
            (
                user ? 
                (
                    <div className="shadow-md shadow-black w-full cursor-pointer rounded-sm flex mt-8">
                            <div>
                                <div className="bg-gray-400 rounded-sm z-50 shadow-xl shadow-black">
                                    <div className="flex flex-col relative" >
                                        <div className="px-6 py-2">
                                            <StarRating currentRating={rating} onRatingChange={handleRatingChange} />
                                        </div>
                                        <button onClick={handleOpenReviewModal} className="text-gray-800 hover:bg-gray-700 hover:text-white px-8 whitespace-nowrap py-2 rounded-sm text-sm">Review album</button>

                                        <button 
                                            onClick={alreadyQueued ? handleRemoveFromQueue : handleAddToQueue}
                                            className="text-gray-800 hover:bg-gray-700 hover:text-white px-8 whitespace-nowrap py-2 rounded-sm text-sm">
                                                {alreadyQueued ? "Remove from queue" : "Add to queue"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {reviewModalOpen && <AddReview album={album} onClose={handleCloseReviewModal} />}
                        {showNotification && <Notification message="Album added to queue" duration={3000} onClose={() => setShowNotification(false)} color="bg-green-500" />}
                    </div>
                ) : 
                (
                    <div className="shadow-md shadow-black rounded-sm flex mt-16">
                        <div className="bg-gray-400 rounded-sm cursor-pointer">
                            <div className="flex flex-col relative" >
                                <button onClick={handleOpenSignInModal} className="text-gray-800 hover:bg-gray-700 hover:text-white px-4 whitespace-nowrap py-2 rounded-sm text-sm">Sign in to rate or review</button>
                            </div>
                        </div>
                        {signInModalOpen && <SignInModal onClose={() => setSignInModalOpen(false)} />}
                    </div>
                )
            ) : 
            (
                <div className="flex items-center justify-center bg-gray-800">
                    <p>Loading...</p>
                </div>
            )}
        </div>
	);
};

export default AlbumMenu;
