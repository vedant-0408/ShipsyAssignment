import React, { useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const AddStudentModal = ({ isOpen, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        midterm_score: '',
        final_exam_score: '',
    });
    const [errors, setErrors] = useState({});

    const validate = (name, value) => {
        if (name === 'midterm_score' || name === 'final_exam_score') {
            if (value < 0 || value > 100) {
                return 'Score must be between 0 and 100';
            }
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        const error = validate(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validate(key, formData[key]);
            if (error) {
                validationErrors[key] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${apiUrl}/api/students/`, formData, {
                headers: { Authorization: `Token ${token}` },
            });
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to add student', error);
        }
    };

    const isFormValid = Object.values(errors).every((error) => !error);

    if (!isOpen) return null; // ✅ Don't even render if modal is closed

    return (
        <div
            className={`modal fade ${isOpen ? 'show' : ''}`}
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={onClose} // click outside to close
        >
            <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()} // prevent close on click inside
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Student</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder='Enter student name'
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Grade</label>
                                <select
                                    className="form-select"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    required
                                    placeholder='Select grade'
                                >
                                    <option value="" disabled hidden>
                                        Select grade
                                    </option>
                                    <option value="AA">AA</option>
                                    <option value="BB">BB</option>
                                    <option value="CC">CC</option>
                                    <option value="DD">DD</option>
                                    <option value="FF">FF</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Midterm Score</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="midterm_score"
                                    value={formData.midterm_score}
                                    onChange={handleChange}
                                    required
                                    placeholder='Enter midterm score'
                                />
                                {errors.midterm_score && <div className="text-danger">{errors.midterm_score}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Final Exam Score</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="final_exam_score"
                                    value={formData.final_exam_score}
                                    onChange={handleChange}
                                    required
                                    placeholder='Enter final exam score'
                                />
                                {errors.final_exam_score && <div className="text-danger">{errors.final_exam_score}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStudentModal;
