import React, { useState, useEffect } from "react";
//import '../styles/style.css';

const MyTimetable = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [timetable, setTimetable] = useState([]);
    const [currentDay, setCurrentDay] = useState(new Date().toLocaleString('en-us', { weekday: 'long' }));
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentLecture, setCurrentLecture] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Replace this with actual user's class ID from your auth system
    const userClassId = 1; // Example: Get from context/state

    // Fetch timetable when day changes
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:3001/timetable/${userClassId}/${currentDay}`
                );
                const data = await response.json();
                
                // Client-side sorting
                const sortedTimetable = data.timetable?.sort((a, b) => {
                    const getTimeValue = (timeStr) => {
                        if (!timeStr || !timeStr.includes(" - ")) return 0;
                        const [start] = timeStr.split(" - ");
                        let [hours, minutes] = start.split(":").map(Number);
                
                        // Convert 12-hour format to 24-hour format
                        if (hours < 8) hours += 12;
                
                        return hours * 60 + minutes;
                    };
                
                    return getTimeValue(a.time) - getTimeValue(b.time);
                }) || [];
                
                setTimetable(sortedTimetable);
                checkCurrentLecture(sortedTimetable);
            } catch (err) {
                setError("Failed to fetch timetable");
                console.error("Error fetching timetable:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimetable();
    }, [currentDay, userClassId]);

    // Update current time and check current lecture
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            checkCurrentLecture();
        }, 1000);
        return () => clearInterval(interval);
    }, [timetable]);

    const checkCurrentLecture = (timetableData = timetable) => {
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

        const runningLecture = timetableData.find(lecture => {
            if (!lecture.time) return false;
            
            const [start, end] = lecture.time.split(" - ");
            const [startH, startM] = start.split(":").map(Number);
            const [endH, endM] = end.split(":").map(Number);
            
            const startTimeInMinutes = startH * 60 + startM;
            const endTimeInMinutes = endH * 60 + endM;
            
            return currentTimeInMinutes >= startTimeInMinutes && 
                   currentTimeInMinutes < endTimeInMinutes;
        });

        setCurrentLecture(runningLecture || null);
    };

    if (isLoading && !timetable.length) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="timetable-container">
            <h2>📅 My Timetable</h2>
            <p>⏰ Current Time: {currentTime}</p>

            <div className="controls">
                <div className="day-buttons">
                    {daysOfWeek.map(day => (
                        <button
                            key={day}
                            onClick={() => setCurrentDay(day)}
                            className={currentDay === day ? "active" : ""}
                            disabled={isLoading}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {currentLecture ? (
                <div className="current-lecture highlight">
                    ✅ Current Lecture: {currentLecture.subject} 
                    {currentLecture.faculty && ` (${currentLecture.faculty})`}
                    {currentLecture.room && ` in ${currentLecture.room}`}
                </div>
            ) : (
                <div className="no-lecture">
                    ❌ No lecture is currently running
                </div>
            )}

            <h3>Timetable for {currentDay}</h3>

            {timetable.length > 0 ? (
                <div className="table-wrapper">
                    <table className="timetable-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Subject</th>
                                <th>Batch</th>
                                <th>Faculty</th>
                                <th>Room</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetable.map((lecture, index) => (
                                <tr 
                                    key={index}
                                    className={
                                        currentLecture && 
                                        currentLecture.time === lecture.time && 
                                        currentLecture.subject === lecture.subject ? 
                                        "highlight-row" : ""
                                    }
                                >
                                    <td>{lecture.time}</td>
                                    <td>{lecture.subject || '-'}</td>
                                    <td>{lecture.batch || '-'}</td>
                                    <td>{lecture.faculty || '-'}</td>
                                    <td>{lecture.room || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No timetable available for this day.</p>
            )}
        </div>
    );
};

export default MyTimetable;