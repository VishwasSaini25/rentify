import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getRoleFromToken } from '../../utils/auth';
import "./PropertyList.css";
import { useNavigate } from 'react-router-dom';
import { FcLike } from "react-icons/fc";
import Nav from '../nav/Nav';
const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [interestedProperty, setInterestedProperty] = useState(null);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [filters, setFilters] = useState({
        place: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbyHospitals: '',
        nearbyColleges: ''
    });
    const navigate = useNavigate();
    const role = getRoleFromToken();
    useEffect(() => {
        const fetchProperties = async () => {
            const response = await axios.get('http://localhost:5000/api/properties');
            setProperties(response.data);
            setFilteredProperties(response.data);
        };

        fetchProperties();
    }, []);

    const handleInterested = async (id) => {

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to show interest');
            navigate('/login');
            return;
        }
        if (role !== 'buyer') {
            alert('Only buyers can show interest in properties');
            navigate('/my-properties')
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/api/properties/${id}/interested`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSellerDetails(response.data.seller);
            setInterestedProperty(id);
        } catch (error) {
            alert('Error showing interest');
        }
    };

    const handleBack = () => {
        setInterestedProperty(null);
        setSellerDetails(null);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        setFilteredProperties(properties.filter(property => {
            return (
                (filters.place === '' || property.place.toLowerCase().includes(filters.place.toLowerCase())) &&
                (filters.area === '' || property.area.toString().includes(filters.area)) &&
                (filters.bedrooms === '' || property.bedrooms.toString().includes(filters.bedrooms)) &&
                (filters.bathrooms === '' || property.bathrooms.toString().includes(filters.bathrooms)) &&
                (filters.nearbyHospitals === '' || property.nearbyHospitals.toLowerCase().includes(filters.nearbyHospitals.toLowerCase())) &&
                (filters.nearbyColleges === '' || property.nearbyColleges.toLowerCase().includes(filters.nearbyColleges.toLowerCase()))
            );
        }));
    };

    const handleLike = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to like properties');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/properties/${id}/like`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProperties(properties.map(property =>
                property._id === id ? { ...property, likes: response.data.likes } : property
            ));
            setFilteredProperties(filteredProperties.map(property =>
                property._id === id ? { ...property, likes: response.data.likes } : property
            ));
        } catch (error) {
            alert('Error liking property');
        }
    };


    return (
        <div>
            <Nav data="" />
            <div className='filters'>
                <h3>Filters</h3>
                <div className='filter-input'>
                    <input type="text" name="place" placeholder="Place" value={filters.place} onChange={handleFilterChange} />
                    <input type="number" name="area" placeholder="Area" value={filters.area} onChange={handleFilterChange} />
                    <input type="number" name="bedrooms" placeholder="Bedrooms" value={filters.bedrooms} onChange={handleFilterChange} />
                    <input type="number" name="bathrooms" placeholder="Bathrooms" value={filters.bathrooms} onChange={handleFilterChange} />
                    <input type="text" name="nearbyHospitals" placeholder="Nearby Hospitals" value={filters.nearbyHospitals} onChange={handleFilterChange} />
                    <input type="text" name="nearbyColleges" placeholder="Nearby Colleges" value={filters.nearbyColleges} onChange={handleFilterChange} />
                </div>
                <button onClick={applyFilters}>Apply Filters</button>
            </div>
            <div className='property-list'>
                {filteredProperties.map(property => (
                    <div key={property._id} className='property-list-detail'>
                        {interestedProperty === property._id ? (
                            <>
                                <h3>Contact Details</h3>
                                <p>Name: {sellerDetails.firstName} {sellerDetails.lastName}</p>
                                <p>Email: {sellerDetails.email}</p>
                                <p>Phone Number: {sellerDetails.phoneNumber}</p>
                                <button onClick={handleBack}>Back</button>
                            </>
                        ) : (
                            <>
                                <h3>{property.place}</h3>
                                <p>Area: {property.area} sqft</p>
                                <p>Bedrooms: {property.bedrooms}</p>
                                <p>Bathrooms: {property.bathrooms}</p>
                                <p>Nearby Hospitals: {property.nearbyHospitals}</p>
                                <p>Nearby Colleges: {property.nearbyColleges}</p>
                                <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',marginBottom: '2%'}}>
                                <p>Likes: {property.likes}</p>
                                <FcLike style={{width: '40px',height: '40px',cursor: 'pointer'}} onClick={() => handleLike(property._id)} />
                                </div>
                                <button onClick={() => handleInterested(property._id)}>I'm Interested</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyList;
