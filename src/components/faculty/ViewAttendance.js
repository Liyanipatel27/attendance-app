import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewAttendance = () => {
  // Sample data - replace with API call
  const attendanceRecords = [
    { date: '2023-10-01', subject: 'Mathematics', present: 25, total: 30 },
    { date: '2023-10-02', subject: 'Physics', present: 28, total: 30 }
  ];

  return (
    <div className="attendance-records">
      <h2>Attendance Records</h2>
      <div className="records-grid">
        {attendanceRecords.map((record, index) => (
          <div key={index} className="record-card">
            <h3>{record.subject}</h3>
            <p>Date: {record.date}</p>
            <p>Present: {record.present}/{record.total}</p>
            <p>Percentage: {Math.round((record.present/record.total)*100)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAttendance;