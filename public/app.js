document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    const state = document.getElementById('state-input').value;
    const country = 'US';
    getWeatherData(city);
    getForecastData(city,state,country);
});

function getWeatherData(city) {
    const url = `http://localhost:3000/weather?city=${city}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(wdata => displayWeatherData(wdata))
    .catch(error => console.log('An error occurred: ' + error));
}


function displayWeatherData(wdata) {
    const weatherDiv = document.getElementById('weather-data');

    weatherDiv.innerHTML = '';

    const cityHeader = document.createElement('h2');
    cityHeader.innerText = `${wdata.name}, ${wdata.sys.country}`;
    weatherDiv.appendChild(cityHeader);

    const tempPara = document.createElement('p');
    tempPara.innerText = `Temperature: ${wdata.main.temp} °F`;
    weatherDiv.appendChild(tempPara);

    const humidityPara = document.createElement('p');
    humidityPara.innerText = `Humidity: ${wdata.main.humidity} %`;
    weatherDiv.appendChild(humidityPara);

    const windSpeedPara = document.createElement('p');
    windSpeedPara.innerText = `Wind speed: ${wdata.wind.speed} m/s`;
    weatherDiv.appendChild(windSpeedPara);

    const weatherDescPara = document.createElement('p');
    weatherDescPara.innerText = `Conditions: ${wdata.weather[0].description}`;
    weatherDiv.appendChild(weatherDescPara);
}

function getForecastData(city, state, country) {
    const url = `http://localhost:3000/forecast?city=${city}&state=${state}&country=${country}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(fdata => displayForecastData(fdata))
    .catch(error => console.log('An error occurred: ' + error));
}

function displayForecastData(fdata) {
    const forecastDiv = document.getElementById('forecast-data');

    forecastDiv.innerHTML = '';

    fdata.list.forEach(item => {
        const dateHeader = document.createElement('h2');
        dateHeader.innerText = new Date(item.dt * 1000).toDateString();
        forecastDiv.appendChild(dateHeader);

        const tempPara = document.createElement('p');
        tempPara.innerText = `Temperature: ${item.main.temp} °F, Low: ${item.main.temp_min} °F, High: ${item.main.temp_max} °F`;
        forecastDiv.appendChild(tempPara);

        const weatherDescPara = document.createElement('p');
        weatherDescPara.innerText = `Conditions: ${item.weather[0].description}`;
        forecastDiv.appendChild(weatherDescPara);
    });
}



