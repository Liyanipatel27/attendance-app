import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MarkAttendance() {
  const { sessionId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch session info
        const sessionRes = await fetch(`http://localhost:3001/active-sessions/1`);
        const sessionData = await sessionRes.json();
        const currentSession = sessionData.find(s => s.session_id == sessionId);
        
        if (!currentSession) {
          throw new Error('Session not found or expired');
        }
        
        setSessionInfo(currentSession);

        // Fetch students
        const studentsRes = await fetch(`http://localhost:3001/students/${currentSession.class_id}`);
        const studentsData = await studentsRes.json();
        
        setStudents(studentsData.map(student => ({
          ...student,
          marked: false
        })));
        
      } catch (err) {
        console.error('Error:', err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const handleMarkAttendance = async (studentId) => {
    try {
      const response = await fetch('http://localhost:3001/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          student_id: studentId
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        // Update UI
        setStudents(prev => prev.map(s => 
          s.id === studentId ? {...s, marked: true} : s
        ));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to mark attendance');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!sessionInfo) return <div>Session not found</div>;

  return (
    <div className="container">
      <h1>Mark Attendance</h1>
      <div className="session-info">
        <p>Class: {sessionInfo.class_name}</p>
        <p>Subject: {sessionInfo.subject_name}</p>
        <p>Started: {new Date(sessionInfo.start_time).toLocaleString()}</p>
      </div>
      
      <h2>Students</h2>
      <div className="student-list">
        {students.map(student => (
          <div key={student.id} className="student-card">
            <div>
              <p>{student.name}</p>
              <p>{student.enrollment_no}</p>
            </div>
            <button
              onClick={() => handleMarkAttendance(student.id)}
              disabled={student.marked}
            >
              {student.marked ? 'Present ✓' : 'Mark Present'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarkAttendance;