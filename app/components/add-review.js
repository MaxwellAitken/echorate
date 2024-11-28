"use client"

import { addReview } from "@/_services/review-service";
import { useState, useEffect } from "react";
import { useUserAuth } from "@/_utils/auth";
import { useToken } from '../../_utils/token-context';
import { fetchAlbumSearchResults } from "@/_utils/spotifyApi";
import Image from "next/image";

export const AddReview = ({ }) => {
    
    const { user } = useUserAuth();
    const { token } = useToken(); // Assuming token is available for authentication
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [review, setReview] = useState({
        title: "",
        text: "",
        rating: "",
    });


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

    const handleAlbumSelect = (album) => {
        setSelectedAlbum(album);
      };
    
    // Open Modal
    const openModal = () => setIsModalOpen(true);
    
    // Close Modal
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedAlbum(null);
        setReview({
            title: "",
            text: "",
            rating: "",
        });
        setSearchQuery('');
    };
    
    // Handle Review Input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReview((prev) => ({ ...prev, [name]: value }));
    };
    
    // Handle Review Submission
    const handleSubmit = (e) => {
        if (!selectedAlbum) return;
        e.preventDefault();

        let newReview = {
            title: review.title,
            text: review.text,
            rating: parseInt(review.rating),
        };
        addReview(user.uid, newReview); // Add review to database
        closeModal(); // Close modal after submission
    };
    
    return (
        <div className="relative ml-36">
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={openModal}>
        + Add Review
        </button>
        
        {/* Modal */}
        {isModalOpen ?
        (
            !selectedAlbum ? 
            (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-400 p-6 rounded-lg shadow-lg w-5/12 flex justify-between relative">
                    
                        <div className="relative w-full">
                            <div className="absolute w-full">
                                {/* <h2>Search for an album</h2> */}
                                <input
                                    type="text"
                                    placeholder="Search for an album"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <ul className="mt-8 flex flex-col gap-4">
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
                        
                        <button className="" onClick={closeModal}>✖</button>
                    </div>
                </div>
            ): 
            (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-400 p-6 rounded-lg shadow-lg w-96">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Your Review of {selectedAlbum.name}</h2>
                            <Image
                                src={selectedAlbum.images[0]?.url}
                                alt={selectedAlbum.name}
                                width={50}
                                height={50}
                            />
                            <button className="text-gray-800 hover:text-gray-800" onClick={closeModal}>
                                ✖
                            </button>
                        </div>
                
                        {/* Modal Content */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={review.title}
                                    onChange={handleInputChange}
                                    className="text-gray-800 w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Review
                                </label>
                                <textarea
                                    name="text"
                                    value={review.text}
                                    onChange={handleInputChange}
                                    className="text-gray-800 w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Rating (1-5)
                                </label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={review.rating}
                                    onChange={handleInputChange}
                                    className="text-gray-800 w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="5"
                                    required
                                />
                            </div>


                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                    Submit
                                </button>
                            </div>

                            
                        </form>
                    </div>
                </div>
            )

        
        ): 
        (
            <div></div>
        )}
        </div>
    );
};


export default AddReview;
