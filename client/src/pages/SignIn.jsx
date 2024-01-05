// Sign in page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function SignIn() {
  // State to keep track of changes in username, email, and password (form data)
  const [formData, setFormData] = useState({})
  // Global state - from user slice
  const { loading, error } = useSelector((state) => state.user);
  // Use navigate
  const navigate = useNavigate();
  // Initialize dispatch
  const dispatch = useDispatch();

  // Event handler for change
  const handleChange = (e) => {
    setFormData(
      // Keep form data whatever it is and add new changes - add email and password
      {
        ...formData,
        [e.target.id]: e.target.value,
      });
  };
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default - prevent refreshing when submit form
    // Try catch statement to handle any errors
    try {
        dispatch(signInStart());
        // Fetch method to request API route - send form data and stringify; change and convert response to .json
        // Proxy for 3000 in vite.config.js
        const res = await fetch('/api/auth/signin', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        // Convert response to json
        const data = await res.json();
        console.log(data);
        // Display error if does not sucessfully load
        if(data.success === false){
          dispatch(signInFailure(data.message));
          return;
        }
        // Otherwise set loading to false - completed
        // Set error to false because okay
        dispatch(signInSuccess(data));
        // If everything clear navigate to sign-in
        navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      {/* Inputs for sign up */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        {/* Button disabled when loading - if loading = true say loading otherwise say sign up */}
        <button disabled={loading} className='bg-dodger-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      {/* Already have an account - sign in */}
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {/* If error display paragraph with error */}
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
