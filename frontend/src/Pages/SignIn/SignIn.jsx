import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SignIn = () => {
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
        if (!email || !pass) {
            toast.error("All fields are Mandatory.");
        } else {
            const cred = { email, password: pass };
            try {
                setLoader(true);
                let resp;
                setTimeout(() => {
                    if (!resp) toast.warning("Server has started Now.\nPlease wait for few seconds", { autoClose: 4000 });
                }, 6000);
                const res = await fetch(`${import.meta.env.VITE_Backend}/user/signin`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cred),
                    credentials: 'include'
                });
                resp = await res.json();
                if (res.status === 200) {
                    const udata = jwtDecode(resp.token);
                    localStorage.setItem("user_data", JSON.stringify(udata));
                    toast.success(resp.msg + " .Redirecting to Home");
                    setTimeout(() => {
                        navigate('/');
                        window.location.reload();
                    }, 2000);
                } else {
                    toast.error(resp.msg);
                    setPass("");
                    setEmail("");
                }
            } catch (err) {
                console.log(err);
                toast.error("An error occurred. Please try again.");
            } finally {
                setLoader(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {loader ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignIn;