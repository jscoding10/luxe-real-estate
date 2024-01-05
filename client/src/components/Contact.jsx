import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Contact landlord component
export default function Contact({ listing }) {
  // Landlord state (user)
  const [landlord, setLandlord] = useState(null);
  // Message state
  const [message, setMessage] = useState('');
  // On change event
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  // Fetch information of user who owns listing (landlord)
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord(); // Call asynchronous function
  }, [listing.userRef]); // Only update if listing.userRef changes
  
  return (
    // Show information of landlord if it exists
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          {/* Area to write message to the landlord */}
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>
          {/* Send the message to the landlord's email */}
          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-congress-blue-800 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}