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
import AlbumPreview from "./album-preview";
import { StaticRating } from "./static-rating";


const AlbumPreviewInfo = ({ review, size, starScale, infoOffset }) => {
    const {user} = useUserAuth();
    const {userData, loading} = useUser();
	
    // useEffect(() => {
    //     if (user && userData && review) {
    //         const checkIfUserReviewedAlbum = () => {
    //             if (!userData.ratings) return;
    //             const userRating = userData.ratings.find(rating => rating.album.id === review.id);
    //             if (userRating) {
    //                 setRating(userRating.rating);
    //                 setUserReviewedAlbum(true);
    //             }

    //             if (!userData.queue) return;
    //             const userQueue = userData.queue.find(queueItem => queueItem.album.id === review.id);
    //             if (userQueue) {
    //                 setAlreadyQueued(true);
    //             }
    //         }
    //         checkIfUserReviewedAlbum();
    //     }
    // }, [user, review, userData, loading]);
        const [reviewToolTipOpen, setReviewToolTipOpen] = useState(false);


        const handleHoverReview = () => setReviewToolTipOpen(true );
        const handleUnHoverReview = (index) => setReviewToolTipOpen(false);


	return (
        <div className="flex flex-col gap-2">
            <AlbumPreview album={review.album} size={size} />
            <div className="flex gap-1 relative w-fit items-center">
                <StaticRating showEmpty={false} rating={review.rating} scale={starScale} />


                <div className={`flex gap-1 ${starScale == 1 ? "mt-1" : "text-xs mt-0.5"} items-center`} style={{marginLeft: `-${Math.round((review.rating ** (1 + starScale)) * infoOffset)}px`}}>
                    {review.relisten && <p className="text-gray-400">⟲</p>}

                    {review.text !== "" && review.text && 
                    (
                        <p 
                        // onClick={handleReviewClick}

                        // ADD REVIEW PAGE

                            onMouseEnter={() => handleHoverReview} 
                            onMouseLeave={() => handleUnHoverReview} 
                            className="text-gray-400 hover:cursor-pointer">
                        ☴
                        </p>
                    ) 
                    } 
                </div>
                
                {reviewToolTipOpen && (
                    <div className="absolute bg-gray-800 py-2 px-2.5 rounded-lg shadow-md bottom-full right-0  -translate-y-2 translate-x-1/2 mr-1.5">
                        <p className="text-xs">Review</p>
                        <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-800"></div>

                    </div>
                )}


            </div>
        </div>
	);
};

export default AlbumPreviewInfo;
