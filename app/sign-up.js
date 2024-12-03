import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth";

export const SignUpModal = ({ isOpen, onClose }) => {
	
    const {user, emailSignIn, emailSignUp} = useUserAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
        
	if (!isOpen) return null;
	
	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			await emailSignUp(email, password, username);
			alert("Signup successful");
		} catch (error) {
			setErrorMessage(error.message);
		}
	}
	
	return (
		<div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-gray-500 p-5 rounded-md w-80 flex flex-col gap-8">

				<div className="flex justify-between items-center">
					<h2>Join Echorate</h2>
					<button className=" p-2 rounded-md" onClick={onClose}>✖</button>
				</div>

				<form className="flex flex-col gap-8" onSubmit={handleSignup}>


					<div className="flex flex-col relative">
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							className="p-1 rounded-md text-black"
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						{errorMessage && <p className="text-red-500 absolute top-full">{errorMessage}</p>}
					</div>

					
					<div className="flex flex-col">
						<label className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							className="p-1 rounded-md text-black"
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>

					
					<div className="flex flex-col">
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							className="p-1 rounded-md text-black"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button className="bg-gray-400 p-2 rounded-md" type="submit">Sign Up</button>
				</form>
			</div>
		</div>
	);
};

export default SignUpModal;
