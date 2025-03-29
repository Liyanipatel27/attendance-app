import React, { useState } from 'react';
import FacultyAttendance from './FacultyAttendance';
import FaceAttendanceSystem from './FaceAttendanceSystem';

const AttendanceSystem = ({ userType }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);

  return (
    <div className="attendance-system">
      {userType === 'faculty' ? (
        <FacultyAttendance 
          onSessionChange={setIsSessionActive}
        />
      ) : (
        <FaceAttendanceSystem 
          isSessionActive={isSessionActive} 
        />
      )}
    </div>
  );
};

export default AttendanceSystem;