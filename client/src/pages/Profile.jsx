import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  // Current user and loading effect
  const { currentUser, loading, error } = useSelector((state) => state.user);
  // File state
  const [file, setFile] = useState(undefined);
  // File upload percentage state
  const [filePerc, setFilePerc] = useState(0);
  // File upload error state
  const [fileUploadError, setFileUploadError] = useState(false);
  // Form data state
  const [formData, setFormData] = useState({});
  // Update success state
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // Listing state
  const [showListingsError, setShowListingsError] = useState(false);
  // User listings state
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // Use effect to handle file upload on profile
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Handle file upload on profile
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  // Set form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      // Current user from use selector
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      // Dispatch error in profile
      dispatch(updateUserFailure(error.message));
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
      
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }

  // Show listings of user
  const handleShowListings = async () => {
    try {
      // Clear previous error
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      // If everything is okay - set to data
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // Listing delete
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      // Set user listing after deletion by filtering out deleted one
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 text-congress-blue-800'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Image upload on profile */}
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Image upload error (Image must be less than 2 mb or Image type)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-congress-blue-800'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-congress-blue-800'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        {/* Username on profile - can update */}
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        {/* Email on profile - can update */}
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        {/* Password on profile - can update */}
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-dodger-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {/* If loading true show loading otherwise show update */}
          { loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-congress-blue-800 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        {/* Delete Account */}
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer font-bold'>Delete account</span>
        {/* Sign out */}
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer font-bold'>Sign out</span>
      </div>
      {/* If error want to see error otherwise ignore */}
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      {/* If update successful */}
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User updated successfully' : ''}</p>
       {/* If user listings true and have at least one, show user listings if click show listings */}
      <button onClick={handleShowListings} className='text-congress-blue-800 w-full font-bold'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>
    
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold text-congress-blue-800'>Your Listings</h1>
          {/* Map through user listings in database */}
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              {/* Delete and edit buttons */}
              <div className='flex flex-col item-center'>
                <button  
                  onClick={() => handleListingDelete(listing._id)} 
                  className='text-red-700 uppercase'
                  >
                  Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-congress-blue-800 uppercase'>Edit</button>
                  </Link>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}









