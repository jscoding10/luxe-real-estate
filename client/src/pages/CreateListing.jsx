import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';

// Create Listing page
export default function CreateListing() {
  // Current user with use selector
  const { currentUser } = useSelector(state => state.user);
  // Initialize navigate
  const navigate = useNavigate();
  // Files state
  const [files, setFiles] = useState([]);
  // Form data state
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bat: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  // Image upload error state
  const [imageUploadError, setImageUploadError] = useState(false);
  // Loading effect state
  const [uploading, setUploading] = useState(false);
  // State to track errors
  const [error, setError] = useState(false);
  // Loading effect
  const [loading, setLoading] = useState(false);

  console.log(formData);
  
  // Image submit handler
  const handleImageSubmit = (e) => {
    // Upload if have > 0 files and < 7 files
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      // Loop through files and add to promise
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      // Wait for all promises
      Promise.all(promises)
        .then((urls) => {
          // Add new urls to previous ones
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing or you did not select an image!');
      setUploading(false);
    }
  };

  // Store image - Firebase for image storage
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      // Remove image with index matching input
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    // Check box with value (sale or rent)
    // Keep previous information and set type variable as sale or rent
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    // Check box true or false
    // Condition to keep previous data and set if parking, furnished, or offer selected 
    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    // Condition to keep prevoius data and set value of number, text, or textarea for inputs
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    // Prevent refreshing
    e.preventDefault();
    // Request database to add form data
    try {
      // Return an error if no images
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      // Return error if discount price is higher than regular price
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      // Convert response to .json
      const data = await res.json();
      setLoading(false);
      // Make error if data unsuccessful
      if (data.success === false) {
        setError(data.message);
      }
      // Navigate user to listing once complete
      navigate(`/listing/${data._id}`);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      {/* Create Listing  */}
      <h1 className='text-3xl font-semibold text-center my-7 text-heather-gray-950'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          {/* Listing Name */}
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          {/* Listing Description */}
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          {/* Listing Address */}
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          {/* Listing Type Sale Checkbox */}
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='sale' 
                className='w-5' 
                onChange={handleChange} 
                checked={formData.type === "sale"}
                />
              <span>Sell</span>
            </div>
            {/* Listing Type Rent Checkbox */}
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='rent' 
                className='w-5'
                onChange={handleChange} 
                checked={formData.type === "rent"} 
                />
              <span>Rent</span>
            </div>
            {/* Listing Feature Parking Checkbox */}
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='parking' 
                className='w-5'
                onChange={handleChange} 
                checked={formData.parking}
                />
              <span>Parking spot</span>
            </div>
            {/* Listing Feature Furnished Checkbox */}
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='furnished' 
                className='w-5' 
                onChange={handleChange} 
                checked={formData.furnished}
                />
              <span>Furnished</span>
            </div>
            {/* Listing Offer Checkbox */}
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='offer' 
                className='w-5' 
                onChange={handleChange} 
                checked={formData.offer}
                />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            {/* Listing Beds Amount */}
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bat'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bat}
              />
              <p>Baths</p>
            </div>
            {/* Listing Regular Price */}
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {/* If Offer True display discounted price for listing */}
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Upload listing images */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            {/* Upload listing image button */}
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-dodger-blue-700 border border-dodger-blue-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                {/* Delete listing image */}
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          {/* Create listing button - disapled if loading or uploading image */}
          <button disabled={loading || uploading}
           className='p-3 bg-congress-blue-800 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}