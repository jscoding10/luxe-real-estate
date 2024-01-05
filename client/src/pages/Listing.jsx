import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import Contact from '../components/Contact';
  
export default function Listing() {
  // Initialize swiper package
  SwiperCore.use([Navigation]);
  // Listing state
  const [listing, setListing] = useState(null);
  // Loading state
  const [loading, setLoading] = useState(false);
  // Error state
  const [error, setError] = useState(false);
  // Copied state
  const [copied, setCopied] = useState(false);
  // Contact state
  const [contact, setContact] = useState(false); 
  // Initialize use params
  const params = useParams();
  // Current user state
  const { currentUser } = useSelector((state) => state.user);
  // Obtain listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  // Run only when listing Id changes
  }, [params.listingId]);
  // console.log(loading);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {/* If listing true, not loading, and no error, show listing images with swiper */}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Copy link */}
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-heather-gray-200 cursor-pointer'>
            <FaShare
              className='text-dodger-blue-700'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            {/* Listing name */}
            <p className='text-2xl font-semibold text-congress-blue-800'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            {/* Location marker and address */}
            <p className='flex items-center mt-6 gap-2 text-congress-blue-800 text-sm'>
              <FaMapMarkerAlt className='text-congress-blue-800' />
              {listing.address}
            </p>
            {/* For sale or rent marker */}
            <div className='flex gap-4'>
              <p className='bg-dodger-blue-700 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-dodger-blue-700 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-congress-blue-800'>
              <span className='font-bold text-congress-blue-800'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-congress-blue-800 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              {/* Features of listing */}
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bat} baths `
                  : `${listing.bat} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {/* Show contact landlord button if current user is not equal to user who created listing */}
            {/* When click contact landlord button, set contact landlord button to true with callback */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={()=>setContact(true)} className='bg-congress-blue-800 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                Contact landlord
              </button>
            )}
            {/* Send listing informatoin as a prop */}
            {contact && <Contact listing={listing}/>}
            </div>
        </div>
      )}
    </main>
  );
}