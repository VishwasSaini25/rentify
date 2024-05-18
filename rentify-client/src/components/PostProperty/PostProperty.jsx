import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {getRoleFromToken} from '../../utils/auth';
import Nav from '../nav/Nav';
const PostProperty = () => {
    const [form, setForm] = useState({
        place: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbyHospitals: '',
        nearbyColleges: ''
    });
    const navigate = useNavigate();
    const role = getRoleFromToken();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (role !== 'seller') {
            alert('Only sellers can show post properties');
            navigate('/properties')
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/properties', form, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Property posted successfully');
            navigate('/my-properties');
        } catch (error) {
            alert('Error posting property');
        }
    };

    return <>
    <Nav data="" />
        <form onSubmit={handleSubmit}>
            <input type="text" name="place" placeholder="Place" onChange={handleChange} />
            <input type="number" name="area" placeholder="Area (sqft)" onChange={handleChange} />
            <input type="number" name="bedrooms" placeholder="Bedrooms" onChange={handleChange} />
            <input type="number" name="bathrooms" placeholder="Bathrooms" onChange={handleChange} />
            <input type="text" name="nearbyHospitals" placeholder="Nearby Hospitals" onChange={handleChange} />
            <input type="text" name="nearbyColleges" placeholder="Nearby Colleges" onChange={handleChange} />
            <button type="submit">Post Property</button>
        </form>
        </>
    
};

export default PostProperty;
