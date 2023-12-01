import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { login, logout } from '../../../redux/accountSlice';

import axios from 'axios';

import AuthMenu from './authmenu';
import ProfileMenu from './profilemenu';
import ChatMenu from './chatmenu';
import MessengerMenu from './messengermenu';
import PostsMenu from './postsmenu';

import Avatar from './components/avatar/avatar';

import { io } from 'socket.io-client';
const socket = io({ autoConnect: false });

function MainMenu() {
  const account = useSelector((state) => state.auth.account)
  const dispatch = useDispatch()

  function logoutAccount() {
    axios.get('/api', { params: { type: 'accLogout', token: account.logoutToken } })
    .then(res => { 
      const result = res.data
      if (result.code == 'success') dispatch(logout())
    })
    .catch(err => console.log(err))
  }

  return (
    <div className='bg-[#212529] text-white grid grid-cols-[1fr,4fr] grid-rows-[100vh] gap-x-[1px]'>
      <div className='grid grid-rows-[auto,1fr]'>
        <div className='bg-[#212529] flex items-center p-2'>
          <Avatar className='w-14 h-14' id={account?.id} socket={socket}/>
          <div className='flex flex-col items-start mx-2 gap-1 max-w-[75%]'>
            <p className='text-xl font-semibold truncate break-words w-full'>{account?.nickname}</p>
            <Link className='border border-blue-500 rounded transition ease-in-out hover:bg-blue-600 px-2' to={`profile/${account?.id}`}>Profile</Link>
          </div>
        </div>
        <div className='bg-[#2d3034] min-h-0 grid grid-rows-[1fr,auto]'>
          <div className='flex flex-col overflow-auto gap-2 p-2'>
            <Link className='border border-zinc-500 rounded p-2 text-lg text-center transition-all ease-in-out' to='chat'>Chat</Link>
            <Link className='border border-zinc-500 rounded p-2 text-lg text-center transition-all ease-in-out' to='posts'>Posts</Link>
            <button className='border border-zinc-500 rounded p-2 text-lg transition-all ease-in-out'>Music</button>
          </div>
          <div className='flex flex-col border-t-2 border-[#8f8f8f]'>
            <button className='border border-red-500 rounded p-2 m-2 text-lg transition ease-in-out hover:bg-red-800' onClick={() => logoutAccount()}>Logout</button>
          </div>
        </div>
      </div>
      <Routes>
        <Route path='profile/:userID' element={<ProfileMenu socket={socket}/>}/>
        <Route path='chat' element={<ChatMenu/>}/>
        <Route path='chat/:chatID' element={<MessengerMenu socket={socket}/>}/>
        <Route path='posts' element={<PostsMenu socket={socket}/>}/>
      </Routes>
      {/* <div className='p-5 flex flex-col items-center justify-center gap-2 absolute right-0 bottom-0'>
        <div className='max-w-[30rem] rounded-lg flex flex-col justify-end'>
          <div className='px-4 py-2 bg-zinc-800 border border-b-2 border-b-zinc-900 rounded-t-lg'>
            <p className='text-xl font-bold'>Авторизация</p>
          </div>
          <div className='px-4 py-3 bg-zinc-700 border border-t-0 rounded-b-lg'>
            <p className='break-words'>Вы вышли из аккаунта</p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default function MultiChat() {
  const account = useSelector((state) => state.auth.account)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const location = useLocation()

  function getAccount() {  
    axios.get('/api', { params: { type: 'getAcc' } })
    .then(res => { 
      const result = res.data
      if (result.code == 'success') { dispatch(login({ account: result.account })) }
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getAccount()
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('authUpdate', account.id)
      if (location.pathname == '/multichat/auth') navigate('../multichat')
    })

    socket.on('disconnect', () => {
      navigate('auth')
    })

    if (account) socket.connect()
    else socket.disconnect()

    if (!account && !socket.connected) navigate('auth')

    return () => { 
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [account])

  return (
    <>
      <title>MultiChat</title>
      <Routes>
        <Route index path='auth' element={<AuthMenu/>}/>
        <Route path='/*' element={<MainMenu/>}/>
      </Routes>
    </>
  )
}