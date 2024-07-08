// server.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// OpenWeatherMap API details
const API_KEY = '6156a6b5b90b6b008f897727023b5d91';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

// Routes
app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

app.post('/', async (req, res) => {
  const city = req.body.city;
  const url = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const weatherData = await response.json();

    if (weatherData.cod === 200) {
      const weather = {
        city: weatherData.name,
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        visibility: weatherData.visibility,
      };
      res.render('index', { weather, error: null });
    } else {
      res.render('index', { weather: null, error: 'City not found!' });
    }
  } catch (error) {
    res.render('index', { weather: null, error: 'Error fetching data' });
  }
});

// Add a new route to handle city suggestion requests
// app.get('/suggestions', async (req, res) => {
//     const query = req.query.q;
//     const url = `${SUGGESTIONS_URL}?q=${query}`;
  
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching city suggestions' });
//     }
//   });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});











