import React, { useState } from 'react';
import { auth } from '../../firebaseConfig/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../../stylesheets/App.css'


const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(true); // Call parent method to indicate successful login
        } catch (err) {
            setError(err.message); // Handle error
        }
    };

    return (
        <div className='form-container'>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
