import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DateTime } from 'luxon';

import Avatar from './components/avatar/avatar';
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
    
    if (file.size < 81920) {
      const base64 = await ConvertToBase64(file)

      await axios.get('/api', { params: { type: 'updateAvatar', id: selfAccount.id, image: base64 } })
      .catch(err => console.log(err))
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
    !updateLoading && selfAccount && account ?
    <div className='bg-[#2d3034] py-6 grid grid-rows-[200px,1fr] grid-cols-[800px] justify-center'>
      <div className='relative border-2 rounded-t-xl bg-gradient-to-tl from-violet-700 from-10% to-indigo-700 to-100%'>
        { selfAccount.id == userID ?
        <button className='absolute left-1/2 top-[100%] -translate-x-1/2 -translate-y-1/2 z-[1]' onClick={() => avatarFile.current.click()}>
          <Avatar className='w-40 h-40 border-[3px] border-white' id={userID} socket={socket}/>
          <input ref={avatarFile} onChange={handleAvatarChange} type='file' accept='image/*' className='hidden'></input>
          <div className='m-[3px] bg-black group bg-opacity-0 rounded-full flex items-center justify-center absolute left-0 right-0 top-0 bottom-0 transition ease-in-out duration-300 hover:bg-opacity-80'>
            <img className='w-16 h-16 transition ease-in-out duration-300 opacity-0 group-hover:opacity-100' src={editIcon}/>
          </div>
        </button> 
        :
        <Avatar className='w-40 h-40 border-[3px] border-white absolute left-1/2 top-[100%] -translate-x-1/2 -translate-y-1/2 z-[1]' id={userID} socket={socket}/> }
      </div>
      <div className='border-t-0 border-2 rounded-b-xl'>
        <div className='px-12 pt-24 flex flex-col items-stretch justify-center [&>*:first-child]:rounded-t-lg [&>*:last-child]:rounded-b-lg'>
          <div className='bg-zinc-800 border-zinc-500 border-2'>
            <p className='p-2 font-black text-5xl text-center truncate break-words'>{account.nickname}</p>
            <OnlineText className='pb-1 text-center text-lg' id={account._id} socket={socket} onlineText='Online' onlineStyle='text-green-500' offlineText={`Was online: ${ DateTime.local().toUTC().plus({ days: -DateTime.local().toUTC().diff(DateTime.fromISO(account.lastLogin), 'days').days}).toRelativeCalendar() }`} offlineStyle='text-gray-500'/>
          </div>
          <div className='bg-zinc-800 border-zinc-500 border-2 border-t-0'>
            <p className='py-1 font-medium text-center'>Started the journey: { account.dateCreated ? DateTime.fromISO(account.dateCreated).toFormat('MMM dd') : '' }</p>
          </div>
        </div>
      </div>
    </div>
    : 
    null
  )
}