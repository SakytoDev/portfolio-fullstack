import { useState, useEffect } from 'react';

import axios from 'axios';

import logo from '../../assets/logo.png';
import githubLogo from '../../assets/images/github.png';

import './header.css';

export default function Header() {
  const [status, setStatus] = useState(false)

  function getStatus() {
    axios.get('/')
    .then(res => { 
      const result = res.data
      if (result.code == 'success') setStatus(true)
    })
    .catch(err => {
      setStatus(false)
      console.log(err)
    })
  }

  useEffect(() => {
    getStatus()
  }, [])

  return (
    <header className='px-4 py-2.5 border-b-2 border-gray-600 sticky-top text-white backdrop-blur'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <img className='w-12 h-12 transition-all ease-in-out duration-1000 hover:rotate-720 object-contain' src={logo}/>
          <p className='ms-2 text-xl font-bold font-sans'>Portfolio</p>
          <a className='ms-2' href='https://github.com/SakytoDev' target='_blank'><img className='w-8 h-8' src={githubLogo}/></a>
        </div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <div className={`${status ? 'bg-green-500' : 'bg-red-500'} rounded-full w-2 h-2`}></div>
          <p className='font-medium'>Backend is {status ? 'available' : 'unavailable'}</p>
        </div>
      </div>
    </header>
  )
}