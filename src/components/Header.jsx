import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <nav className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <Link to={"/"} className="text-2xl font-bold tracking-wide">
                        Quản lý nhân sự
                    </Link>

                    <div className="flex space-x-12">
                        <div className="">
                            <Link to={"/"} className="hover:text-yellow-300 transition duration-200 p-4">
                                Danh sách nhân sự
                            </Link>
                        </div>

                        <div>
                            <Link to={"/addEmployee"} className="hover:text-yellow-300 transition duration-200 p-4">
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
