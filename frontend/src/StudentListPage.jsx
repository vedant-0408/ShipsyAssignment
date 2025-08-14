import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentListPage = () => {
    const [students, setStudents] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [error, setError] = useState('');

    const fetchStudents = async (url) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setStudents(response.data.results);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            setError('Failed to fetch students');
        }
    };

    useEffect(() => {
        fetchStudents('http://localhost:8000/api/students/');
    }, []);

    return (
        <div>
            <h2>Student List</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.age}</td>
                            <td>{student.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {prevPage && <button onClick={() => fetchStudents(prevPage)}>Previous</button>}
                {nextPage && <button onClick={() => fetchStudents(nextPage)}>Next</button>}
            </div>
        </div>
    );
};

export default StudentListPage;
