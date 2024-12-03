"use client"

import { addReviewToUser, addReviewToAlbum } from "@/_services/review-service";
import { useState, useEffect, useRef } from "react";
import { useUserAuth } from "@/_utils/auth";
import { useToken } from '../../_utils/token-context';
import { fetchAlbumSearchResults } from "@/_utils/spotifyApi";
import Image from "next/image";
import { StarRating } from "./star-rating";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const AddReview = ({ onClose }) => {
    
    const { user } = useUserAuth();
    const { token } = useToken();
    const inputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showBackConfirmation, setShowBackConfirmation] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [review, setReview] = useState({
        album: null,
        date: new Date(),
        relisten: false,
        text: "",
        rating: 0,
    });


    // Close Modal - Show Confirmation
    const closeModal = () => {
        if (hasChanges) {
            setShowConfirmation(true);
        } else {
            confirmClose();
        }
    };

    // Go Back - Show Confirmation
    const handleGoBack = () => {
        if (hasChanges) {
            setShowBackConfirmation(true);
        } else {
            confirmGoBack();
        }
    };

    // Go Back Confirmed
    const confirmGoBack = () => {
        setShowBackConfirmation(false);
        setReview({
            album: null,
            date: new Date(),
            relisten: false,
            text: "",
            rating: 0,
        });
        setHasChanges(false);
        setSelectedAlbum(null);
    }

    // Go Back Cancelled
    const cancelGoBack = () => {
        setShowBackConfirmation(false);
    }


    
    // Close Confirmed
    const confirmClose = () => {
        setShowConfirmation(false);
        setReview({
            album: null,
            date: new Date(),
            relisten: false,
            text: "",
            rating: 0,
        });
        setSelectedAlbum(null);
        setSearchQuery('');
        onClose();
    };
    
    // Close Cancelled
    const cancelClose = () => {
        setShowConfirmation(false);
    };

    // Album Search
    useEffect(() => {
        if (searchQuery) {
          const searchAlbums = async () => {
            try {
              const results = await fetchAlbumSearchResults(searchQuery, token);
              setSearchResults(results);
            } catch (error) {
              console.error('Error fetching album search results:', error);
            }
          };
          searchAlbums();
        }
    }, [searchQuery, token]);

    // Album Selected
    const handleAlbumSelect = (album) => {
        setSelectedAlbum(album);
    };

    
    // Review Input
    const handleInputChange = (e) => {
        setHasChanges(true);
        const { name, value } = e.target;
        setReview((prev) => ({ ...prev, [name]: value }));
    };
    const handleDateChange = (newDate) => {
        setHasChanges(true);
        setReview((prev) => ({ ...prev, date: newDate }));
    };
    const handleRatingChange = (newRating) => {
        if (newRating == 0) {
            setHasChanges(false);
            setReview((prev) => ({ ...prev, rating: 0 }));
        } else {
            setHasChanges(true);
            setReview((prev) => ({ ...prev, rating: newRating }));
        }
    };

    

    // Review Submission
    const handleSubmit = (e) => {
        if (!selectedAlbum) return;
        e.preventDefault();

        let newReview = {
            album: selectedAlbum,
            date: review.date.toISOString(),
            relisten: review.relisten,
            text: review.text,
            rating: review.rating,
        };
        addReviewToUser(user.uid, newReview);
        addReviewToAlbum(selectedAlbum.id, newReview);
        onClose();
    };

    // Focus on album search input
    useEffect(() => {
        inputRef.current.focus();
    }, []);
    
    return (
        <div className="relative ml-36">
        
            {/* Album Select Modal */}
            {!selectedAlbum ? 
                (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-gray-500 p-6 rounded-lg shadow-lg w-5/12 flex justify-between relative">
                        
                            <div className="w-full">
                                <div className="relative  w-full">
                                    <h2>Add a review...</h2>
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
                            
                            <button className="" onClick={confirmClose}>✖</button>
                        </div>
                    </div>
                ): 
                
                //Review Modal
                (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-500 p-6 rounded-lg shadow-lg  flex gap-8 items-start w-7/12">
                            {/* Modal Header */}
                            <div className="flex  flex-col gap-8 items-start">
                                <button className="text-gray-800 bg-gray-200 p-2" onClick={handleGoBack}>back</button>
                                <Image
                                    src={selectedAlbum.images[0]?.url}
                                    alt={selectedAlbum.name}
                                    width={250}
                                    height={250}
                                />
                            </div>


                            {/* Modal Content */}
                            <div className="flex flex-col gap-4">

                                <h2 className="text-lg">My review of...</h2>

                                <div className="flex flex-col mb-4">
                                    <div>
                                        <span className="text-2xl mr-2 font-bold">{selectedAlbum.name}</span>
                                        <span className="text-xl italic">{selectedAlbum.release_date?.split("-")[0]}</span>
                                    </div>
                                    <span className="text-xl">{selectedAlbum.artists[0].name}</span>
                                </div>


                                <form onSubmit={handleSubmit} className="space-y-4">


                                    <div className="flex gap-12">

                                        
                                        {/* Date */}
                                        <div className="flex gap-2 items-center justify-start">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Listened on
                                            </label>
                                            <DatePicker
                                                wrapperClassName="w-1/3"
                                                selected={review.date}
                                                onChange={handleDateChange}
                                                className="text-gray-950 bg-gray-600 w-full text-sm text-center hover:cursor-pointer cursor-not-allowed focus:outline-none"
                                                maxDate={new Date()}
                                                required
                                            />

                                        </div>

                                        {/* Re-listen */}
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="checkbox"
                                                name="title"
                                                value={review.relisten}
                                                onChange={handleInputChange}
                                                className="text-gray-800 min-w-3 mt-1  border rounded-lg focus:outline-none"
                                            />
                                            <label className="block text-sm font-medium text-gray-700">
                                                I&apos;ve heard this album before
                                            </label>
                                        </div>
                                    </div>


                                    {/* Review body */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Review
                                        </label>
                                        <textarea
                                            name="text"
                                            value={review.text}
                                            onChange={handleInputChange}
                                            className="text-gray-800 w-full mt-1 p-2 border rounded-lg focus:outline-none"
                                            rows="4"
                                            required
                                        />
                                    </div>


                                    {/* Rating */}
                                    <label className="block text-sm font-medium text-gray-700">
                                        Rating
                                    </label>
                                    <StarRating onRatingChange={handleRatingChange} />
                                    

                                    {/* Submit */}
                                    <div className="flex justify-end space-x-2">
                                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                            Save
                                        </button>
                                    </div>

                                </form>
                            </div>
                            
                            {/* Close */}
                            <button className="text-gray-800 hover:text-gray-800" onClick={closeModal}>
                                ✖
                            </button>

                        </div>
                    </div>
                )
            }


            {showConfirmation &&
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-gray-500 p-6 rounded-lg shadow-lg w-1/3 flex justify-between relative">
                        <p>Are you sure you want to discard your changes?</p>
                        <button onClick={confirmClose}>Yes</button>
                        <button onClick={cancelClose}>No</button>
                    </div>
                </div>
            }

            {showBackConfirmation &&
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-gray-500 p-6 rounded-lg shadow-lg w-1/3 flex justify-between relative">
                        <p>Are you sure you want to discard your changes?</p>
                        <button onClick={confirmGoBack}>Yes</button>
                        <button onClick={cancelGoBack}>No</button>
                    </div>
                </div>
            }

        </div>
    );
};


export default AddReview;
