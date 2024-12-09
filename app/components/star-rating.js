import React, { useState, useEffect } from "react";

export const StarRating = ({ onRatingChange, currentRating }) => {
    const [rating, setRating] = useState(currentRating || 0);
    const [hoverRating, setHoverRating] = useState(currentRating || 0);
    const [showClose, setShowClose] = useState(false);


    useEffect(() => {
        setRating(currentRating);
        setHoverRating(currentRating);
    }, [currentRating]);

    const handleMouseEnter = (index) => setHoverRating(index);
    
    const handleMouseLeave = () => {
        setHoverRating(rating);
        setShowClose(false);
    };

    const handleXMouseEnter = () => setShowClose(true);

    const handleClick = (index) => {
        setRating(index);
        onRatingChange(index);
    };

    const handleClear = () => {
        setHoverRating(0);
        setRating(0);
        onRatingChange(0);
    }

  const stars = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    return (
        <div className={"flex items-center h-full w-full gap-2 relative"} onMouseEnter={handleXMouseEnter} onMouseLeave={handleMouseLeave}>

            {showClose &&
                <button type="button" onClick={handleClear} className="mt-1 right-full p-1 absolute">✖</button>
             }

            <svg
                className=""
                xmlns="http://www.w3.org/2000/svg"
                viewBox="24 0 120 22"
            >

                {stars.map((star) => {
                    const isFilled = hoverRating >= star;
                    const isHalf = !Number.isInteger(star);

                    const translate = star * 24 + (!isHalf ? 0 : 12);

                    return (
                        <path
                            d="M 12 17.27   L18.18 21   l -1.64 -7.03  L 22 9.24  l-7.19-.61  L 12 2 9.19 8.63 2 9.24  l 5.46 4.73  L 5.82 21 z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            clipPath={isHalf ? "url(#myPath2)" : "url(#myPath)"}
                            transform={`translate(${translate}, 0)`}
                            transformOrigin="center"
                            key={star}
                            className={`cursor-pointer  ${isFilled ? "text-green-500" : "text-gray-800"}`}
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            onClick={() => handleClick(star)}
                            onMouseEnter={() => handleMouseEnter(star)}
                        ></path>
                    );
                })}

                <defs>
                    <clipPath id="myPath">
                        <path d="M 11.5 0 L 11.5 24 24 24  24 0 Z" />
                    </clipPath>
                    <clipPath id="myPath2">
                        <path d="M 0 0 L 0 24 12.5 24  12.5 0 Z" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};
