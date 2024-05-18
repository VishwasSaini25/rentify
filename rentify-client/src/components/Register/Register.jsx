import React, { useState } from 'react';
import axios from 'axios';
import "./Register.css";
import { useNavigate } from 'react-router-dom';
const Register = () => {

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'buyer'
    });
    const navigate = useNavigate();
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', form);
            alert('User registered successfully');
            navigate('/login',{ state: form.role });
        } catch (error) {
            alert('Error registering user');
        }
    };

    return (
        <div className='register'>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <select name="role" onChange={handleChange}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
                <button type="submit">Register</button>
                <h5 onClick={() => navigate('/login')}>Already have an account, Login</h5>
            </form>
        </div>
    );
};

export default Register;
