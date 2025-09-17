import { useEffect, useRef, useState } from 'react'
import './Weather.css'
import pinkSearchIcon from '../assets/pinkSearchIcon.png'

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [cityImages, setCityImages] = useState([]);

  const search = async (city) => {
    if (city === "") {
      alert("Enter city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        setWeatherData(null);
        return;
      }

      const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error(error);
    }

    fetchCityImages(city);
  };

  const fetchCityImages = async (city) => {
    try {
      const url = `https://api.unsplash.com/search/photos?query=${city}&per_page=9&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        const shuffled = data.results.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4).map(img => img.urls.small);
        setCityImages(selected);
      } else {
        setCityImages([]);
      }
    } catch (err) {
      console.error(err);
      setCityImages([]);
    }
  };

  useEffect(() => {
    search("New York");
  }, []);

  return (
    <div className='weather-app'>
      {/* Search bar at the top with Enter key support */}
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              search(inputRef.current.value);
            }
          }}
        />
        <img 
          src={pinkSearchIcon} 
          alt="search" 
          onClick={() => search(inputRef.current.value)} 
        />
      </div>

      {/* Weather + Collage side by side */}
      <div className="weather-layout">
        {/* City collage */}
        {cityImages.length > 0 && (
          <div className="city-collage">
            {cityImages.map((img, index) => (
              <img key={index} src={img} alt="City" className="collage-img" />
            ))}
          </div>
        )}

        {/* Weather card in the center */}
        <div className='weather'>
          {weatherData && (
            <>
              <img src={weatherData.icon} alt="" className='weather-icon' />
              <p className='temperature'>{weatherData.temperature}°C</p>
              <p className='location'>{weatherData.location}</p>
              <div className="weather-data">
                <div className="col">
                  <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                  </div>
                </div>
                <div className="col">
                  <div>
                    <p>{weatherData.windSpeed} m/s</p>
                    <span>Wind Speed</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
