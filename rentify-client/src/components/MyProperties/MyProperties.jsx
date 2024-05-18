import React, { useEffect, useState } from 'react';
import "./MyProperties.css";
import Nav from "../nav/Nav";
import { useNavigate } from 'react-router-dom';
import { instance } from '../../utils/axios';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        place: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbyHospitals: '',
        nearbyColleges: ''
    });
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProperties = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to view your properties');
                navigate('/login');
                return;
            }

            const response = await instance.get('/api/properties/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProperties(response.data);
        };

        fetchProperties();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await instance.delete(`/api/properties/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProperties(properties.filter(property => property._id !== id));
        } catch (error) {
            alert('Error deleting property');
        }
    };

    const handleEdit = (property) => {
        setEditing(property._id);
        setForm({
            place: property.place,
            area: property.area,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            nearbyHospitals: property.nearbyHospitals,
            nearbyColleges: property.nearbyColleges
        });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await instance.put(`/api/properties/${id}`, form, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProperties(properties.map(property => property._id === id ? { ...property, ...form } : property));
            setEditing(null);
        } catch (error) {
            alert('Error updating property');
        }
    };

    return <>
        <Nav data="Do you want to add properties, Click Here!" />
        <div className='my-properties'>
            {properties.map(property => (
                <div key={property._id} className="my-property-details">
                    {editing === property._id ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(property._id); }}>
                            <input type="text" name="place" value={form.place} onChange={handleChange} />
                            <input type="number" name="area" value={form.area} onChange={handleChange} />
                            <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
                            <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
                            <input type="text" name="nearbyHospitals" value={form.nearbyHospitals} onChange={handleChange} />
                            <input type="text" name="nearbyColleges" value={form.nearbyColleges} onChange={handleChange} />
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <h3>{property.place}</h3>
                            <p>Area: {property.area} sqft</p>
                            <p>Bedrooms: {property.bedrooms}</p>
                            <p>Bathrooms: {property.bathrooms}</p>
                            <p>Nearby Hospitals: {property.nearbyHospitals}</p>
                            <p>Nearby Colleges: {property.nearbyColleges}</p>
                            <button onClick={() => handleEdit(property)}>Edit</button>
                            <button onClick={() => handleDelete(property._id)}>Delete</button>
                        </>
                    )}
                </div>
            ))}
        </div>
        </>
    
};

export default MyProperties;
