import React, { useState, useEffect } from 'react';

function Students() {
  const [students, setStudents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    enrollment: '',
    name: '',
    className: ''
  });

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3001/classes');
        if (!response.ok) throw new Error('Failed to fetch classes');
        const data = await response.json();
        setAllClasses(data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };
    fetchClasses();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.enrollment) queryParams.append('enrollment', searchParams.enrollment.trim());
      
      if (searchParams.className) queryParams.append('class', searchParams.className.trim());

      const response = await fetch(`http://localhost:3001/students?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      
      const data = await response.json();
      setStudents(data);
      
      if (data.length === 0) {
        setError('No records found matching your criteria');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchParams({
      enrollment: '',
      name: '',
      className: ''
    });
    setStudents([]);
    setError(null);
  };

  return (
    <div className="student-container">
      <h1>Student Records</h1>
      
      <div className="search-box">
        <input
          type="text"
          name="enrollment"
          placeholder="Exact Enrollment No"
          value={searchParams.enrollment}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        
        <select
          name="className"
          value={searchParams.className}
          onChange={handleInputChange}
        >
          <option value="">All Classes</option>
          {allClasses.map(cls => (
            <option key={cls.id} value={cls.class_name}>
              {cls.class_name}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearSearch} className="clear-btn">Clear</button>
      </div>

      {error && <div className={`message ${students.length === 0 ? 'error' : 'info'}`}>{error}</div>}
      {loading && <div className="message loading">Loading...</div>}

      {students.length > 0 && (
        <div className="results-info">
          Found {students.length} record{students.length !== 1 ? 's' : ''}
        </div>
      )}

      {students.length > 0 && (
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
              <th>S.No</th>
                <th>Enrollment</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Type</th>
                <th>Semester</th>
                <th>Gender</th>
                <th>GNU Email</th>
                <th>Personal Email</th>
                <th>Batch</th>
                <th>Class</th>

               
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id || index}>
                   <td>{index + 1}</td>
                  <td>{student.enrollment_no || '-'}</td>
                  <td>{student.name || '-'}</td>
                  <td>{student.branch || '-'}</td>
                  <td>{student.hosteller_commuter || '-'}</td>
                  <td>{student.semester || '-'}</td>
                  <td>{student.gender || '-'}</td>
                  <td>
                    {student.gnu_email ? (
                      <a href={`mailto:${student.gnu_email}`}>{student.gnu_email}</a>
                    ) : '-'}
                  </td>
                  <td>
                    {student.personal_email ? (
                      <a href={`mailto:${student.personal_email}`}>{student.personal_email}</a>
                    ) : '-'}
                  </td>
                  <td>{student.batch || '-'}</td>
                  <td>{student.class || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Students;