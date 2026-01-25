export function renderCurrentWeather(data) {
    // select the correct section
    const sectionCurrent = document.querySelector('.currentWeather')
   
    // select the attributes 
    const temperature = sectionCurrent.querySelector('.temperature');

    // populate it with the data
    temperature.textContent =  data.temp;

    // same for rest of attributes..
 
}

<section class="current-weather">
  <h2 class="location"></h2>
  <p class="temperature"></p>
  <p class="feelslike"></p>
  <p class="conditions"></p>
  <p class="humidity"></p>
  <p class="uvindex"></p>
  <p class="windspeed"></p>
</section>