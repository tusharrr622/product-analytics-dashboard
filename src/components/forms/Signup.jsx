import React, { useState } from 'react';
import { auth } from '../../firebaseConfig/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../../stylesheets/App.css'

const Signup = ({ onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onSignup(true); // Call parent method to indicate successful signup
        } catch (err) {
            setError(err.message); // Handle error
        }
    };

    return (
        <div className='form-container'>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;
