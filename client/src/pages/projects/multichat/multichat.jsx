import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, matchPath, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../../redux/accountSlice';

import axios from 'axios';

import AuthMenu from './authmenu';
import MainMenu from './mainmenu';

import { io } from 'socket.io-client';
const socket = io({ autoConnect: false });

import NotificationObj from './components/notification/notification';
import notifyIcon from './assets/images/notification.png';

export default function MultiChat() {
  const [notifications, setNotifications] = useState([])

  const account = useSelector((state) => state.auth.account)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const location = useLocation()

  const isChat = matchPath({ path: '/multichat/chat/:chatID' }, location.pathname)

  function getAccount() {  
    axios.get('/api', { params: { type: 'getAcc' } })
    .then(res => { 
      const result = res.data
      if (result.code == 'success') { dispatch(login({ account: result.account })) }
    })
    .catch(err => console.log(err))
  }

  function addNotification(notification) {
    const newNotifications = [...notifications]
    newNotifications.push(notification)

    setNotifications(newNotifications)
  }

  function removeNotification(notification) {
    setNotifications((curr) => curr.filter(x => x.message !== notification.message))
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
        <Route index path='auth' element={<AuthMenu addNotification={addNotification}/>}/>
        <Route path='/*' element={<MainMenu socket={socket} addNotification={addNotification}/>}/>
      </Routes>
      <div className={`m-5 absolute right-0 bottom-0 flex items-end gap-2 ${isChat ? 'invisible' : 'visible'}`}>
        <div className='relative flex flex-col items-center justify-center gap-2'>
          { notifications.map((item, index) => {
            return <NotificationObj key={index} notification={item} removeNotification={removeNotification}/>
          })}
        </div>
        <img className='bg-zinc-600 rounded-full p-2 w-12 h-12' src={notifyIcon}/>
      </div>
    </>
  )
}