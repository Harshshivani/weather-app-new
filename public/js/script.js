document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const unitSelect = document.getElementById('unit-select');
    const refreshBtn = document.getElementById('refresh-btn');
    
    const locationElement = document.getElementById('location');
    const tempValueElement = document.getElementById('temp-value');
    const tempUnitElement = document.getElementById('temp-unit');
    const weatherIconElement = document.getElementById('weather-icon');
    const weatherDescElement = document.getElementById('weather-desc');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    
    let currentCity = 'London';
    let currentUnits = 'metric';
    
    // Fetch weather data
    async function fetchWeatherData(city, units) {
        try {
            const response = await fetch(`/api/weather?city=${city}&units=${units}`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            updateWeatherUI(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again.');
        }
    }
    
    // Update UI with weather data
    function updateWeatherUI(data) {
        locationElement.textContent = `${data.city}, ${data.country}`;
        tempValueElement.textContent = Math.round(data.temp);
        weatherDescElement.textContent = data.weatherDesc;
        humidityElement.textContent = `${data.humidity}%`;
        
        weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weatherIcon}@2x.png`;
        weatherIconElement.alt = data.weatherDesc;
        
        if (currentUnits === 'metric') {
            tempUnitElement.textContent = '°C';
            windSpeedElement.textContent = `${data.windSpeed} m/s`;
        } else {
            tempUnitElement.textContent = '°F';
            windSpeedElement.textContent = `${data.windSpeed} mph`;
        }
    }
    
    // Handle form submission
    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentCity = cityInput.value.trim();
        currentUnits = unitSelect.value;
        
        if (currentCity) {
            fetchWeatherData(currentCity, currentUnits);
        }
    });
    
    // Handle refresh button click
    refreshBtn.addEventListener('click', () => {
        if (currentCity) {
            fetchWeatherData(currentCity, currentUnits);
        }
    });
    
    // Initialize with default values
    fetchWeatherData(currentCity, currentUnits);
});