// app.js

// Smooth scrolling
const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Featured Streamers Carousel
const streamerList = document.querySelector('.streamer-list');
const streamerCards = document.querySelectorAll('.streamer-card');

let currentIndex = 0;
const intervalTime = 5000; // Change slide every 5 seconds

function nextSlide() {
  streamerCards[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % streamerCards.length;
  streamerCards[currentIndex].classList.add('active');
}

setInterval(nextSlide, intervalTime);

// Featured Stream
const featuredStreamContainer = document.querySelector('.featured-stream');
const streamThumbnail = document.querySelector('.stream-thumbnail');
const streamTitle = document.querySelector('.stream-title');
const streamerName = document.querySelector('.streamer-name');

// Simulated API data
const featuredStreamData = {
  thumbnail: 'stream-thumbnail.jpg',
  title: 'Featured Stream Title',
  streamer: 'Streamer Name'
};

// Update featured stream information
function updateFeaturedStream() {
  streamThumbnail.src = featuredStreamData.thumbnail;
  streamTitle.textContent = featuredStreamData.title;
  streamerName.textContent = featuredStreamData.streamer;
}

// Simulate fetching featured stream data from an API
function fetchFeaturedStreamData() {
  // Simulated delay
  setTimeout(() => {
    // Update featured stream information with fetched data
    updateFeaturedStream();
  }, 2000);
}

// Fetch and display featured stream data
fetchFeaturedStreamData();
