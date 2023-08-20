import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; 

app.use(session({
    secret: process.env.OAUTH_SESSION_SECRET, 
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://my-weather-dashboard-a3730f05ae8e.herokuapp.com/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    const user = { name: profile.displayName };
    done(null, user);
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

let weatherApiKey = process.env.WEATHER_API_KEY || '';
let apodApiKey = process.env.APOD_API_KEY || '';

app.use(cors());
app.use(express.static('public'));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
}

app.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const apikey = req.query.appid || weatherApiKey;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=imperial`;
    console.log("Fetch URL: ", url);

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
    const apikey = req.query.appid || weatherApiKey;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&appid=${apikey}&units=imperial`;

    try {
        const forecastResponse = await fetch(url);
        const forecastData = await forecastResponse.json();

        res.send(forecastData);
    } catch (error) {
        console.log('An error occurred: ' + error);
    }
});

app.get('/apod', async (req, res) => {
    const apikey = req.query.appid || apodApiKey;
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apikey}`);
    const adata = await response.json();
    res.json(adata);
  });

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {

      res.redirect('/');
    });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
