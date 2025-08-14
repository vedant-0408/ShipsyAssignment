import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import EditStudentModal from './EditStudentModal';
import AddStudentModal from './AddStudentModal';
import './StudentListPage.css';

const StudentListPage = () => {
    const [students, setStudents] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(true);
    const navigate = useNavigate(); 

    // Filter options
    const gradeOptions = ['A', 'B', 'C', 'D', 'F'];
    const scoreOperators = ['eq', 'lt', 'lte', 'gt', 'gte'];
    const operatorLabels = {
        'eq': 'equals',
        'lt': 'less than',
        'lte': 'less than or equal',
        'gt': 'greater than',
        'gte': 'greater than or equal'
    };

    const fetchStudents = async (url, search = '', ordering = 'name', appliedFilters = {}) => {
        try {
            const token = localStorage.getItem('token');
            const params = {
                search,
                ordering,
                ...buildFilterParams(appliedFilters)
            };
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Token ${token}`,
                },
                params,
            });
            setStudents(response.data.results);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
            setCount(response.data.count);
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const page = urlParams.get('page');
            setCurrentPage(page ? parseInt(page, 10) : 1);
        } catch (error) {
            setError('Failed to fetch students');
        }
    };

    const buildFilterParams = (appliedFilters) => {
        const params = {};
        
        // Debug: Log filters to console
        console.log('Applied filters:', appliedFilters);
        
        // Grade filter
        if (appliedFilters.grade && appliedFilters.grade.trim() !== '') {
            params.grade = appliedFilters.grade;
            console.log('Adding grade filter:', appliedFilters.grade);
        }
        
        // Midterm score filter
        if (appliedFilters.midterm_score_operator && appliedFilters.midterm_score_value) {
            const operator = appliedFilters.midterm_score_operator;
            const value = appliedFilters.midterm_score_value;
            
            if (operator === 'eq') {
                params.midterm_score = value;
            } else {
                params[`midterm_score__${operator}`] = value;
            }
            console.log('Adding midterm filter:', `midterm_score${operator === 'eq' ? '' : '__' + operator}`, value);
        }
        
        // Final exam score filter
        if (appliedFilters.final_exam_score_operator && appliedFilters.final_exam_score_value) {
            const operator = appliedFilters.final_exam_score_operator;
            const value = appliedFilters.final_exam_score_value;
            
            if (operator === 'eq') {
                params.final_exam_score = value;
            } else {
                params[`final_exam_score__${operator}`] = value;
            }
            console.log('Adding final exam filter:', `final_exam_score${operator === 'eq' ? '' : '__' + operator}`, value);
        }
        
        // Final score filter
        if (appliedFilters.final_score_operator && appliedFilters.final_score_value) {
            const operator = appliedFilters.final_score_operator;
            const value = appliedFilters.final_score_value;
            
            if (operator === 'eq') {
                params.final_score = value;
            } else {
                params[`final_score__${operator}`] = value;
            }
            console.log('Adding final score filter:', `final_score${operator === 'eq' ? '' : '__' + operator}`, value);
        }
        
        console.log('Final params being sent to API:', params);
        return params;
    };

    useEffect(() => {
        const ordering = `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
        fetchStudents('http://localhost:8000/api/students/', searchTerm, ordering, filters);
    }, [searchTerm, sortField, sortOrder, filters]);

    const handleDelete = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/api/students/${studentId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const ordering = `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
                fetchStudents('http://localhost:8000/api/students/', searchTerm, ordering, filters);
            } catch (error) {
                setError('Failed to delete student');
            }
        }
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
    };

    const handleSave = () => {
        const ordering = `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
        fetchStudents('http://localhost:8000/api/students/', searchTerm, ordering, filters);
        setIsAddModalOpen(false);
        setSelectedStudent(null);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
        setIsAddModalOpen(false);
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/users/logout/', {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            localStorage.removeItem('token');
            navigate('/'); 
        } catch (error) {
            console.error('Logout failed', error);
            localStorage.removeItem('token'); 
            navigate('/'); 
        }
    };

    const pageSize = 10;
    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, count);

    const renderSortIcon = (field) => {
        const isActive = field === sortField;
        const icon = sortOrder === 'asc' ? '▲' : '▼';
        return (
            <span className={`sort-icon ${isActive ? 'active' : ''}`}>
                {icon}
            </span>
        );
    };

    const getActiveFiltersCount = () => {
        return Object.keys(filters).filter(key => filters[key] && filters[key] !== '').length;
    };

    const renderFilterBadge = (label, value) => {
        if (!value) return null;
        return (
            <span className="filter-badge">
                <strong>{label}:</strong> {value}
            </span>
        );
    };

    return (
        <div className="container-fluid mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Student Data - Shipsy</h2>
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="btn btn-success" onClick={handleOpenAddModal}>
                        ➕ Add Student
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="main-content-row">
            {/* Main table section */}
            <div className="table-section">
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th className="sortable-header" onClick={() => handleSort('name')}>
                                    Name{renderSortIcon('name')}
                                </th>
                                <th className="sortable-header" onClick={() => handleSort('grade')}>
                                    Grade{renderSortIcon('grade')}
                                </th>
                                <th className="sortable-header" onClick={() => handleSort('midterm_score')}>
                                    Midterm Score{renderSortIcon('midterm_score')}
                                </th>
                                <th className="sortable-header" onClick={() => handleSort('final_exam_score')}>
                                    Final Exam Score{renderSortIcon('final_exam_score')}
                                </th>
                                <th>
                                    Final Score (Calculated)
                                </th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        {getActiveFiltersCount() > 0 ? 
                                            'No students match the current filters' : 
                                            'No students found'
                                        }
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="student-name">{student.name}</td>
                                        <td>
                                            <span className={`grade-badge grade-${student.grade.toLowerCase()}`}>
                                                {student.grade}
                                            </span>
                                        </td>
                                        <td className="score-cell">{student.midterm_score}</td>
                                        <td className="score-cell">{student.final_exam_score}</td>
                                        <td className="final-score">{student.final_score}</td>
                                        <td>
                                            <button 
                                                className="btn  btn-sm me-1 action-btn" 
                                                onClick={() => handleEdit(student)}
                                                title="Edit Student"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn  btn-sm action-btn" 
                                                onClick={() => handleDelete(student.id)}
                                                title="Delete Student"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3 pagination-container">
                    <div className="pagination-info">
                        <span>
                            Showing {startEntry} to {endEntry} of {count} entries
                            {getActiveFiltersCount() > 0 && (
                                <span className="filter-indicator">
                                    (filtered)
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="pagination-controls">
                        {prevPage && (
                            <button 
                                className="btn btn-outline-secondary me-2 pagination-btn" 
                                onClick={() => fetchStudents(prevPage, searchTerm, `${sortOrder === 'desc' ? '-' : ''}${sortField}`, filters)}
                            >
                                Previous
                            </button>
                        )}
                        {nextPage && (
                            <button 
                                className="btn btn-outline-secondary pagination-btn" 
                                onClick={() => fetchStudents(nextPage, searchTerm, `${sortOrder === 'desc' ? '-' : ''}${sortField}`, filters)}
                            >
                                Next 
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter section - now in a fixed container */}
            <div className="filter-section-container">
                <div className="filter-section-right sticky-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">🔍 Filters</h5>
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleClearFilters}
                            disabled={getActiveFiltersCount() === 0}
                        >
                            ✖️ Clear All
                        </button>
                    </div>

                    {/* Active Filters Display */}
                    {getActiveFiltersCount() > 0 && (
                        <div className="active-filters mb-3">
                            <small className="text-muted">Active filters:</small>
                            <div className="active-filters-list">
                                {renderFilterBadge('Grade', filters.grade)}
                                {filters.midterm_score_operator && filters.midterm_score_value && 
                                    renderFilterBadge('Midterm', `${operatorLabels[filters.midterm_score_operator]} ${filters.midterm_score_value}`)}
                                {filters.final_exam_score_operator && filters.final_exam_score_value && 
                                    renderFilterBadge('Final Exam', `${operatorLabels[filters.final_exam_score_operator]} ${filters.final_exam_score_value}`)}
                            </div>
                        </div>
                    )}

                    {/* Grade Filter */}
                    <div className="filter-row-vertical">
                        <label className="filter-label">Grade:</label>
                        <select 
                            className="form-select filter-select-vertical"
                            value={filters.grade || ''}
                            onChange={(e) => handleFilterChange('grade', e.target.value)}
                        >
                            <option value="">All Grades</option>
                            {gradeOptions.map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </div>

                    {/* Midterm Score Filter */}
                    <div className="filter-row-vertical">
                        <label className="filter-label">Midterm Score:</label>
                        <select 
                            className="form-select filter-operator-vertical"
                            value={filters.midterm_score_operator || ''}
                            onChange={(e) => handleFilterChange('midterm_score_operator', e.target.value)}
                        >
                            <option value="">Select condition</option>
                            {scoreOperators.map(op => (
                                <option key={op} value={op}>{operatorLabels[op]}</option>
                            ))}
                        </select>
                        <input 
                            type="number"
                            className="form-control filter-value-vertical"
                            placeholder="Score"
                            value={filters.midterm_score_value || ''}
                            onChange={(e) => handleFilterChange('midterm_score_value', e.target.value)}
                            disabled={!filters.midterm_score_operator}
                            min="0"
                            max="100"
                        />
                    </div>

                    {/* Final Exam Score Filter */}
                    <div className="filter-row-vertical">
                        <label className="filter-label">Final Exam Score:</label>
                        <select 
                            className="form-select filter-operator-vertical"
                            value={filters.final_exam_score_operator || ''}
                            onChange={(e) => handleFilterChange('final_exam_score_operator', e.target.value)}
                        >
                            <option value="">Select condition</option>
                            {scoreOperators.map(op => (
                                <option key={op} value={op}>{operatorLabels[op]}</option>
                            ))}
                        </select>
                        <input 
                            type="number"
                            className="form-control filter-value-vertical"
                            placeholder="Score"
                            value={filters.final_exam_score_value || ''}
                            onChange={(e) => handleFilterChange('final_exam_score_value', e.target.value)}
                            disabled={!filters.final_exam_score_operator}
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </div>
        </div>

           {isAddModalOpen && (
                <AddStudentModal
                    isOpen={isAddModalOpen}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}

            {selectedStudent && (
                <EditStudentModal
                    student={selectedStudent}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default StudentListPage;