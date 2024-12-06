import { useEffect } from "react";

const Notification = ({ message, duration = 3000, onClose, color }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    return (
        <div className={`fixed top-4 left-4 z-50 ${color} text-white px-4 py-2 rounded-lg shadow-md`}>
            {message}
        </div>
    );
};

export default Notification;
