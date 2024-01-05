import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import  Logo  from '../logo/luxe-logo-edited.png';


export default function Header() {
    // Initialize current user 
    const {currentUser} = useSelector(state => state.user);
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    // Initialize use navigate
    const navigate = useNavigate();
    // Handle submit function - use information from search parameters and navigate user to search page with parameters from query
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    // Search term use effect hook - if search term changes update search term
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className='bg-dodger-blue-700 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                {/* Luxe Real Estate Logo */}
                <Link to='/'>
                    <img src={Logo} alt='logo' className='object-contain w-20 h-20'/>
                </Link >
                {/* Search Bar */}
                {/* Submit form with this button for search */}
                <form
                    onSubmit={handleSubmit}
                    className='bg-slate-100 p-3 rounded-lg flex items-center'
                >
                    {/* Track changes in search input */}
                    <input 
                        type='text' 
                        placeholder='Search...' 
                        className='bg-transparent focus:outline-none w-24 sm:w-64' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                {/* Navigation bar */}
                <ul className='flex gap-4'>
                    <Link to='/'>
                        <li className='font-bold hidden sm:inline text-heather-gray-200 hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='font-bold hidden sm:inline text-heather-gray-200 hover:underline'>About</li>
                    </Link>
                    {/* If current user exists, show an image otherwise show default image */}
                    <Link to='/profile'>
                        {currentUser ? (
                             <img
                             className='rounded-full h-7 w-7 object-cover'
                             src={currentUser.avatar}
                             alt='profile'
                           />
                        ) : ( <li className='font-bold text-heather-gray-200 hover:underline'>Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}
