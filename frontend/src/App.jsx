import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import StudentListPage from './StudentListPage';
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
                path="/students"
                element={
                    <ProtectedRoute>
                        <StudentListPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;