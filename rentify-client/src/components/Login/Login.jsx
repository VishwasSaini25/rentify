import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";
import { useNavigate,useLocation } from 'react-router-dom';

const Login = () => {
    const location = useLocation();
    const role = location.state;
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', form);
            localStorage.setItem('token', response.data.token);
            document.cookie = `token=${response.data.token}`;
            alert('User logged in successfully');
            console.log(response.data.role);
            if(response.data.role == "buyer") navigate('/properties');
            else navigate('/my-properties')
        } catch (error) {
            alert('Error logging in user');
        }
    };

    return (
        <div className='login'>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
