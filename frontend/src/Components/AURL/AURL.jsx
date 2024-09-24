import React from 'react';
import { toast } from 'react-toastify';
import { ClipboardCopy } from 'lucide-react';

const URL = ({ data, heading }) => {
    const { _id, name, url, short_id } = data;

    const copyLink = (url) => {
        navigator.clipboard.writeText(url);
        toast.success("Copied to Clipboard");
    };

    const shortUrl = `${import.meta.env.VITE_Backend}/${short_id}`;

    return (
        <div className="bg-gray-50 shadow-md rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div className="font-semibold text-lg text-gray-900">{name}</div>

                {/* Short URL */}
                <div className="relative flex items-center">
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-indigo-500 hover:text-indigo-700 break-all flex items-center ${heading ? 'cursor-not-allowed opacity-70' : ''
                            }`}
                    >
                        {heading ? "Short URL" : shortUrl}
                    </a>
                    {!heading && (
                        <button
                            onClick={() => copyLink(shortUrl)}
                            className="ml-3 text-gray-500 hover:text-gray-700"
                            aria-label="Copy Short URL"
                        >
                            <ClipboardCopy className="w-5 h-5" /> {/* ClipboardCopy icon */}
                        </button>
                    )}
                </div>

                {/* Original URL */}
                <div className="relative flex items-center">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-green-600 hover:text-green-800 break-all flex items-center ${heading ? 'cursor-not-allowed opacity-70' : ''
                            }`}
                    >
                        {heading ? "Original URL" : url}
                    </a>
                    {!heading && (
                        <button
                            onClick={() => copyLink(url)}
                            className="ml-3 text-gray-500 hover:text-gray-700"
                            aria-label="Copy Original URL"
                        >
                            <ClipboardCopy className="w-5 h-5" /> {/* ClipboardCopy icon */}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default URL;