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
    <img className='rounded-circle' src="../media/images/defaultAcc.png" width="40" height="40"></img>
  </a>
));

export default function Header({ showModal, account }) {
  return (
    <header className='border-b-2 border-gray-600 p-4 sticky-top text-white backdrop-blur'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <img className='w-12 h-12 object-contain' src="../media/logo.png"/>
          <p className='ms-2 text-xl font-bold font-sans'>Portfolio</p>
          <a href='https://github.com/SakytoDev' target='_blank'><img className='ms-2 w-8 h-8' src="../media/images/github.png"/></a>
        </div>
        <div className='flex'>
          { account == null ? 
          <button className='px-4 py-2 border-2 rounded-md transition ease-in-out text-gray-500 border-gray-500 hover:text-white hover:bg-gray-500' onClick={showModal}>Войти</button>
          : 
          <Dropdown>
            <Dropdown.Toggle as={avatarToggle}/>
          
            <Dropdown.Menu>
              <Dropdown.Item eventKey="profile" disabled>Профиль</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="logout"><p className='text-red-700'>Выйти из аккаунта</p></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          }
        </div>
      </div>
    </header>
  )
}