"use client";

// make username unique

import { useState, useEffect } from "react";
import { useUserAuth } from "../../../_utils/auth";
import { useRouter} from "next/navigation";
import { useToken } from "../../../_utils/token-context";
import { getReviews } from "../../../_services/review-service";
import Image from "next/image";
import { StaticRating } from "@/app/components/static-rating";

export default function UserReviewsPage() {

    const { user } = useUserAuth();
    const { token } = useToken();
    const [reviews, setReviews] = useState([]);
    
    const router = useRouter();

        
    async function loadReviews(){
        try {
            const reviews = await getReviews(user.uid);
            setReviews(reviews);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (user) {
            loadReviews();
        }
    }, [user]);

    const UserReviews = ({ user, reviews }) => {
        return (
            <div className="p-8">
                <h1>{user.displayName}&apos;s Reviews:</h1>

                {reviews.length > 0 ? (
                    <div className="flex flex-wrap gap-16 mt-12">
                    {reviews.map((review) => (
                        <div className="bg-gray-700 p-8" key={review.id}>
                            <button onClick={() => router.push(`/albums/${review.album.id}`)}>
                                <div className="result-item text-center">
                                    <Image width={96} height={96} className="max-h-48" src={review.album.images[0]?.url} alt={review.album.name} />
                                </div>
                            </button>
                            
                            <div>
                                <h2>{review.album.name}</h2>
                                <p>{review.album.artists[0].name}</p>
                                <StaticRating rating={review.rating} />
                            </div>
                        </div>
                    ))}
                    
                    </div>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        );
    }

    return (
        <div>
            {user ? 
                (
                    <UserReviews user={user} reviews={reviews} />
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
        // <div>
        //     <h1>{user.displayName}&quot; Reviews:</h1>

        //     {reviews.length > 0 ? (
        //         <div className="flex flex-wrap gap-8">
        //         {reviews.map((review) => (
        //             <button key={review.id} onClick={() => router.push(`/albums/${review.album.id}`)}>
        //                 <div className="result-item text-center">
        //                     <Image width={96} height={96} className="max-h-48" src={review.album.images[0].url} alt={review.album.name} />
        //                     <div>
        //                         <h2>{review.album.name}</h2>
        //                         <p>{review.album.artists[0].name}</p>
        //                     </div>
        //                 </div>
        //             </button>
        //         ))}
        //         </div>
        //     ) : (
        //         <p>No results found</p>
        //     )}
        // </div>
    );
};
