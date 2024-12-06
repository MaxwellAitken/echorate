import Image from "next/image";

const CircularImage = ({ src, alt, size }) => {

    if (!src || !alt) return null;
    return (
        <div
            style={{
                width: size,
                height: size,
                overflow: "hidden",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Image
                src={src}
                alt={alt}
                width={size}
                height={size}
                style={{
                    objectFit: "cover",
                }}
            />
        </div>
    );
};

export default CircularImage;
