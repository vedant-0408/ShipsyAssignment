import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditStudentModal = ({ student, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...student });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (student) {
            setFormData({ ...student });
            setErrors({});
        }
    }, [student]);

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
            await axios.put(
                `http://localhost:8000/api/students/${student.id}/`,
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to update student', error);
        }
    };

    const isFormValid = Object.values(errors).every((error) => !error);

    // ✅ This is the key: if `student` is null, don't render at all
    if (!student) return null;

    return (
        <div
            className={`modal fade show`}
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={onClose} // click outside closes
        >
            <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()} // prevent close on inside clicks
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Student</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Grade</label>
                                <select
                                    className="form-select"
                                    name="grade"
                                    value={formData.grade || ''}
                                    onChange={handleChange}
                                >
                                    <option value="AA">AA</option>
                                    <option value="BB">BB</option>
                                    <option value="CC">CC</option>
                                    <option value="DD">DD</option>
                                    <option value="FF">FF</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Midterm Score
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="midterm_score"
                                    value={formData.midterm_score || ''}
                                    onChange={handleChange}
                                />
                                {errors.midterm_score && (
                                    <div className="text-danger">
                                        {errors.midterm_score}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Final Exam Score
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="final_exam_score"
                                    value={formData.final_exam_score || ''}
                                    onChange={handleChange}
                                />
                                {errors.final_exam_score && (
                                    <div className="text-danger">
                                        {errors.final_exam_score}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!isFormValid}
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditStudentModal;
