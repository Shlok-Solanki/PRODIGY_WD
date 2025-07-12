// API configuration
const API_KEY = '1ba66c2fb3c84746dec9dde468d37901'; // You'll need to get this from a weather API provider
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const tempValue = document.getElementById('temp-value');
const weatherIcon = document.getElementById('weather-icon').querySelector('img');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');

// Event listeners
searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeatherByLocation(location);
    }
});

currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            error => {
                alert('Error getting your location. Please try again or enter a location manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Fetch weather by city name or ZIP
async function fetchWeatherByLocation(location) {
    try {
        const response = await fetch(`${BASE_URL}?q=${location}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert('Location not found. Please try another city or ZIP code.');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

// Display weather data
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    tempValue.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].main;
    
    // Additional details
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    pressure.textContent = `${data.main.pressure} hPa`;
}

// Initial load - fetch weather for a default location or use geolocation
fetchWeatherByLocation('London');


