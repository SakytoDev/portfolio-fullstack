import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { DateTime } from 'luxon';

import accIcon from './assets/images/defaultAcc.png';

export default function ProfileMenu({ socket }) {
  const [account, setAccount] = useState(null)
  const [updateLoading, setUpdateLoad] = useState(false)

  const { userId } = useParams()

  async function getAccount() {
    setUpdateLoad(true)

    const result = await axios({ url: '/api', method: 'GET', params: { type: 'getAccInfo', id: userId }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })
  
    if (result.code == 'success') {
      setAccount(result.account)
      socket.emit('isOnline', { id: userId })
    }

    setUpdateLoad(false)
  }

  useEffect(() => {
    socket.on('isOnline', (data) => { 
      setAccount(account => ({...account, isOnline: data}))
    })

    return () => { socket.off('isOnline') }
  }, [])

  useEffect(() => {
    getAccount()
  }, [userId])

  return (
    !updateLoading ?
    <div className='bg-[#2d3034] grid grid-rows-[auto,1fr]'>
      <div className='grid grid-rows-[1fr,1fr] grid-cols-1 p-12'>
        <div className='relative rounded-t-2xl border-2 border-b-[1px] border-white bg-gradient-to-tl from-violet-900 from-40% to-indigo-900 to-90%'>
          <img className='bg-black w-32 h-32 border-[3px] border-white rounded-full absolute bottom-0 -right-[3%] translate-y-1/2 -translate-x-1/2 z-[1]' src={accIcon}/>
        </div>
        <div className='bg-slate-700 rounded-b-2xl border-2 border-t-[1px] border-white'>
          <div className='flex flex-col items-start gap-3 p-5'>
            <div className="bg-zinc-800 border-2 border-zinc-500 rounded-lg relative max-w-[80%]">
              <p className='font-black text-5xl truncate break-words p-2 pb-3'>{account?.nickname}</p>
              <div className={`absolute ${ !account?.isOnline ? 'bg-zinc-600' : 'bg-green-600' } rounded-full w-5 h-5 top-0 right-0 -translate-y-1/2 translate-x-1/2`}/>
            </div>
            <div className='ms-1'>
              <p className={`font-medium ${ !account?.isOnline ? 'block' : 'hidden' }`}>Was online: { account?.lastLogin != null ? DateTime.local().toUTC().plus({ days: -DateTime.local().toUTC().diff(DateTime.fromISO(account.lastLogin), 'days').days}).toRelativeCalendar() : '' }</p>
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