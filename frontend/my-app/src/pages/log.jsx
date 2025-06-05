import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './log.css'

export default function Log() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Only redirect if login/register was successful
            if (data.token) {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='lsf'>
            <div className="section">
                <div className="container">
                    <div className="row full-height justify-content-center">
                        <div className="col-12 text-center align-self-center py-5">
                            <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                <h6 className="mb-0 pb-3">
                                    <span>Log In </span><span>Sign Up</span>
                                </h6>
                                <input 
                                    className="checkbox" 
                                    type="checkbox" 
                                    id="reg-log" 
                                    name="reg-log"
                                    checked={!isLogin}
                                    onChange={() => setIsLogin(!isLogin)}
                                />
                                <label htmlFor="reg-log"></label>
                                <div className="card-3d-wrap">
                                    <div className="card-3d-wrapper">
                                        <div className="card-front">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Log In</h4>
                                                    {error && <div className="error-message">{error}</div>}
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="form-group">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-style"
                                                                placeholder="Your Email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                required
                                                                disabled={isLoading}
                                                            />
                                                            <i className="input-icon uil uil-at"></i>
                                                        </div>
                                                        <div className="form-group mt-2">
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                className="form-style"
                                                                placeholder="Your Password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                required
                                                                disabled={isLoading}
                                                            />
                                                            <i className="input-icon uil uil-lock-alt"></i>
                                                        </div>
                                                        <button 
                                                            type="submit" 
                                                            className="btn mt-4"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? 'Loading...' : 'Submit'}
                                                        </button>
                                                    </form>
                                                    <p className="mb-0 mt-4 text-center">
                                                        <a href="#0" className="link">Forgot your password?</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-back">
                                            <div className="center-wrap">
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Sign Up</h4>
                                                    {error && <div className="error-message">{error}</div>}
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                className="form-style"
                                                                placeholder="Your Full Name"
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                                required
                                                                disabled={isLoading}
                                                            />
                                                            <i className="input-icon uil uil-user"></i>
                                                        </div>
                                                        <div className="form-group mt-2">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-style"
                                                                placeholder="Your Email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                required
                                                                disabled={isLoading}
                                                            />
                                                            <i className="input-icon uil uil-at"></i>
                                                        </div>
                                                        <div className="form-group mt-2">
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                className="form-style"
                                                                placeholder="Your Password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                required
                                                                disabled={isLoading}
                                                            />
                                                            <i className="input-icon uil uil-lock-alt"></i>
                                                        </div>
                                                        <button 
                                                            type="submit" 
                                                            className="btn mt-4"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? 'Loading...' : 'Submit'}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}