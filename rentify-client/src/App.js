import React from 'react';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import PropertyList from './components/PropertyList/PropertyList';
import MyProperties from './components/MyProperties/MyProperties';
import PostProperty from "./components/PostProperty/PostProperty";
import { Route, Routes } from 'react-router-dom';
import "./App.css";
const App = () => {
    return (
        <div className='App'>
        <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/my-properties" element={<MyProperties />} />
                <Route path="/post-property" element={<PostProperty />} />
        </Routes>
        </div>
    );
};

export default App;
