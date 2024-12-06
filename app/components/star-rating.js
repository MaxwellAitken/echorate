import React, { useState } from 'react';

export const StarRating = ({ onRatingChange, currentRating }) => {
    const [rating, setRating] = useState(currentRating || 0);
    const [hoverRating, setHoverRating] = useState(currentRating || 0);

    const handleMouseEnter = (index) => {
        setHoverRating(index);
    };

    const handleMouseLeave = () => {
        setHoverRating(rating);
    };

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
        <div className={"flex items-center h-full w-full gap-2 relative"} onMouseLeave={handleMouseLeave}>

            {rating > 0 &&
                <button type='button' onClick={handleClear} className='mt-2 right-full p-1 absolute'>✖</button>
             }

            <svg
                className=""
                xmlns="http://www.w3.org/2000/svg"
                viewBox="24 0 120 22"
            >

                {stars.map((star) => {
                    const isFilled = hoverRating >= star;
                    const isHalf = !Number.isInteger(star);

                    const translate = star * 24 + (!isHalf ? 0 : 12.1);

                    return (
                        <path
                            d="M 12 17.27   L18.18 21   l -1.64 -7.03  L 22 9.24  l-7.19-.61  L 12 2 9.19 8.63 2 9.24  l 5.46 4.73  L 5.82 21 z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            clipPath={isHalf ? 'url(#myPath2)' : 'url(#myPath)'}
                            transform={`translate(${translate}, 0)`}
                            transformOrigin="center"
                            key={star}
                            className={`cursor-pointer  ${isFilled ? 'fill-green-500' : 'fill-gray-800'}`}
                            strokeWidth="2"
                            onClick={() => handleClick(star)}
                            onMouseEnter={() => handleMouseEnter(star)}
                        ></path>
                    );
                })}

                <defs>
                    <clipPath id="myPath">
                        <path d="M 12 0 L 12 24 24 24  24 0 Z" />
                    </clipPath>
                    <clipPath id="myPath2">
                        <path d="M 0 0 L 0 24 12 24  12 0 Z" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};
