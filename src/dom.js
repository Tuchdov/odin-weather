"use strict";

export function renderCurrentWeather(data) {
  const section = document.querySelector('.current-weather');

  section.querySelector('.location').textContent = data.resolvedAddress;
  section.querySelector('.temperature').textContent = data.temp;
  section.querySelector('.feelslike').textContent = data.feelslike;
  section.querySelector('.conditions').textContent = data.conditions;
  section.querySelector('.humidity').textContent = data.humidity;
  section.querySelector('.uvindex').textContent = data.uvindex;
  section.querySelector('.windspeed').textContent = data.windspeed;
}

export function renderForecast(data) {
  const list = document.querySelector('.forecast-list');
  list.innerHTML = '';

  data.forEach(day => {
    const li = document.createElement('li');
    li.className = 'forecast-day';

    const datetime = document.createElement('p');
    datetime.className = 'date';
    datetime.textContent = day.datetime;

    const tempmax = document.createElement('p');
    tempmax.className = 'temp-high';
    tempmax.textContent = day.tempmax;

    const tempmin = document.createElement('p');
    tempmin.className = 'temp-low';
    tempmin.textContent = day.tempmin;

    const conditions = document.createElement('p');
    conditions.className = 'conditions';
    conditions.textContent = day.conditions;

    const sunrise = document.createElement('p');
    sunrise.className = 'sunrise';
    sunrise.textContent = day.sunrise;

    const sunset = document.createElement('p');
    sunset.className = 'sunset';
    sunset.textContent = day.sunset;

    li.appendChild(datetime);
    li.appendChild(tempmax);
    li.appendChild(tempmin);
    li.appendChild(conditions);
    li.appendChild(sunrise);
    li.appendChild(sunset);

    list.appendChild(li);
  });
}

export function initLocationForm(callback){
    const form = document.querySelector('.location-form');
    form.addEventListener('submit' , (event) => {
        event.preventDefault();
        const input = document.querySelector('#location-input');

        // Browser checks the 'required' attribute automatically
        if (input.checkValidity()) {
        // input is valid, call a function with  the location name
        callback(input.value); 
        } else {
        input.reportValidity(); // shows browser's built-in error popup
        }
    })
}