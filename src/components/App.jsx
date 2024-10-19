import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig/firebaseConfig';
import Signup from './forms/Signup';
import Login from './forms/Login';
import Dashboard from './Dashboard';
import { BrowserRouter as Router } from 'react-router-dom';
import '../stylesheets/App.css'

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user); // Update authentication state
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    const handleLogin = (authenticated) => {
        setIsAuthenticated(authenticated);
    };

    const handleSignup = (authenticated) => {
        setIsAuthenticated(authenticated);
        setShowSignup(false);
    };

    const handleLogout = async () => {
        await auth.signOut();
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div>
                {isAuthenticated ? (
                    <Dashboard onLogout={handleLogout} />
                ) : showSignup ? (
                    <Signup onSignup={handleSignup} />
                ) : (
                    <Login onLogin={handleLogin} />
                )}
                {!isAuthenticated && (
                    <div className='option-container'>
                        <p className='option-heading'>{showSignup ? 'Already a member ? ' : 'Create Account'}</p>
                        <button className={`option ${showSignup ? 'active' : ''}`} onClick={() => setShowSignup(!showSignup)}>
                            {showSignup ? 'Go to Login' : 'Sign Up'}
                        </button>
                    </div>
                )}
            </div>
        </Router>
    );
};

export default App;
