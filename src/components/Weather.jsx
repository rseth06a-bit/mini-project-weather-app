import React from 'react'
import './Weather.css'
import pinkSearchIcon from '../assets/pinkSearchIcon.png'

const Weather = () => {
  return (
    <div className='weather'>
        <div className ="search-bar">
            <input type="text" placeholder='Search'/>
            <img src={pinkSearchIcon} alt="" />
        </div>
        <img src="" alt="" />
    </div>
  )
}

export default Weather
