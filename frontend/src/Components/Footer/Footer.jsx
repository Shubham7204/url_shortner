import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    {/* Branding */}
                    <div className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0 mr-2">
                        TrimURL
                    </div>

                    {/* Social Links */}
                    <div className="flex space-x-4 mb-4 sm:mb-0">
                        <a
                            href="https://github.com/Shubham7204/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                        >
                            <i className="fab fa-github text-2xl"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/shubham-mourya-b09502203/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                        >
                            <i className="fab fa-linkedin text-2xl"></i>
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-gray-600 sm:ml-auto">
                        © {new Date().getFullYear()} Shubham Mourya. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
