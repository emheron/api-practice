import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    try {
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        res.send(weatherData);
    } catch (error) {
        console.log('An error occurred: ' + error);
    }
});

app.get('/forecast', async (req, res) => {
    const { city, state, country } = req.query;
    const apiKey = process.env.API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&appid=${apiKey}&units=imperial`;

    try {
        const forecastResponse = await fetch(url);
        const forecastData = await forecastResponse.json();

        res.send(forecastData);
    } catch (error) {
        console.log('An error occurred: ' + error);
    }
});

app.get('/apod', async (req, res) => {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
    const adata = await response.json();
    res.json(adata);
  });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
