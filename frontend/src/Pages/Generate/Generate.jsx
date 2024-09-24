import React, { useEffect, useState } from 'react';
import useGetUserDetails from '../../hooks/useGetUserDetails';
import { toast } from 'react-toastify';
import { Copy, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const Generate = () => {
  const { user_data } = useGetUserDetails();
  const [long_url, setLong_url] = useState("");
  const [url_name, setUrl_name] = useState("");
  const [s_url, setS_url] = useState("SHORT URL");
  const [recentURL, setRecentURL] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    getRecent();
  }, [user_data]);

  const getRecent = async () => {
    if (user_data) {
      try {
        setLoader(true);
        let res;
        const timeoutId = setTimeout(() => {
          if (!res) toast.warning("Server has started Now.\nPlease wait for few seconds", { autoClose: 4000 });
        }, 5000);
        const resp = await fetch(`${import.meta.env.VITE_Backend}/s_url/getRecent`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include'
        });
        res = await resp.json();
        if (resp.status === 200) {
          setRecentURL(res.data);
        } else {
          setRecentURL([]);
        }
        clearTimeout(timeoutId);
        setLoader(false);
      } catch (err) {
        console.log(err.message);
        setLoader(false);
      }
    }
  };

  const handleCreatesurl = async (e) => {
    e.preventDefault();
    const payload = {
      l_url: long_url,
      name: url_name
    };
    if (!url_name || !long_url) {
      toast.error("Fill all fields");
    } else if (url_name.length > 11) {
      toast.warning("Use Short Name");
    } else {
      try {
        const res = await fetch(`${import.meta.env.VITE_Backend}/s_url/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
        const resp = await res.json();
        if (res.status === 200) {
          toast.success(resp.msg);
          setLong_url("");
          setUrl_name("");
          const shortUrlId = resp.short_id || resp.s_id;
          if (shortUrlId) {
            setS_url(`${import.meta.env.VITE_Backend}/${shortUrlId}`);
          } else {
            console.error('Short URL identifier is missing from the response');
            toast.error('Failed to generate short URL');
          }
          getRecent();
        } else {
          toast.warning(resp.msg);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const copyToClipboard = (text) => {
    if (!text) {
      toast.error("No URL available to copy");
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error("Failed to copy");
    });
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const shareQRCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Short URL QR Code',
        text: 'Check out this short URL',
        url: s_url
      }).then(() => {
        toast.success("Shared successfully!");
      }).catch((err) => {
        console.error("Error sharing: ", err);
      });
    } else {
      toast.error("Sharing not supported on this browser");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Generate Short URL</h2>
        {loader ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <form onSubmit={handleCreatesurl} className="space-y-6 mb-8">
              <div>
                <label htmlFor="long_url" className="block text-sm font-medium text-gray-700">
                  Long URL
                </label>
                <input
                  id="long_url"
                  type="url"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter long URL"
                  value={long_url}
                  onChange={(e) => setLong_url(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="url_name" className="block text-sm font-medium text-gray-700">
                  URL Name
                </label>
                <input
                  id="url_name"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter URL name"
                  value={url_name}
                  onChange={(e) => setUrl_name(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Short URL
              </button>
            </form>
            {s_url !== "SHORT URL" && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Generated Short URL</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Short URL</dt>
                      <dd className="mt-1 text-sm text-blue-600 sm:mt-0 sm:col-span-2">
                        <a href={s_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {s_url}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Short URLs [{recentURL.length}]</h2>
              {recentURL.length > 0 ? (
                <>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Short URL
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentURL.map((ele) => (
                          <tr key={ele._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ele.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                              <a href={`${import.meta.env.VITE_Backend}/${ele.short_id}`} target="_blank" rel="noopener noreferrer">
                                {`${import.meta.env.VITE_Backend}/${ele.short_id}`}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => copyToClipboard(`${import.meta.env.VITE_Backend}/${ele.short_id}`)}
                              >
                                <Copy className="h-5 w-5 inline" /> Copy
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900 ml-4"
                                onClick={() => {
                                  setS_url(`${import.meta.env.VITE_Backend}/${ele.short_id}`);
                                  setShowQR(true);
                                }}
                              >
                                <QrCode className="h-5 w-5 inline" /> Generate QR
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-gray-500">No recent URLs found.</p>
              )}
            </div>

            {/* QR Code Modal */}
            {showQR && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="bg-white p-5 rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold mb-4">QR Code for {s_url}</h3>
                  <QRCodeCanvas id="qr-code" value={s_url} size={256} />
                  <div className="mt-4 flex justify-around">
                    <button onClick={downloadQRCode} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Download QR
                    </button>
                    <button onClick={shareQRCode} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                      Share QR
                    </button>
                    <button onClick={() => setShowQR(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Generate;