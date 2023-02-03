# Music Sync
### A Full Stack Web Application for Collaborative Music Playing

###### Music Sync is a full-featured web application that enables a seamless and unified music experience for a group of users. Developed using Python & Django for the backend, JavaScript and React for the frontend, the system leverages the Spotify Web API to provide access to a vast library of music options. The application features room hosting, voting, and control settings, allowing users to create and join rooms for group listening, and providing room hosts with the ability to control music playback and access codes for guests. Additionally, the system incorporates a voting system for song skipping and guest control settings. The application utilizes OAuth authentication through the Authorization Code Flow for access to users' Spotify data, and adheres to REST principles and JSON data format for API requests. Experience an engaging and interactive music experience with friends, utilizing the latest technology for seamless control of music, anywhere in the world.

#### Features:

- ###### Create and join rooms for group listening
- ###### Room host feature for controlling music and providing access codes to guests
- ###### Voting system for song skipping and guest control settings
- ###### Utilizes the Spotify Web API for searching and controlling music playback
- ###### OAuth authentication through the Authorization Code Flow for access to user's Spotify data
- ###### REST principles and JSON data format for API requests

###### With Music Sync, users can experience an engaging and interactive music experience with friends, utilizing the latest technology for seamless control of music, anywhere in the world.

#### Tech Stack:

- ##### Backend: Python , Django, Django Rest Framework, Spotify API
- ##### Frontend: JavaScript, React, Webpack & Babel, React Router, Material UI Components

- ###### Django Rest Framework for creating API endpoints and sending information to and creating new entries in the database
- ###### Webpack and Babel for handling JavaScript modules and transpiring code
- ###### React Router for handling client-side routing
- ###### URL endpoints for creating and accessing specific resources
- ###### POST requests for sending data to the server
- ###### Material UI Components for implementing a consistent design throughout the application
- ##### Django Sessions for managing user sessions
- ##### Updating Django Models for managing data in the database
- ###### React Components for building and organizing the user interface
- ###### React Default Props for providing default values for components
- ###### React Callbacks for handling interactions and user input
- ##### Spotify API - Authorization Code Flow for access to user's Spotify data
- ##### Spotify API for integrating with the Spotify platform and accessing user data
- ###### Spotify Web API for interacting with Spotify's music library and features.

#### Installation: 

###### To install the necessary components for Music Sync, run the following commands in the terminal:

- ###### npm install @mui/icons-material --legacy-peer-deps
- ###### npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
- ###### npm install @babel/core @babel/preset-env @babel/preset-react babel-loader react react-dom react-router-dom webpack webpack-cli
- ###### npm install @emotion/react @emotion/styled

#### Spotify API Integration: 

######  Music Sync leverages the Spotify Web API to provide users with an extensive range of music options. To access Spotify data, the application employs OAuth authentication through the Authorization Code Flow. This flow involves redirecting the user to Spotify to authorize the application, and subsequently, exchanging the authorization code for an access token and a refresh token. The access token is utilized to make authorized requests to the Spotify API, while the refresh token serves to obtain new access tokens, ensuring a seamless and secure experience.

#### Best Practices: 

###### The application followed best practices for security by storing access and refresh tokens in a secure way and implementing a token expiration mechanism as recommended by Spotify API documentation.

#### Conclusion: 

###### In conclusion, Music Sync is a cutting-edge web application that offers a seamless and collaborative music experience for groups of users. It utilizes the Spotify Web API to provide a wide range of music options, and includes features such as room hosting, voting, and control settings. This allows for a unified music experience for a group of users, with an emphasis on engagement and interactivity. Additionally, the application implements best practices for security, including the storage of access and refresh tokens in a secure manner and the implementation of a token expiration mechanism. Overall, Music Sync is a powerful tool for bringing people together through music and technology.




Django Rest Framework
API Endpoints - send information to and create new entries in database
Webpack & Babel
React Router
URL Endpoints
POST Request
Material UI Components
Django Sessions
Update Django Models
React Components 
React Default Props
React Callbacks
Spotify API - Authorize,  Use Authorization , Access Token, API Request
Spotify Web API


installed components:

npm install @mui/icons-material --legacy-peer-deps
npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
npm install @babel/core @babel/preset-env @babel/preset-react babel-loader react react-dom react-router-dom webpack webpack-cli
npm install @emotion/react @emotion/styled

This system allows for a unified music experience for a group of users, with features such as room hosting, voting and control settings. This system was designed to provide an engaging and interactive music experience for groups to enjoy music together utilizing the latest technology.
Developed and implemented a collaborative music playing system, allowing a group of people to control the music being played through unity, regardless of their local host. Utilized Spotify's 3rd party API to integrate a wide range of music options.
Implemented a "room host" feature which allows one person to control the music and give out a code for others to join the room and listen in.
Incorporated a voting system for guests to skip songs, and provided the host with the ability to set controls for guests.
Created an engaging and interactive music experience for groups, utilizing the latest technology to allow users to come together and control the music seamlessly, regardless of their location.
Users will be able to leave, join, create a room 
The Spotify Web API allows developers to access Spotify's music and user data, such as searching for music, retrieving information about a user's playlists, and controlling playback. The API uses REST principles and returns data in JSON format. It requires authentication via an OAuth token, which can be obtained through the Authorization Code Flow or Implicit Grant Flow. The API also includes a Web Playback SDK for building web-based Spotify players. The documentation provides detailed information on the available endpoints, sample code, and best practices for using the API. The user grants permission for an application to access their Spotify data. The flow involves redirecting the user to Spotify to authorize the application, then exchanging the authorization code for an access token, and optionally, a refresh token. The access token is used to make authorized requests to the Spotify API, while the refresh token can be used to obtain new access tokens.

Spotify:
React JS to build a simple web application that interacts with the Spotify API. This will include creating a React component that allows the user to search for songs and albums, and displaying the results in a list.
building a full-featured web application that interacts with the Spotify Web API using Django and React.
cover the best practices of securing the access and refresh tokens, such as storing them in a secure way and implementing a token expiration mechanism.

Control user music , fast forward, pause, whatever we want control over the music requiring two things from spotify 
register web application with spotify using spotify api in where every user using the application that grants access 
we authenticate our application with spotify then the user authenercitate our application
Application 

