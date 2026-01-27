import './style.css'


import * as dom from './dom.js' 
import * as weather  from './weather.js' 

// So first I put the get weather data inside the init
// but how do I do the rendering 
// because I need to render functions inside and not one?

dom.initLocationForm( async (location) => {
    try {
    dom.clearError()
    const  current = await weather.getCurrentData(location);
    const   forecast = await weather.getForecast(location);

    dom.renderCurrentWeather(current);
    dom.renderForecast(forecast);
    }
    catch(error){
       dom.showError(error.message)
    }
})

