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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
