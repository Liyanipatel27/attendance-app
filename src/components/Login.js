import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [enrollmentNumber, setEnrollmentNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 🛑 Temporarily bypass authentication
        if (enrollmentNumber === "1234" && password === "password") {
            localStorage.setItem("user", JSON.stringify({ name: "Test User", role: "student" }));
            navigate("/dashboard");  // Redirect to Dashboard
        } else {
            setError("Invalid Enrollment Number or Password.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Enrollment Number</label>
                        <input
                            type="text"
                            value={enrollmentNumber}
                            onChange={(e) => setEnrollmentNumber(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                            placeholder="Enter Enrollment Number"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                            placeholder="Enter Password"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
