'use strict';
const key = 'd4ab972d08324c4fd9ce5f5c99f4a9ec';
const api = `http://api.weatherstack.com/current?access_key=${key}&query=`;

const searchForm = document.querySelector('form');
const searchInput = searchForm.querySelector('#search');
const weatherDiv = document.querySelector('.weather');
const locationEl = weatherDiv.querySelector('.location');
const temperature = weatherDiv.querySelector('.temperature');
const description = weatherDiv.querySelector('.description');
const btnUnit = document.querySelector('.unit');
// const celcium = '℃';
// const fahrenheit = '℉';
const celcium = 'm';
const fahrenheit = 'f';
let unit = celcium;
let currentCity;

// fetch(api, {
//   mode: 'cors',
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data));

const convertTemp = (temp) => {
  if (unit === celcium) {
    return temp * 1.8 + 32;
  }
  return (temp - 32) / 1.8;
};

const getWeatherData = async (city, units = unit) => {
  try {
    const response = await fetch(`${api}${city}&units=${units}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getCityWeather = async (data) => {
  try {
    const {
      location: { name, country },
      current: { temperature, weather_icons, weather_descriptions },
    } = await data;
    const [weather_icon] = weather_icons;
    const [weather_description] = weather_descriptions;

    const cityWeatherObject = {
      name,
      country,
      temperature,
      weather_icon,
      weather_description,
    };

    console.log(cityWeatherObject);
    console.log(await data);
    return cityWeatherObject;
  } catch (error) {
    console.log(error);
  }
};

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const cityWeather = await getCityWeather(getWeatherData(searchInput.value));
  locationEl.textContent = `${cityWeather.name}, ${cityWeather.country}`;
  temperature.textContent = `${cityWeather.temperature}${
    unit === celcium ? '℃' : '℉'
  }`;
  description.textContent = `${cityWeather.weather_description}`;

  currentCity = cityWeather;
});

btnUnit.addEventListener('click', function (event) {
  // temperature.textContent = convertTemp(currentCity.temperature);
  unit = unit === celcium ? fahrenheit : celcium;
  this.textContent = this.textContent === '℉' ? '℃' : '℉';
  console.log(temperature.textContent);
});
