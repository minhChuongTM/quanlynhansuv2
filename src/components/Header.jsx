import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <nav className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition duration-200"
                    >
                        Quản lý nhân sự
                    </Link>

                    {/* Nav Links */}
                    <div className="flex space-x-8">
                        <div className="hover:bg-green-600 p-3 rounded-2xl transition duration-300">
                            <Link to="/" className="hover:text-yellow-300 transition duration-200">
                                Danh sách nhân sự
                            </Link>
                        </div>
                        <div className="hover:bg-green-600 p-3 rounded-2xl transition duration-300">
                            <Link to="/addEmployees" className="hover:text-yellow-300 transition duration-200 px-3">
                                Thêm nhân sự
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
