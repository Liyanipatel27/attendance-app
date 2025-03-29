import React from 'react';
import { Link } from 'react-router-dom';
import './FacultyDashboard.css'; // Assuming you have a CSS file for styling

const FacultyDashboard = () => {
  return (
    <div className="simple-dashboard">
      <h1>Faculty Portal</h1>
      
      <div className="button-grid">
        <Link to="/my-timetable" className="simple-button">
          My Timetable
        </Link>
        
        <Link to="/faculty-attendance" className="simple-button">
          Take Attendance
        </Link>
        
        <Link to="/view-attendance" className="simple-button">
          View Attendance
        </Link>
        
        <Link to="/timetable" className="simple-button">
          College Timetable
        </Link>
        
        <Link to="/students" className="simple-button">
          Student List
        </Link>
        
        <Link to="/faculty" className="simple-button">
          Faculty Directory
        </Link>
      </div>
    </div>
  );
};

export default FacultyDashboard;