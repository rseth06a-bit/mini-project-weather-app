import { useEffect, useRef, useState } from 'react'
import './Weather.css'
import pinkSearchIcon from '../assets/pinkSearchIcon.png'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [cityImages, setCityImages] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [sunTimes, setSunTimes] = useState({ sunrise: null, sunset: null });

  
  

  const search = async (city) => {
    if (city === "") { alert("Enter city name"); return; }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod !== 200) { setWeatherData(null); return; }

      const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,  
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
      

      setTimezone(data.timezone); 
      setSunTimes({
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      });

      fetchForecast(city);
    } catch (error) { console.error(error); }

    fetchCityImages(city);
  };

  const fetchForecast = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=24&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      setForecastData(data.list);
    } catch (err) { console.error(err); setForecastData(null); }
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
      } else { setCityImages([]); }
    } catch (err) { console.error(err); setCityImages([]); }
  };

  const Compass = ({ degrees }) => {
    return (
      <div style={{
        width: '120px',
        height: '120px',
        border: '4px solid #333',
        borderRadius: '50%',
        position: 'relative',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {}
        <span style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px' }}>N</span>
        <span style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px' }}>S</span>
        <span style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px' }}>W</span>
        <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px' }}>E</span>
  
        {}
        <div style={{
          width: '4px',
          height: '60%',
          position: 'absolute',
          transform: `rotate(${degrees}deg)`,
          transformOrigin: '50% 50%',
          transition: 'transform 0.5s ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {}
          <div style={{
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '40px solid red',
          }} />
          {}
          <div style={{
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '40px solid gray',
          }} />
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    if (timezone === null) return;

    const update = () => {
      const utc = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
      const local = new Date(utc.getTime() + timezone * 1000);
      setLocalTime(local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    update(); 
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval); 
  }, [timezone]);

  useEffect(() => { search("New York"); }, []);

  const tempData = forecastData?.map(f => ({
    time: new Date(f.dt_txt).getHours() + ':00',
    temperature: Math.round(f.main.temp),
    humidity: f.main.humidity,
    wind: f.wind.speed
  })) || [];

  const formatTime = (timestamp) => {
    if (!timestamp || timezone === null) return '';
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className='weather-app'>
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={(e) => { if (e.key === 'Enter') search(inputRef.current.value); }}
        />
        <img src={pinkSearchIcon} alt="search" onClick={() => search(inputRef.current.value)} />
      </div>

      <div className="weather-layout">
        {}
        {cityImages.length > 0 && (
          <div className="city-collage">
            {cityImages.map((img, idx) => (
              <img key={idx} src={img} alt="City" className="collage-img" />
            ))}
          </div>
        )}

        {}
        <div className='weather'>
          {weatherData && (
            <>
              <img src={weatherData.icon} alt="" className='weather-icon' />
              <p className='temperature'>{weatherData.temperature}°C</p>
              <p className='location'>{weatherData.location}</p>
              <div className="weather-data">
                <div className="col">
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
                <div className="col">
                  <p>{weatherData.windSpeed} m/s</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </>
          )}
        </div>

        {}
        <div className="weather-dashboard">
          <h3>Local Time</h3>
          <p className="local-time">{localTime}</p>
          <span className="timezone">UTC {timezone >= 0 ? `+${timezone/3600}` : `${timezone/3600}`}</span>

          <h3>Sunrise & Sunset</h3>
          <p>Sunrise: {formatTime(sunTimes.sunrise)}</p>
          <p>Sunset: {formatTime(sunTimes.sunset)}</p>

          <h3>24h Temp</h3>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={tempData}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
              <XAxis dataKey="time" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>

          <h3>Humidity</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={tempData}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="time" />
              <YAxis 
  tick={{ dx: 5 }}  
  label={{ 
    value: '(%)', 
    angle: -90, 
    position: 'outsideLeft',
    offset: -20
  }}
/>


              <Tooltip />
              <Bar dataKey="humidity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>


<h3>Wind Speed</h3>
<ResponsiveContainer width="100%" height={150}>
  <BarChart data={tempData}>
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="time" />
    <YAxis 
  label={{ 
    value: 'Speed (m/s)', 
    angle: -90, 
    position: 'outsideLeft',  
    offset: 60 
  }} 
/>

    <Tooltip />
    <Bar dataKey="wind" fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>

<h3>Wind Direction</h3>
{weatherData?.windDeg !== undefined && (
  <Compass degrees={weatherData.windDeg} />
)}


        </div>
      </div>
    </div>
  );
};

export default Weather;