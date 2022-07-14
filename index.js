'use strict';
import weatherCodes from './weatherCodes.js';

const key = 'd4ab972d08324c4fd9ce5f5c99f4a9ec';
const api = `http://api.weatherstack.com/current?access_key=${key}&query=`;

const searchForm = document.querySelector('form');
const searchInput = searchForm.querySelector('#search');
const weatherDiv = document.querySelector('.weather');
const locationEl = weatherDiv.querySelector('.location');
const temperature = weatherDiv.querySelector('.temperature');
const description = weatherDiv.querySelector('.description');
const btnUnit = document.querySelector('.unit');
const bgVideo = document.querySelector('video');
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

const getWeatherBackgroundFromCode = (code) => {
  const checkCode = (element) => element === code;
  if (weatherCodes.cloud.some(checkCode)) bgVideo.src = './bg/bg-cloud.mp4';
  if (weatherCodes.fog.some(checkCode)) bgVideo.src = './bg/bg-fog.mp4';
  if (weatherCodes.rain.some(checkCode)) bgVideo.src = './bg/bg-rain.mp4';
  if (weatherCodes.snow.some(checkCode)) bgVideo.src = './bg/bg-snow.mp4';
  if (weatherCodes.sunny.some(checkCode)) bgVideo.src = './bg/bg-sunny.mp4';
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
      current: {
        temperature,
        weather_icons,
        weather_descriptions,
        weather_code,
      },
    } = await data;
    const [weather_icon] = weather_icons;
    const [weather_description] = weather_descriptions;

    const cityWeatherObject = {
      name,
      country,
      temperature,
      weather_icon,
      weather_description,
      weather_code,
    };

    return cityWeatherObject;
  } catch (error) {
    console.log(error);
  }
};

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const cityWeather = await getCityWeather(
    getWeatherData(searchInput.value.toLowerCase())
  );
  locationEl.textContent = `${cityWeather.name}, ${cityWeather.country}`;
  temperature.textContent = `${cityWeather.temperature}${
    unit === celcium ? '℃' : '℉'
  }`;
  description.textContent = `${cityWeather.weather_description}`;

  currentCity = cityWeather;
  getWeatherBackgroundFromCode(cityWeather.weather_code);
});

btnUnit.addEventListener('click', function (event) {
  unit = unit === celcium ? fahrenheit : celcium;
  this.textContent = this.textContent === '℉' ? '℃' : '℉';
});
