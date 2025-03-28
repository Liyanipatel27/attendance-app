import React, { useState, useEffect } from "react";
import '../styles/style.css';

const Timetable = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [timetable, setTimetable] = useState([]);
    const [currentDay, setCurrentDay] = useState(new Date().toLocaleString('en-us', { weekday: 'long' }));
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [currentLecture, setCurrentLecture] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:3001/classes');
                const data = await response.json();
                setClasses(data);
                if (data.length > 0) setSelectedClass(data[0].id);
            } catch (err) {
                setError("Failed to fetch classes");
                console.error("Error fetching classes:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Fetch timetable when class or day changes
    useEffect(() => {
        const fetchTimetable = async () => {
            if (!selectedClass) return;
            
            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:3001/timetable/${selectedClass}/${currentDay}`
                );
                const data = await response.json();
                
                // Fallback client-side sorting if backend doesn't sort
                const sortedTimetable = data.timetable.sort((a, b) => {
                    const getTimeValue = (timeStr) => {
                        if (!timeStr || !timeStr.includes(" - ")) return 0;
                        const [start] = timeStr.split(" - ");
                        let [hours, minutes] = start.split(":").map(Number);
                
                        // Convert 12-hour format to 24-hour format
                        if (hours < 8) hours += 12; // 1:20 PM ko 13:20 banana
                
                        return hours * 60 + minutes; // Sorting ke liye minutes me convert karna
                    };
                
                    return getTimeValue(a.time) - getTimeValue(b.time);
                });
                
                
                setTimetable(sortedTimetable || []);
                checkCurrentLecture(sortedTimetable || []);
            } catch (err) {
                setError("Failed to fetch timetable");
                console.error("Error fetching timetable:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimetable();
    }, [selectedClass, currentDay]);

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
            <h2>📅 Timetable</h2>
            <p>⏰ Current Time: {currentTime}</p>

            <div className="controls">
                <div className="class-selector">
                    <label>Class: </label>
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        disabled={isLoading}
                    >
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.class_name}
                            </option>
                        ))}
                    </select>
                </div>

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

            <h3>Timetable for {classes.find(c => c.id == selectedClass)?.class_name} - {currentDay}</h3>

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

export default Timetable;