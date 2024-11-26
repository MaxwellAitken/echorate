"use client";

import React, { createContext, useContext, useState } from "react";
import { fetchAlbumDetails } from "./spotifyApi";

const AlbumContext = createContext();


export const AlbumProvider = ({ children }) => {
    const [albumCache, setAlbumCache] = useState({});
    
    
    const getAlbum = async (albumId, token, refreshToken) => {
        if (albumCache[albumId]) {
            return albumCache[albumId];
        }
        
        try {
            const album = await fetchAlbumDetails(albumId, token, refreshToken);
            setAlbumCache((prev) => ({
                ...prev,
                [albumId]: album,
            }));
            return album;
        } catch (error) {
            console.error("Error fetching album data:", error);
            throw error;
        }
    };
    
    return (
        <AlbumContext.Provider value={{ getAlbum }}>
        {children}
        </AlbumContext.Provider>
    );
};

export const useAlbum = () => useContext(AlbumContext);