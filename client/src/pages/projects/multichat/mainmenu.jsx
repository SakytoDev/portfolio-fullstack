import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';
import { logout } from '../../../redux/accountSlice';

import axios from 'axios';

import ProfileMenu from './profilemenu';
import ChatMenu from './chatmenu';
import MessengerMenu from './messengermenu';
import PostsMenu from './postsmenu';

import Avatar from './components/avatar/avatar';

export default function MainMenu({ socket, addNotification }) {
  const account = useSelector((state) => state.auth.account)
  const dispatch = useDispatch()

  function logoutAccount() {
    axios.get('/api', { params: { type: 'accLogout', token: account.logoutToken } })
    .then(res => { 
      const result = res.data
      if (result.code == 'success') {
        dispatch(logout())
        addNotification({ type: 'success', message: 'Вы вышли из аккаунта' })
      }
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
        <Route path='profile/:userID' element={<ProfileMenu socket={socket} addNotification={addNotification}/>}/>
        <Route path='chat' element={<ChatMenu/>}/>
        <Route path='chat/:chatID' element={<MessengerMenu socket={socket}/>}/>
        <Route path='posts' element={<PostsMenu socket={socket} addNotification={addNotification}/>}/>
      </Routes>
    </div>
  )
}