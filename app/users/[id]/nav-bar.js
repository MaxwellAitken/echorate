import CircularImage from "@/app/components/circular-image";
import Image from "next/image";
import Link from "next/link";

export const ProfileNavBar = ({userData, currentTab}) => {

    const tabs = [
        { name: "Profile", path: `/users/${userData.username}` },
        { name: "Albums", path: `/users/${userData.username}/albums` },
        { name: "Diary", path: `/users/${userData.username}/diary` },
        { name: "Reviews", path: `/users/${userData.username}/reviews` },
        { name: "Queue", path: `/users/${userData.username}/queue` },
    ];

    return (
        <div className={`relative flex items-center justify-center w-full border-gray-800 border-2 px-8 py-2 ${currentTab !== "Profile" ? "bg-gray-800" : ""}`}>


            
            {currentTab !== "Profile" &&
            (
                <Link className="absolute left-0 ml-6 flex gap-2 items-center" href={`/users/${userData.username}`}>
                    <CircularImage size={28}  src={userData.photoURL} alt={userData.username} />
                    <p className="text-lg text-gray-400 capitalize">{userData.username}</p>
                </Link>
            )}

            <div className="flex gap-8 items-center justify-center">
                {tabs.map((tab) => {
                    return (
                        <Link href={tab.path} key={tab.name}>
                            {tab.name === "Profile" && currentTab !== "Profile" ? 
                            (
                                <div></div>
                            ) : 
                            (
                                <p className={`text-lg ${currentTab === tab.name ? "text-white border-b-2" : "text-gray-400"}`}>{tab.name}</p>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}