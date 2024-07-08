// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Use CORS to allow requests from the frontend
app.use(cors());

// Route to fetch cryptocurrency data with pagination
app.get('/api/crypto', async (req, res) => {
    const { page = 1, per_page = 10 } = req.query;
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: per_page,
                page: page,
                sparkline: false,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
