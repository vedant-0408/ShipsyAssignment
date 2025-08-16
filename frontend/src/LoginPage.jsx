import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Info, BookOpen } from 'lucide-react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCredentials, setShowCredentials] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

     const navigate = useNavigate();

    const handleLogin = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/users/login/`, {
                username,
                password,
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            setIsLoading(false)
            navigate('/students');
        } catch (error) {
            setIsLoading(false)
            setError('Invalid credentials');
            setTimeout(() => {
                setError('');
            }, 2000);

        }
    };

    const handleDemoLogin = () => {
        setUsername('admin');
        setPassword('admin');
        setShowCredentials(false);
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <div className="icon-wrapper">
                            <BookOpen />
                        </div>
                        <h1>Student Portal</h1>
                        <p>Sign in to your account</p>
                    </div>

                    <div className="login-content">
                        {showCredentials && (
                            <div className="demo-credentials">
                                <Info />
                                <div>
                                    <p className="title">Demo Credentials</p>
                                    <p>First time user? Use these credentials:</p>
                                    <div className="credentials-box">
                                        <p>Username: <strong>admin</strong></p>
                                        <p>Password: <strong>admin</strong></p>
                                    </div>
                                    <button onClick={handleDemoLogin} className="autofill-btn">
                                        Auto-fill credentials
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="form-section">
                            <label>
                                <User /> Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />

                            <label>
                                <Lock /> Password
                            </label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="login-btn"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <p>Assignment Project</p>
                    <p>Student Management System for Shipsy</p>
                    <p>Made by Vedant Sarawagi</p>
                    <p>ID: BT22CSE221</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
