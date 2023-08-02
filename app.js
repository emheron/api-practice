const config = require('./config.js');

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    getWeatherData(city);
});

function getWeatherData(city) {
    const apiKey = config.API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => displayWeatherData(data))
    .catch(error => console.log('An error occurred: ' + error));
}

function displayWeatherData(data) {
    const weatherDiv = document.getElementById('weather-data');

    weatherDiv.innerHTML = '';

    const cityHeader = document.createElement('h2');
    cityHeader.innerText = `${data.name}, ${data.sys.country}`;
    weatherDiv.appendChild(cityHeader);

    const tempPara = document.createElement('p');
    tempPara.innerText = `Temperature: ${data.main.temp} °F`;
    weatherDiv.appendChild(tempPara);

    const humidityPara = document.createElement('p');
    humidityPara.innerText = `Humidity: ${data.main.humidity} %`;
    weatherDiv.appendChild(humidityPara);

    const windSpeedPara = document.createElement('p');
    windSpeedPara.innerText = `Wind speed: ${data.wind.speed} m/s`;
    weatherDiv.appendChild(windSpeedPara);

    const weatherDescPara = document.createElement('p');
    weatherDescPara.innerText = `Conditions: ${data.weather[0].description}`;
    weatherDiv.appendChild(weatherDescPara);
}
