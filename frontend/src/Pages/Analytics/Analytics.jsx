import React, { useEffect, useState } from 'react';
import useGetUserDetails from '../../hooks/useGetUserDetails';
import AURL from '../../Components/AURL/AURL';
import PieChart from '../../Components/PieChart/PieChart';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react'; 

const Analytics = () => {
    const { user_data } = useGetUserDetails();
    const [data, setData] = useState();
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        getAnalyticsData();
    }, []);

    const getAnalyticsData = async () => {
        if (user_data) {
            try {
                let res = -1;
                setTimeout(() => {
                    res !== -1 ? null : toast.warning("Server has started Now.\nPlease wait for few seconds", { autoClose: 4000 });
                }, 5000);
                const resp = await fetch(`${import.meta.env.VITE_Backend}/s_url/analytics`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                });
                res = await resp.json();
                if (resp.status === 200) {
                    setData(res);
                }
                setLoader(false);
            } catch (err) {
                console.log(err.message);
                setLoader(false);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_Backend}/s_url/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
                credentials: 'include'
            });
            const resp = await res.json();
            if (res.status === 200) {
                toast.success(resp.msg);
                getAnalyticsData();
            } else {
                toast.error(resp.msg);
            }
        } catch (err) {
            console.log(err.message);
            toast.error("Failed to delete URL.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Analytics</h2>
                {loader ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    data?.url_data?.length >= 1 ? ( 
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total URL's</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-blue-600">{data?.urls}</dd>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-green-600">{data?.clicks}</dd>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Most Clicks</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-purple-600">{data?.most_clicks}</dd>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-8">
                                <PieChart data={data?.url_data} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">URL Analytics</h3>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    {data && <AURL data={{ name: "Name", url: "URL", short_id: "Short URL", clicks: "Clicks", actions: "" }} heading={true} />}
                                    {data?.url_data?.map((ele) => (
                                        <div key={ele._id} className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                                            <AURL data={ele} />
                                            <button onClick={() => handleDelete(ele._id)} className="text-red-600 hover:text-red-800">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h3 className="mt-2 text-xl font-medium text-gray-900">Not Enough Analytics Data</h3>
                            <p className="mt-1 text-sm text-gray-500">Please generate at least one URLs to display analytics.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Analytics;
