import './header.css'

import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

const avatarToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    className='flex items-center dropdown-toggle'
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <img className="rounded-circle" src="../media/images/defaultAcc.png" width="40" height="40"></img>
  </a>
));

  return (
    <header className='headerPadding py-2 px-4 sticky-top text-white'>
      <div className='flex items-center justify-between'>
        <div className='items-center'>
          <p className='text-xl font-bold font-sans'>Portfolio</p>
          <p className='font-sans'>Цирк уехал, а клоуны остались</p>
        </div>
        <div>
          <button className='px-3 py-1.5 border rounded-md transition ease-in-out text-gray-500 border-gray-500 hover:text-white hover:bg-gray-500' onClick={showModal}>Войти</button>
        </div>
      </div>
    </header>
  )
}