"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../_utils/auth";
import { SignInModal } from "../components/header/sign-in-modal";
import { updateUserProfile } from "@/_services/user-service";
import { getUser } from "@/_services/user-service";
import Image from "next/image";
import { useToken } from "../../_utils/token-context";
import { fetchAlbumSearchResults } from "@/_utils/spotifyApi";
import Link from "next/link";
import CircularImage from "../components/circular-image";

const SettingsPage = () => {

    const router = useRouter();
    const {user, uploadProfilePicture} = useUserAuth();
    const [userData, setUserData] = useState(null);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [profileHovering, setProfileHovering] = useState(false);
    const [file, setFile] = useState(user?.photoURL);
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);
    const [profile, setProfile] = useState({
        bio: "",
        profilePic: user?.photoURL,
        favoriteAlbums: [],
        queue: [],
    });


    // Get user data
    useEffect(() => {
        if (user) {
            const loadUser = async () => {
                try {
                    const newUserData = await getUser(user.displayName);
                    setUserData(newUserData);
                    setProfile({
                        bio: newUserData.bio,
                        profilePic: newUserData.photoURL,
                        favoriteAlbums: newUserData.favoriteAlbums,
                    });
                    setFavoriteAlbums(newUserData.favoriteAlbums || []);
                } catch (error) {
                    console.error(error);
                } 
            }
            loadUser();
        }
    }, [user]);


    const handleFileChange = (event) => {
        const newFile = event.target.files[0];

        // Set the preview
        if (newFile) {
          const reader = new FileReader();
          reader.onload = () => {
            setFilePreview(reader.result);
          };
          reader.readAsDataURL(newFile);
        } else {
          setFilePreview(null);
        }

        // Set the file url to be stored
        if (newFile) {
            setFile(newFile);
        } else {
            setFile(null);
        }
    };

    // Clear the preview when the file changes
    useEffect(() => {
        return () => {
            if (filePreview) {
                URL.revokeObjectURL(filePreview);
            }
        };
    }, [filePreview]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {  };

	const handleSubmit = async (e) => {
        e.preventDefault();
        let url = null;
        if (file !== user.photoURL) {
            url = await uploadProfilePicture(file);
        }
        let newProfile = {
            bio: profile.bio,
            profilePic: url || user.photoURL,
            favoriteAlbums: favoriteAlbums || [],
            queue: profile.queue || [],
        };
        await updateUserProfile(user.uid, newProfile);
        setProfile(newProfile);
        // router.refresh();
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 3000);
    };

    const handleMouseEnter = () => setProfileHovering(true);
    const handleMouseLeave = () => setProfileHovering(false);

    // Favorite Albums Component
    const FavoriteAlbums = ({ favoriteAlbums }) => {

        const [albumHovering, setAlbumHovering] = useState({});
        const [addAlbumModalOpen, setAddAlbumModalOpen] = useState(false);
        const { token } = useToken();
        const inputRef = useRef(null);
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState([]);

        const handleAlbumMouseEnter = (index) => setAlbumHovering((prev) => ({ ...prev, [index]: true }));
        const handleAlbumMouseLeave = (index) =>  setAlbumHovering((prev) => ({ ...prev, [index]: false }));
        
        const handleChangeAlbum = () => setAddAlbumModalOpen(true);
        const handleClose = () => setAddAlbumModalOpen(false);
        
        // Search for an album
        useEffect(() => {
            if (searchQuery) {
            const searchAlbums = async () => {
                try {
                    const results = await fetchAlbumSearchResults(searchQuery, token);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Error fetching album search results:", error);
                }
            };
            searchAlbums();
            }
        }, [searchQuery, token]);

        // Add an album to user's favorite albums
        const handleAlbumSelect = (album) => {
            if (favoriteAlbums.some((favAlbum) => favAlbum.id === album.id)) {
                setAddAlbumModalOpen(false);
                return;
            };
            setFavoriteAlbums((prev) => [...prev, album]);
            setAddAlbumModalOpen(false);
        };
        
        // Swap albums
        const handleSwapAlbum = (index) => {
            const newFavoriteAlbums = [...favoriteAlbums];
            const temp = newFavoriteAlbums[index];
            newFavoriteAlbums[index] = newFavoriteAlbums[index + 1];
            newFavoriteAlbums[index + 1] = temp;
            setFavoriteAlbums(newFavoriteAlbums);
        };


        return (
            <div className="flex flex-col gap-8 w-6/12">
                <h1 className="text-lg">Favorite Albums</h1>

                <div className="flex gap-4 items-center justify-between">

                    {(favoriteAlbums?.length < 4
                        ? [...favoriteAlbums || [], ...Array(4 - (favoriteAlbums?.length || 0)).fill(null)]
                        : favoriteAlbums
                    ).slice(0, 4).map((album, index) => (

                        <div 
                            key={album?.id || `placeholder-${index}`} 
                            className="relative" 
                            onMouseEnter={() => handleAlbumMouseEnter(index)} 
                            onMouseLeave={() => handleAlbumMouseLeave(index)}
                            onClick={handleChangeAlbum}
                        >

                            <Image
                                width={96}
                                height={96}
                                className="hover:cursor-pointer shadow-md shadow-black"
                                src={album?.images?.[0]?.url || "/images/album-placeholder.png"}
                                alt={album?.name || "Placeholder album"}
                            />

                            {/* Add Album */}
                            {/* {albumHovering[index] && !album &&
                                <label 
                                    className="absolute cursor-pointer bg-gray-800 bg-opacity-50 w-24 h-24 flex justify-center items-center bottom-0 text-white"
                                >+
                                </label>
                            } */}
                            {!album &&
                                <label 
                                    className="absolute cursor-pointer hover:bg-gray-800 bg-opacity-50 w-24 h-24 flex justify-center items-center bottom-0 text-white"
                                >+
                                </label>
                            }
                            
                            {/* Swap Albums */}
                            {index !== 3 && favoriteAlbums.length > index + 1 &&
                                <button className="absolute top-1/2 -translate-y-1/2 left-full ml-3" onMouseEnter={() => handleAlbumMouseLeave(index)} onClick={() => handleSwapAlbum(index)}>⇄</button>
                            }

                            {/* Remove Album */}
                            {albumHovering[index] && favoriteAlbums.length > index &&
                                <button 
                                    className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-full w-6 h-6 flex justify-center items-center text-white" 
                                    onClick={() => setFavoriteAlbums((prev) => prev.filter((_, i) => i !== index))}
                                >✖
                                </button>
                            }
                        </div>

                    ))}
                </div>

                {/* Search for album */}
                {addAlbumModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-gray-500 p-6 rounded-lg shadow-lg w-5/12 flex justify-between relative">
                            <div className="w-full">
                                <div className="relative  w-full">
                                    <h2>Search for an album...</h2>
                                    <input
                                        ref={inputRef}
                                        className="w-4/5 p-2 border rounded-lg focus:outline-none text-gray-900"
                                        type="text"
                                        placeholder="Search for an album"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <ul className="mt-8 flex flex-col gap-4  absolute ">
                                        {
                                            searchQuery && searchResults?.map((album) => (
                                                <li className="hover:cursor-pointer flex items-center whitespace-nowrap overflow-hidden text-ellipsis w-full gap-2" key={album.id} onClick={() => handleAlbumSelect(album)}>
                                                    <Image
                                                    src={album.images[0]?.url}
                                                    alt={album.name}
                                                    width={50}
                                                    height={50}
                                                    />
                                                    <span className="text-sm">{album.name}</span> 
                                                    <span className="italic text-xs">{album.artists[0]?.name}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                            <button className="" onClick={handleClose}>✖</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }


    return (
        <div>
            {user ? 
            (
                <div className="relative">
                    {showSavedMessage && (
                        <div className="flex absolute bg-green-500 text-white p-2 rounded-lg bottom-full left-1/2 -translate-x-1/2 gap-4">
                            <p>Changes Saved.</p>
                            <Link className="underline" href={`/users/${user.displayName}`}>View my profile.</Link>
                        </div>
                    )}

                    <h1 className="text-2xl mb-8">Profile Settings</h1>

                    <form className="flex justify-between" onSubmit={handleSubmit}>

                        <div className="flex flex-col gap-8 w-5/12">
                            {/* Email */}
                            <div className="flex flex-col">
                                <label className="block font-medium text-white">
                                    Email
                                </label>
                                <input
                                    className="p-1 rounded-md text-black"
                                    type="email"
                                    placeholder="Email"
                                    value={user.email}
                                    disabled
                                />
                            </div>

                            {/* Bio */}
                            <div className="flex flex-col">
                                <label className="block font-medium text-white">
                                    Bio
                                </label>
                                <input
                                    className="p-1 rounded-md text-black"
                                    name="bio"
                                    type="text"
                                    value={user.bio || profile.bio}
                                    onChange={handleInputChange}
                                />
                            </div>

                            
                            {/* Profile Pic */}
                            <div className="flex flex-col items-start relative gap-2">
                                <label className="block font-medium text-white">
                                    Profile Picture
                                </label>
                                <input
                                    id="fileInput"
                                    className="p-1 rounded-md text-black hidden"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange} 
                                />
                                <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                    <CircularImage size={128} src={filePreview || user.photoURL} alt={user.displayName} />
                                    {profileHovering && 
                                        <label 
                                            htmlFor="fileInput" 
                                            className="absolute cursor-pointer bg-gray-800 bg-opacity-50 w-24 h-24 flex justify-center items-center rounded-full bottom-0 text-white"
                                        >Change
                                        </label>
                                    }
                                </div>
                            </div>
                            <button className="bg-green-500 w-32 px-3 py-2 text-sm rounded-lg text-center" type="submit">Save Changes</button>
                        </div>

                        <FavoriteAlbums favoriteAlbums={favoriteAlbums} />
                    </form>
                </div>
            ) : 
            (
                <SignInModal onClose={handleCloseModal} />
            )
            }
        </div>
    );
};

export default SettingsPage;