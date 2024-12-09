"use client";

import React, { useEffect, useState } from "react";
import AlbumPreview from "./album-preview";
import { getAvgRating } from "../../_services/review-service";

export const QueueList = ({ albums, isOwnPage }) => {
    const [sortedActivity, setSortedActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState({type: "date", order: "desc"});
    const getDate = (timestamp) => {
        if (timestamp.toDate) {
            return timestamp.toDate();
        }
        return new Date(timestamp.seconds * 1000); 
    }

    useEffect(() => {
        if (!albums) {
            setLoading(true);
            return;
        }

        const fetchRatings = async () => {
            const ratingsMap = new Map();
            for (let album of [...albums]) {
                if (!ratingsMap.has(album.album.id)) {
                    const avgRating = await getAvgRating(album.album.id);
                    ratingsMap.set(album.album.id, avgRating);
                }
            }
            return ratingsMap;
        };

        const sortActivity = async () => {
            const ratingsMap = await fetchRatings();

            

            const activity = Array.from(
                albums.reduce((map, curr) => {
                    const id = curr.album.id;
                    const existing = map.get(id);

                    if (!existing || new Date(curr.date) > new Date(existing.date)) {
                        map.set(id, curr);
                    }
                    return map;
                }, new Map()).values()
            );

            let array = activity.sort((a, b) => new Date(b.date) - new Date(a.date));

            
            if (sortBy.type === "name") {
                array = array.sort((a, b) => b.album.name - a.album.name);
            } 
            else if (sortBy.type === "popularity") {
                array = array.sort((a, b) =>  b.album.popularity - a.album.popularity);
            }
            else if (sortBy.type === "date") {
                array = array.sort((a, b) => 
                    sortBy.order === "desc" 
                    ? b.date - a.date 
                    : a.date - b.date
                );
            }
            else if (sortBy.type === "release") {
                array = array.sort((a, b) => 
                    sortBy.order === "desc" 
                    ? new Date(b.album.release_date) - new Date(a.album.release_date) 
                    : new Date(a.album.release_date) - new Date(b.album.release_date)
                );
            }
            else if (sortBy.type === "rating") {
                array = array.sort((a, b) => 
                    sortBy.order === "desc"
                    ? b.rating - a.rating
                    : a.rating - b.rating
                );
            }
            else if (sortBy.type === "avgrating") {
                array = array.sort((a, b) => 
                    sortBy.order === "desc"
                    ? ratingsMap.get(b.album.id) - ratingsMap.get(a.album.id)
                    : ratingsMap.get(a.album.id) - ratingsMap.get(b.album.id)
                );
            }
            setSortedActivity(array);
            setLoading(false);
        };

        sortActivity();
    }, [albums, sortBy]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (sortedActivity.length === 0) {
        return <p>{isOwnPage ? "Your queue is empty." : "No albums to display"}</p>;
    }

    return (
        <div className="w-full flex flex-col gap-2">

            <div className="flex items-center justify-end gap-4">
                <p className="text-lg text-gray-400">Sort by:</p>
                <select className="bg-transparent text-gray-400 p-1 rounded-md focus:outline-none" 
                    value={`${sortBy.type}`}
                    onChange={(e) => {
                        const [type, order] = e.target.value.split(" ");
                        setSortBy({ type, order });
                    }}
                >

                    <option className="bg-gray-800" value="name desc">Album Name</option>
                    <option className="bg-gray-800" value="popularity desc">Popularity</option>

                    <option className="bg-gray-800" disabled value="release">Release Date</option>
                    <option className="bg-gray-800" value="release desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Newest First</option>
                    <option className="bg-gray-800" value="release asc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Earliest First</option>

                    <option className="bg-gray-800" disabled value="avgrating">Average Rating</option>
                    <option className="bg-gray-800" value="avgrating desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highest First</option>
                    <option className="bg-gray-800" value="avgrating asc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lowest First</option>

                </select>
            </div>

            <div className="border-b-2 border-gray-800 pb-0.5"></div>
                <div className="flex flex-wrap gap-4">
                    {sortedActivity.map((album) => (
                        <div key={album.album.id} className="flex gap-4">
                            <AlbumPreview album={album.album} size={112} />
                        </div>
                    ))}
                </div>
        </div>
    );
};