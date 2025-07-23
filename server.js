require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch weather data
app.get('/api/weather', async (req, res) => {
    try {
        const { city = 'London', units = 'metric' } = req.query;
        const apiKey = process.env.OPENWEATHER_API_KEY || 'your_api_key_here';
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error' });
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            res.json({
                temp: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                weatherIcon: data.weather[0].icon,
                weatherDesc: data.weather[0].description,
                city: data.name,
                country: data.sys.country
            });
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;