import React from 'react'; 
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

// Google Authentication Component
export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app); 

            // Sign in with Google popup
            const result = await signInWithPopup(auth, provider);

            // Send information to server for Google authentication
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: result.user.displayName, 
                    email: result.user.email, 
                    photo: result.user.photoURL 
                }),
            })
            // Convert to json and save inside database
            const data = await res.json();
            dispatch(signInSuccess(data));
            // If everything is successful, navigate to home page
            navigate('/');
        } catch (error) {
            console.log('Could not sign in with Google', error);
        }
    };

  // Open Google authentication when click on button
  return (
    <button onClick={ handleGoogleClick } type='button' className='bg-congress-blue-800 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with Google</button>
  )
}
