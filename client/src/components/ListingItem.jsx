import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

// Property Listing card
export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        {/* Return image */}
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          {/* Return listing name */}
          <p className='truncate text-lg font-semibold text-congress-blue-800'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-congress-blue-800' />
            {/* Return listing address */}
            <p className='text-sm text-congress-blue-800 truncate w-full'>
              {listing.address}
            </p>
          </div>
          {/* Return listing description */}
          <p className='text-sm text-congress-blue-800 line-clamp-2'>
            {listing.description}
          </p>
          {/* Return listing price */}
          <p className='text-congress-blue-800 mt-2 font-semibold '>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-congress-blue-800 flex gap-4'>
            {/* Return listing beds */}
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bat > 1
                ? `${listing.bat} baths `
                : `${listing.bat} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}