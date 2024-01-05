// Sign up page
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';


export default function SignUp() {
  // State to keep track of changes in username, email, and password (form data)
  const [formData, setFormData] = useState({})
  // Error state
  const [error, setError] = useState(null);
  // Loading Effect state
  const [loading, setLoading] = useState(false);
  // Use navigate
  const navigate = useNavigate();

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
        setLoading(true);
        // Fetch method to request API route - send form data and stringify; change and convert response to .json
        // Proxy for 3000 in vite.config.js
        const res = await fetch('/api/auth/signup', 
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
          setError(data.message);
          setLoading(false);
          return;
        }
        // Otherwise set loading to false - completed
        setLoading(false);
        // Set error to false because okay
        setError(null);
        // If everything clear navigate to sign-in
        navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      {/* Inputs for sign up */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        {/* Button disabled when loading - if loading = true say loading otherwise say sign up */}
        <button disabled={loading} className='bg-dodger-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      {/* Already have an account - sign in */}
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {/* If error display paragraph with error */}
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
