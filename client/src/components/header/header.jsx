import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/accountSlice';

import Dropdown from 'react-bootstrap/Dropdown';

import logo from '../../assets/logo.png';
import accIcon from '../../assets/images/defaultAcc.png';
import githubLogo from '../../assets/images/github.png';

import './header.css';

import axios from 'axios';

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
    <img className='rounded-circle' src={accIcon} width="40" height="40"></img>
  </a>
));

export default function Header({ showModal }) {
  const account = useSelector((state) => state.auth.account)

  const dispatch = useDispatch()

  async function logoutAccount() {
    const result = await axios({
      url: '/api',
      method: 'GET',
      params: { type: 'accLogout', token: account.logoutToken }
    })
    .then(res => { return res.data })
    .catch(err => { console.log(err) })
  
    if (result.code == 'success') {
      dispatch(logout())
    }
  }

  return (
    <header className='border-b-2 border-gray-600 p-4 sticky-top text-white backdrop-blur'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <img className='w-12 h-12 transition-all ease-in-out duration-1000 hover:rotate-720 object-contain' src={logo}/>
          <p className='ms-2 text-xl font-bold font-sans'>Portfolio</p>
          <a href='https://github.com/SakytoDev' target='_blank'><img className='ms-2 w-8 h-8' src={githubLogo}/></a>
        </div>
        <div className='flex items-center'>
          { account == null ? 
          <button className='px-4 py-2 border-2 rounded-md transition ease-in-out text-gray-500 border-gray-500 hover:text-white hover:bg-gray-500' onClick={showModal}>Войти</button>
          : 
          <Dropdown>
            <Dropdown.Toggle as={avatarToggle}/>
          
            <Dropdown.Menu>
              <Dropdown.Item eventKey="profile" disabled>Профиль</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="logout"><p className='text-red-700' onClick={() => logoutAccount()}>Выйти из аккаунта</p></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          }
        </div>
      </div>
    </header>
  )
}