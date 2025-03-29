import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';

const FacultyAttendance = ({ onSessionChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isTestingMode, setIsTestingMode] = useState(true); // Added testing mode state

  // Define class schedule
  const classSchedule = [
    { name: 'Morning Class', start: 9, end: 11 },
    { name: 'Afternoon Class', start: 13, end: 15 },
    { name: 'Evening Class', start: 17, end: 19 }
  ];

  // Get current class based on time
  const getCurrentClass = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return classSchedule.find(cls => 
      currentHour >= cls.start && currentHour < cls.end
    );
  };

  // Get user location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          // For testing, use default location if geolocation fails
          setLocation({
            lat: 28.6129,
            lng: 77.2295
          });
          setError('Using default location for testing: ' + err.message);
        }
      );
    } else {
      // Default location for testing
      setLocation({
        lat: 28.6129,
        lng: 77.2295
      });
      setError('Geolocation not supported - using default location for testing');
    }
  };

  // Check current class on component mount and every minute
  useEffect(() => {
    const classCheck = () => {
      const current = getCurrentClass();
      // For testing, use first class if no current class
      setCurrentClass(current || classSchedule[0]);
    };

    classCheck();
    const interval = setInterval(classCheck, 60000);

    return () => clearInterval(interval);
  }, []);

  // Auto-start attendance for testing
  useEffect(() => {
    if (isTestingMode) {
      const timer = setTimeout(() => {
        if (!isActive) {
          startAttendance();
        }
      }, 3000); // Start after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isTestingMode, isActive]);

  const startAttendance = () => {
    getLocation();
    setIsActive(true);
    onSessionChange(true);
  };

  const stopAttendance = () => {
    setIsActive(false);
    onSessionChange(false);
  };

  const toggleSession = () => {
    if (isActive) {
      stopAttendance();
    } else {
      startAttendance();
    }
  };

  return (
    <div className="faculty-panel">
      <h2>Faculty Control Panel</h2>
      {isTestingMode && (
        <div className="testing-notice">
          <p>TESTING MODE: Attendance will auto-start in 3 seconds</p>
          <button onClick={() => setIsTestingMode(false)}>
            Disable Testing Mode
          </button>
        </div>
      )}
      
      <div className="class-info">
        {currentClass ? (
          <p>Current Class: {currentClass.name} ({currentClass.start}:00 - {currentClass.end}:00)</p>
        ) : (
          <p>No class scheduled (using test class)</p>
        )}
      </div>

      <button 
        onClick={toggleSession}
        className={isActive ? 'stop-btn' : 'start-btn'}
      >
        {isActive ? 'Stop Attendance' : 'Start Attendance'}
      </button>

      <div className={`status ${isActive ? 'active' : 'inactive'}`}>
        Status: {isActive ? 'ACTIVE' : 'INACTIVE'}
      </div>

      {isActive && location && (
        <div className="location-info">
          <p>Location recorded:</p>
          <p>Latitude: {location.lat.toFixed(4)}</p>
          <p>Longitude: {location.lng.toFixed(4)}</p>
          {error && <p className="location-warning">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;