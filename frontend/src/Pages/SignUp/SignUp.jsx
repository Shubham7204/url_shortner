import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [uname, setUname] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        toast.info('Tryout Credentials \n Email : test123@gmail.com \n Password : test', {
            autoClose: 6000,
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!uname || !email || !pass) {
            toast.error("All fields are Mandatory.");
        } else {
            const user = {
                username: uname,
                email: email,
                password: pass
            };
            try {
                setLoader(true);
                let resp;
                setTimeout(() => {
                    resp ? null : toast.warning("Server has started Now.\nPlease wait for few seconds", { autoClose: 4000 });
                }, 6000);
                const res = await fetch(`${import.meta.env.VITE_Backend}/user/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user),
                    credentials: 'include'
                });
                resp = await res.json();
                if (res.status === 200) {
                    toast.success(resp.msg);
                    setTimeout(() => {
                        navigate('/signin');
                    }, 2000);
                } else {
                    toast.warning(resp.msg);
                }
                setLoader(false);
            } catch (err) {
                console.log(err);
                setLoader(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
                {loader ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Enter Your Name"
                                value={uname}
                                onChange={(e) => setUname(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Enter Your Email ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Enter Your Password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Sign Up
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SignUp;