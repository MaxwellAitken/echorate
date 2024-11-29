import React, { useState } from 'react';

export const StarRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(0); // To store the selected rating
  const [hoverRating, setHoverRating] = useState(0); // For hover effect
//   const [isDragging, setIsDragging] = useState(false);

  const handleMouseEnter = (index) => {
    // if (!isDragging) {
      setHoverRating(index);
    // }
  };

  const handleMouseLeave = () => {
    setHoverRating(rating);
  };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       const width = e.target.offsetWidth;
//       const offset = e.nativeEvent.offsetX;
//       const hoverValue = (offset / width) * 5;
//       setHoverRating(Math.ceil(hoverValue * 2) / 2); // Round to nearest half
//     }
//   };

  const handleClick = (index) => {
    setRating(index);
    onRatingChange(index);
  };

  const stars = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  return (
    <div
      className="flex items-center"
    //   onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
          <svg
          className='w-full h-21'
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 240 22"
          >

            {stars.map((star) => {
                const isFilled = hoverRating >= star;
                const isHalf = !Number.isInteger(star);


                const translate = star * 24 + (!isHalf ? 0 : 12);



                return (
                    <path
                        d="M 12 17.27   L18.18 21   l -1.64 -7.03   L 22 9.24l-7.19-.61  L 12 2 9.19 8.63 2 9.24  l 5.46 4.73  L 5.82 21 z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        clipPath={isHalf ? 'url(#myPath2)' : 'url(#myPath)'}
                        transform={`   translate(${translate}, 0)     `}
                        // transform={`   translate(${star * 20}, 0)     ${isHalf ? "scale(-1, 1)" : "scale(1, 1)"}   `}
                        transformOrigin="center"
                        fill={isFilled ? 'fill-yellow-400' : 'fill-gray-800'}
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
                    <path  d="M 12 0 L 12 24 24 24  24 0 Z" />
                </clipPath>
                <clipPath id="myPath2">
                    <path d="M 0 0 L 0 24 12 24  12 0 Z" />
                </clipPath>
            </defs>
          </svg>
    </div>
  );
};

// export default StarRating;
