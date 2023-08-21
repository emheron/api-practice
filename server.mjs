// Imports and Configuration
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

// Constants
const app = express();
const port = process.env.PORT || 3000; 
const publicPath = path.join(__dirname, 'public');
const weatherApiKey = process.env.WEATHER_API_KEY || '';
const apodApiKey = process.env.APOD_API_KEY || '';

// Middleware Configuration
app.use(express.static(publicPath));
app.use(cors());
app.use(session({
  secret: process.env.OAUTH_SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://my-weather-dashboard-a3730f05ae8e.herokuapp.com/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  const user = { name: profile.displayName };
  done(null, user);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Authentication Helper
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}

// Routes
app.get('/', ensureAuthenticated, (req, res) => res.render('index', { name: req.user.name }));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => res.redirect('/'));

// Weather and Forecast APIs
app.get('/weather', /* ... code ... */);
app.get('/forecast', /* ... code ... */);
app.get('/apod', /* ... code ... */);

// Start Server
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
