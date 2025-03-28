import React from "react";
import { Link } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaClipboardList } from "react-icons/fa";

const Dashboard = () => {
    const menuItems = [
        { name: "Students", icon: <FaUserGraduate size={30} />, path: "/students", bgColor: "bg-blue-500" },
        { name: "Faculty", icon: <FaChalkboardTeacher size={30} />, path: "/faculty", bgColor: "bg-green-500" },
        
        { name: "View Attendance", icon: <FaClipboardList size={30} />, path: "/view-attendance", bgColor: "bg-purple-500" },
        { name: "Timetable", icon: <FaCalendarAlt size={30} />, path: "/timetable", bgColor: "bg-red-500" }
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-10">📊 Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-11/12 max-w-4xl">
                {menuItems.map((item, index) => (
                    <Link key={index} to={item.path} className="transition-transform transform hover:scale-105">
                        <div className={`flex items-center justify-between p-6 rounded-lg shadow-lg text-white ${item.bgColor}`}>
                            <div>
                                <h2 className="text-2xl font-semibold">{item.name}</h2>
                            </div>
                            {item.icon}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
