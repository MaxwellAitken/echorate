export const StaticRating = ({ color, scale, showEmpty, rating }) => {

    const stars = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const starFill = color ? color : "fill-gray-400";
    const emptyFill = showEmpty ? "fill-gray-800" : "fill-transparent";

    return (
        <svg
            width={rating * 24}
            height="21"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`24 0 ${rating * 24} 21`}
            transform={`scale(${scale || 1}) translate(${scale ? ((1 - scale) * (-rating * 12 / scale)) : 1}, 0)`}
        >

            {stars.map((star) => {
                const isFilled = rating >= star;
                const isHalf = !Number.isInteger(star);

                const translate = star * 24 + (!isHalf ? 0 : 12.3);

                return (
                    <path
                        d="M 12 17.27   L18.18 21   l -1.64 -7.03  L 22 9.24  l-7.19-.61  L 12 2 9.19 8.63 2 9.24  l 5.46 4.73  L 5.82 21 z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        clipPath={isHalf ? 'url(#myPath2)' : 'url(#myPath)'}
                        transform={`translate(${translate}, 0)`}
                        transformOrigin="center"
                        key={star}
                        className={isFilled ? starFill : emptyFill}
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
    );
};
