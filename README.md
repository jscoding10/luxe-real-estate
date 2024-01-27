## Luxe Real Estate

**Deployed version:** https://luxe-real-estate.onrender.com/
<br>
<br>
Luxe Real Estate is a full-stack web application with authentication that allows users to create and search through real estate listings. When creating a listing, the user can include general information about the property, such as address, description, and features, and upload up to six images of the property. The application also includes an advanced search functionality where users can search by term, filter by listing type and amenities, and sort listings by date. The user can also update or delete their listings from the Profile page.

## Instructions
If you wish to use Luxe Real Estate, please visit the <a href="https://luxe-real-estate.onrender.com/">deployed version</a>. Next, sign up for an account or use the sign in information provided below for the test account. You can sign up using Google OAuth with the “Continue with Google” button or by entering your information and creating an account. 
<br>
<div><b>Username:</b> webappdemouser01@mail.com</div>
<br>
<div><b>Password:</b> webappdemouser01@mail.com</div>
<br>
To create a listing, please navigate to the Profile page by clicking the photo in the top right corner.
<br>
<br>
To search for listings, please use the search bar in the Header or click on “Let’s get started…” on the Homepage.
<br>
<br>

**To set up a local copy, follow these simple steps:**  
```
1. cd luxe-real-estate-main
2. npm install  
3. npm run dev
4. cd client
5. npm install
6. npm run dev
```
Steps one through three set up the server. The server runs on localhost:3000.
<br>
<br>
Steps four through six set up the client. The client runs on localhost:5173.
<br>
<br>
For the local copy to work, you will need a Firebase API key in an .env file in the client folder, and a MongoDB connection string and JWT Secret key in an .env file in the api folder.
<br>
## Technology Used
<img align="left" alt="HTML" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg" />
<img align="left" alt="CSS" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg" />
<img align="left" alt="JavaScript" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" />
<img align="left" alt="React" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" />
<img align="left" alt="Tailwind CSS" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" />
<img align="left" alt="Node" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
<img align="left" alt="Express" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" />
<img align="left" alt="MongoDB" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" />
<img align="left" alt="Firebase" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" />
<img align="left" alt="Redux" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" />
<br>
<br>
<br>

**Client:** HTML, CSS, JavaScript, React and Tailwind
<br>
**Server:** Node, Express
<br>
**Database:** MongoDB
<br>
**Google OAuth and Image Storage:** Firebase
<br>
**Global State Management:** Redux
<br>
<br>
After a user is authenticated and visits the Profile page (accessed by clicking the image in the top right of the Header), they can create a property listing, update their account information, and upload a profile image. When creating a listing, the user should include the name, description, address, type, amenities, specifications, and images of the listing. Further, the user can manage their listings from the Profile page by editing or deleting them, delete their account, or sign out.
<br>
<br>
The advanced search functionality of the application allows a user to search by title, filter by listing type and amenities, and apply sorting to results. This was completed using query parameters in the URL to return the desired results. The search function can be found in the Header of the application or by clicking “Let’s get started…” from the Header page. 
<br>
<br>
If the user selects a listing from the search results or homepage, the Listing page contains all the information regarding the listing and its images. It also contains the contact information of the landlord if the user is authenticated and allows users to send an email message to the landlord’s provided email if they desire. 
<br>

## Lessons Learned
While completing Luxe Real Estate, I learned how to integrate user authentication and advanced search functionality into a full stack web application. Further, I honed my ability to fetch data from a database and display it on the user interface with React, as well as set up routers, controllers, and models on the server to handle different requests from the client. I also improved my ability to utilize developer tools and the terminal to pinpoint issues in the client side and server side of the application. 

## Improvements
One improvement to the application is to create a more responsive Navbar when in mobile view.  A better mobile Navbar design would open the full menu in columns after the user clicks a hamburger icon and close when a user clicks outside, selects a Nav link, or clicks the close icon. Another improvement to the application is to add more filters to the advanced search feature, such as sorting by price (high to low and low to high) and location. 