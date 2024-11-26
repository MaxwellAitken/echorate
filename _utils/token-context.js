"use client";

import { createContext, useContext, useState, useEffect } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const fetchToken = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/token`);
            const data = await response.json();
            setToken(data.token);
        } catch (error) {
            console.error("Error fetching token:", error);
        }
    };

    const refreshToken = async () => {
        await fetchToken();
    };

    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <TokenContext.Provider value={{ token, refreshToken }}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => {
    return useContext(TokenContext);
};
