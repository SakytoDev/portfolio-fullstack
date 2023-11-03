import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DateTime } from 'luxon';

import Avatar from './components/avatar/avatar';
import OnlineIcon from './components/online/onlineicon';
import OnlineText from './components/online/onlinetext';

import editIcon from './assets/images/edit.png';

export default function ProfileMenu({ socket }) {
  const { userID } = useParams()

  const [account, setAccount] = useState(null)
  const [updateLoading, setUpdateLoad] = useState(false)

  const selfAccount = useSelector((state) => state.auth.account)

  const avatarFile = useRef(null)

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    
    if (file.size < 1048576) {
      const base64 = await ConvertToBase64(file)

      await axios.get('/api', { params: { type: 'updateAvatar', id: selfAccount.id, image: base64 }}).catch(err => console.log(err))
    }
  }

  const ConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      
      fileReader.onload = () => { resolve(fileReader.result) }
      fileReader.onerror = (error) => { reject(error) }
    })
  }

  function getAccount() {
    setUpdateLoad(true)

    axios.get('/api', { params: { type: 'getAccInfo', id: userID } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') setAccount(result.account)
    })
    .catch(err => console.log(err))
    .finally(() => setUpdateLoad(false))
  }

  useEffect(() => {
    getAccount()
  }, [userID])

  return (
    !updateLoading ?
    <div className='bg-[#2d3034] grid grid-rows-[auto,1fr]'>
      <div className='grid grid-rows-[1fr,1fr] p-12'>
        <div className='relative rounded-t-2xl border-2 border-b-[1px] border-white bg-gradient-to-tl from-violet-900 from-40% to-indigo-900 to-90%'>
          { selfAccount?.id == userID ?
          <button className='absolute left-1/2 top-[100%] -translate-x-1/2 -translate-y-1/2 z-[1]' onClick={() => avatarFile.current.click()}>
            <Avatar className='w-40 h-40 border-[3px] border-white' id={userID}/>
            <input ref={avatarFile} onChange={handleAvatarChange} type='file' accept='image/*' className='hidden'></input>
            <div className='bg-black group bg-opacity-0 rounded-full flex items-center justify-center absolute left-0 right-0 top-0 bottom-0 transition ease-in-out duration-300 hover:bg-opacity-80'>
              <img className='w-16 h-16 transition ease-in-out duration-300 opacity-0 group-hover:opacity-100' src={editIcon}/>
            </div>
          </button> 
          :
          <Avatar className='w-40 h-40 border-[3px] border-white absolute left-1/2 top-[100%] -translate-x-1/2 -translate-y-1/2 z-[1]' id={userID}/> }
        </div>
        <div className='bg-slate-700 rounded-b-2xl border-2 border-t-[1px] border-white'>
          <div className='flex flex-col items-start gap-3 p-5'>
            <div className="bg-zinc-800 border-2 border-zinc-500 rounded-lg relative max-w-[80%]">
              <p className='font-black text-5xl truncate break-words p-2 pb-3'>{account?.nickname}</p>
              <OnlineIcon id={account?._id} socket={socket} className='absolute rounded-full w-5 h-5 top-0 right-0 -translate-y-1/2 translate-x-1/2'/>
            </div>
            <div className='ms-1'>
              <OnlineText id={account?._id} socket={socket} onlineText='Online' onlineStyle='text-white' offlineText={`Was online: ${ account?.lastLogin ? DateTime.local().toUTC().plus({ days: -DateTime.local().toUTC().diff(DateTime.fromISO(account.lastLogin), 'days').days}).toRelativeCalendar() : ''}`} offlineStyle='text-white'/>
              <p className='font-medium'>Started the journey: { account?.dateCreated != null ? DateTime.fromISO(account?.dateCreated).toFormat('MMM dd, HH:mm') : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    : 
    null
  )
}