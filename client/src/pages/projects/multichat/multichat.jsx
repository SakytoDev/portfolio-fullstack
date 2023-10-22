import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../../../redux/accountSlice';

import axios from 'axios';

import ProfileMenu from './profilemenu.jsx';
import ChatMenu from './chatmenu.jsx';

import Input from './../../../components/input/input';
import Tabs from './../../../components/tabs/tabs';

import chatLogo from '../../../assets/images/chatLogo.png'
import accIcon from '../../../assets/images/defaultAcc.png';

import { io } from 'socket.io-client';
const socket = io({ autoConnect: false });

function LoginTab() {
  const [authForm, setForm] = useState({})
  const [authLoading, setAuthLoading] = useState(false)

  const dispatch = useDispatch()

  const handleFormChange = (e) => {
    setForm({
      ...authForm,
      [e.target.name]: e.target.value
    })
  }

  async function loginAccount() {
    setAuthLoading(true)

    const result = await axios({ url: '/api', method: 'GET', params: { type: 'accLogin', form: authForm }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })

    if (result.code == 'success') {
      dispatch(login({ 'account': result.account }))
      socket.connect()
    }

    setAuthLoading(false)
  }

  return (
    <div>
      <div className="flex flex-col w-[30vw] gap-2">
        <Input type="text" name="nickname" placeholder="Nickname" onChange={handleFormChange}/>
        <Input type="password" name="password" placeholder="Password" onChange={handleFormChange}/>
        <button className='border-2 disabled:border-gray-500 disabled:text-gray-500 rounded p-1 transition ease-in-out enabled:hover:text-black enabled:hover:bg-white' disabled={authLoading} onClick={() => loginAccount()}>
          <p className='text-xl'>{ authLoading ? 'Signing in' : 'Sign in' }</p>
        </button>
      </div>
    </div>
  )
}

function RegTab() {
  const [authForm, setForm] = useState({})
  const [authLoading, setAuthLoading] = useState(false)

  const dispatch = useDispatch()

  async function regAccount() {
    setAuthLoading(true)
  
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'accReg', form: authForm }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })
  
    if (result.code == 'success') {
      dispatch(login(result.account))
      socket.connect()
    }
  
    setAuthLoading(false)
  }

  const handleFormChange = (e) => {
    setForm({
      ...authForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <div className="flex flex-col w-[30vw] gap-2">
      <Input type="text" name="email" placeholder="Email" onChange={handleFormChange}/>
        <Input type="text" name="nickname" placeholder="Nickname" onChange={handleFormChange}/>
        <Input type="password" name="password" placeholder="Password" onChange={handleFormChange}/>
        <button className='border-2 disabled:border-gray-500 disabled:text-gray-500 rounded p-1 transition ease-in-out enabled:hover:text-black enabled:hover:bg-white' disabled={authLoading} onClick={() => regAccount()}>
          <p className='text-xl'>{ authLoading ? 'Signing up' : 'Sign up' }</p>
        </button>
      </div>
    </div>
  )
}

export default function MultiChat() {
  const [tabIndex, setTabIndex] = useState(0)

  const account = useSelector((state) => state.auth.account)
  const dispatch = useDispatch()

  const tabs = [<ProfileMenu _id={account?.id} socket={socket}/>, <ChatMenu/>]

  async function getAccount() {  
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'getAcc' }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })
  
    if (result.code == 'success') {
      dispatch(login({ 'account': result.account }))
      socket.connect()
    }
  }

  async function logoutAccount() {
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'accLogout', token: account.logoutToken }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })

    if (result.code == 'success') {
      dispatch(logout())
      socket.disconnect()
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  useEffect(() => {
    socket.emit('authUpdate', { id: account?.id })
  }, [account])

  return (
    <>
      <title>MultiChat</title>
      { account != null ?
      <div className='bg-black text-white h-[100vh] grid grid-cols-[1fr,4fr] grid-rows-[auto,1fr] gap-x-[1px]'>
        <div className='bg-[#212529] min-w-0 flex items-center p-2'>
          <img className='bg-black rounded-full w-14 h-14' src={accIcon}/>
          <div className='flex flex-col items-start mx-2 gap-1 max-w-[75%]'>
            <p className='text-xl font-semibold truncate break-words w-full'>{account?.nickname}</p>
            <button className='border border-blue-500 rounded transition ease-in-out hover:bg-blue-600 px-2' onClick={() => setTabIndex(0)}>Profile</button>
          </div>
        </div>
        <div className='bg-[#212529] flex items-center justify-center p-2'>
          <p className='text-2xl font-bold'>Profile</p>
        </div>
        <div className='bg-[#2d3034] min-h-0 grid grid-rows-[1fr,auto]'>
          <div className='flex flex-col overflow-auto gap-2 p-2'>
            <button className='border border-zinc-500 rounded p-2 text-lg transition ease-in-out hover:bg-zinc-500' onClick={() => setTabIndex(1)}>Chat</button>
            <button className='border border-zinc-500 rounded p-2 text-lg transition ease-in-out hover:bg-zinc-500'>Posts</button>
            <button className='border border-zinc-500 rounded p-2 text-lg transition ease-in-out hover:bg-zinc-500'>Music</button>
          </div>
          <div className='flex flex-col border-t-2 border-[#8f8f8f]'>
            <button className='border border-red-800 rounded p-2 m-2 text-lg transition ease-in-out hover:bg-red-800' onClick={() => logoutAccount()}>Logout</button>
          </div>
        </div>
        <div className='bg-[#1d2024] min-h-0'>
          { tabs.map((component, index) => {
            return (
              <div key={index} className={`transition-all ease-in-out ${index == tabIndex ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                {component}
              </div>
            )
          }) }
        </div>
      </div> 
      :
      <div className='bg-[#2d3034] text-white h-[100vh] flex flex-col items-center pt-16'>
        <img className='w-48 h-48 rounded-xl' src={chatLogo}/>
        <p className='font-bold text-5xl mt-6'>MultiChat</p>
        <Tabs className='flex justify-center gap-5 p-5 mt-6' components={[<LoginTab title='Sign in'/>, <RegTab title='Sign up'/>]}/>
      </div>
      }
    </>
  )
}