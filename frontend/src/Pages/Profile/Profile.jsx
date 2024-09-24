import React, { useState, useEffect } from 'react';
import useGetUserDetails from '../../hooks/useGetUserDetails';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user_data, setUser_data } = useGetUserDetails();
    const [loader, setLoader] = useState(false);
    const [recentURLs, setRecentURLs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getRecentURLs();
    }, []);

    const getRecentURLs = async () => {
        if (user_data) {
            try {
                setLoader(true);
                const resp = await fetch(`${import.meta.env.VITE_Backend}/s_url/getRecent`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                });
                const res = await resp.json();
                if (resp.status === 200) {
                    setRecentURLs(res.data);
                }
                setLoader(false);
            } catch (err) {
                console.log(err.message);
                setLoader(false);
            }
        }
    };

    const handleSignout = async () => {
        try {
            setLoader(true);
            const resp = await fetch(`${import.meta.env.VITE_Backend}/user/signout`, {
                method: 'post',
                headers: { "Content-Type": "Application/json" },
                credentials: 'include'
            });
            const res = await resp.json();
            if (res.msg === "done") {
                toast.success("Signed Out successfully.");
                localStorage.removeItem("user_data");
                setUser_data("");
                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 2000);
            }
            setLoader(false);
        } catch (err) {
            console.log(err.message);
            setLoader(false);
        }
    };

    if (!user_data) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 text-center">
                        <div className="flex flex-col items-center">
                            <i className="fas fa-user-circle text-6xl text-blue-500 mb-4"></i>
                            <h2 className="text-3xl font-bold text-gray-900">{user_data.name}</h2>
                            <p className="mt-1 text-sm text-gray-500">{user_data.email}</p>
                            <p className="mt-1 text-sm text-gray-500 uppercase">{user_data.role}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Total URLs</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{recentURLs.length}</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                            onClick={handleSignout}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Short URLs</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        {loader ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : recentURLs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Long URL</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentURLs.map((url) => (
                                            <tr key={url._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{url.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                                    <a href={`${import.meta.env.VITE_Backend}/${url.short_id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {`${import.meta.env.VITE_Backend}/${url.short_id}`}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <a href={url.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {url.url.length > 30 ? url.url.substring(0, 30) + '...' : url.url}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{url.visits}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center py-4 text-gray-500">No recent URLs to display</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
