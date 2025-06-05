// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/ra';
import About from './pages/Ab';
import Contact from './pages/cont';
import Log from './pages/log';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <>
      <div className='main'>
      <Router>
      <nav className='navb'>
        {/* <h2 className="logo"><img src="A1.png"/></h2> */}
        {isAuthenticated ? (
          <>
            <ul className='Link'>
            <li><Link to="/">About</Link></li>
            <li><Link to="/Home">Resume Analyser</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            </ul>
            <div className='user-section'>
              <span className="welcome-text">Welcome, {user?.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </>
        ) : (
          <div className='lg'>
            <Link to="/Log">
              <button className="Btn">
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path
                      d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                    ></path>
                  </svg>
                </div>
                <div className="text">Login/Signin</div>
              </button>
            </Link>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/Log" element={<Log />} />
        <Route path="/" element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } />
        <Route path="/Home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </div>
    </>
  )
}

export default App
