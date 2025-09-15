import { useEffect, useRef, useState } from 'react'
import './Weather.css'
import pinkSearchIcon from '../assets/pinkSearchIcon.png'

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);

  const allIcons = {
    "01d": pinkSearchIcon,
    "01n": pinkSearchIcon,
    "02d": pinkSearchIcon,
    "02n": pinkSearchIcon,
    "03d": pinkSearchIcon,
    "03n": pinkSearchIcon,
    "04d": pinkSearchIcon,
    "04n": pinkSearchIcon,
    "09d": pinkSearchIcon,
    "09n": pinkSearchIcon,
    "10d": pinkSearchIcon,
    "10n": pinkSearchIcon,
    "13d": pinkSearchIcon,
    "13n": pinkSearchIcon,
  }

  const search = async (city) => {
    if (city==""){
      alert("Enter city name")
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if (data.cod !== 200) {
        setWeatherData(null); // city not found
        return;
      }

      const icon = allIcons[data.weather[0].icon] || pinkSearchIcon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      })
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    search("New York");
  }, [])

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={pinkSearchIcon} alt="search" onClick={() => search(inputRef.current.value)} />
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={pinkSearchIcon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={pinkSearchIcon} alt="" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Weather
