import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import { DateTime } from 'luxon';

import Avatar from './components/avatar/avatar';
import OnlineText from './components/online/onlinetext';
import Spinner from './components/spinner/spinner';

import editIcon from './assets/images/edit.png';

function FriendObj({ id, pending, accountRef, setAccountRef }) {
  const [account, setAccount] = useState(null)
  const [friendLoading, setFriendLoad] = useState(false)

  const selfAccount = useSelector((state) => state.auth.account)

  function getAccount() {
    axios.get('/api', { params: { type: 'getAccInfo', id: id } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') setAccount(result.account)
    })
    .catch(err => console.log(err))
  }

  function addFriend() {
    setFriendLoad(true)

    axios.get('/api', { params: { type: 'addFriend', id: id } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') { 
        const accountInfo = { ...accountRef }
        accountInfo.friends = res.data.friends

        setAccountRef(accountInfo)

        setFriendLoad(false)
      }
    })
    .catch(err => console.log(err))
  }

  function removeFriend() {
    setFriendLoad(true)

    axios.get('/api', { params: { type: 'removeFriend', id: id } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') {
        const accountInfo = { ...accountRef }
        accountInfo.friends = res.data.friends

        setAccountRef(accountInfo)

        setFriendLoad(false)
      }
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getAccount()
  }, [])

  return (
    <div className='border-2 flex flex-col rounded-lg'>
      { account ?
      <>
        <div className={`p-2 ${ account._id != selfAccount.id ? 'border-b-2' : '' } flex items-center gap-2`}>
          <Avatar className='w-12 h-12' source={account.avatar}/>
          <p className='text-2xl font-medium'>{account.nickname}</p>
        </div>
        { account._id != selfAccount.id ?
        <div className={`grid ${ pending ? 'grid-cols-4' : 'grid-cols-3' } grid-flow-col`}>
          <Link className='p-1 m-2 border-2 border-indigo-400 rounded-lg text-center font-medium transition ease-in-out hover:bg-indigo-600' to={`../profile/${account._id}`}>View Profile</Link>
          <Link className='p-1 m-2 border-2 border-blue-400 rounded-lg text-center font-medium transition ease-in-out hover:bg-blue-600' to={`../chat/${account._id}`}>Chat</Link>
          { pending ? <button className='p-1 m-2 border-2 enabled:border-indigo-500 disabled:border-indigo-900 rounded-lg font-medium transition ease-in-out enabled:hover:bg-indigo-500' disabled={friendLoading} onClick={() => addFriend()}>{ friendLoading ? <Spinner className='w-4 h-4'/> : 'Add as friend' }</button> : null }
          <button className='p-1 m-2 border-2 enabled:border-red-500 disabled:border-red-900 rounded-lg font-medium transition ease-in-out enabled:hover:bg-red-500' disabled={friendLoading} onClick={() => removeFriend()}>{ friendLoading ? <Spinner className='w-4 h-4'/> : 'Reject friendship' }</button>
        </div> : null }
      </>
      : <Spinner className='w-10 h-10'/> }
    </div>
  )
}

function InformationTab({ account }) {
  return (
    <p>Information Placeholder</p>
  )
}

function FriendsTab({ account, setAccountRef }) {
  const selfAccount = useSelector((state) => state.auth.account)

  return (
    <div className='flex flex-col gap-4'>
      { selfAccount.id == account._id && account.friends.filter(x => x.pending).length > 0 ?
      <div>
        <p className='pt-2 pb-4 font-bold text-2xl'>Pending confirmation ({ account.friends.filter(x => x.pending).length })</p>
        <div className='flex flex-col gap-2'>
          { account.friends.filter(x => x.pending).map((item, index) => {
            return <FriendObj key={index} id={item._id} pending={true} accountRef={account} setAccountRef={setAccountRef}/>
          })}
        </div>
      </div>
      : null }
      <div>
        <p className='pb-4 font-bold text-2xl'>Friends ({ account.friends.filter(x => !x.pending).length })</p>
        <div className='flex flex-col gap-2'>
          { account.friends.filter(x => !x.pending).map((item, index) => {
            return <FriendObj key={index} id={item._id} pending={false} accountRef={account} setAccountRef={setAccountRef}/>
          })}
        </div>
      </div>
    </div>
  )
}

export default function ProfileMenu({ socket }) {
  const { userID } = useParams()

  const [account, setAccount] = useState(null)
  const [updateLoading, setUpdateLoad] = useState(false)
  
  const [tabIndex, setTabIndex] = useState(0)
  const tabMenus = [{ title: 'Information', component: <InformationTab account={account}/> }, { title: 'Friends', component: <FriendsTab account={account} setAccountRef={setAccount}/> }]

  const [friendLoading, setFriendLoad] = useState(false)

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

      setUpdateLoad(false)
    })
    .catch(err => console.log(err))
  }

  function addFriend() {
    setFriendLoad(true)

    axios.get('/api', { params: { type: 'addFriend', id: userID } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') { 
        const accountInfo = { ...account }
        accountInfo.friends = res.data.friends

        setAccount(accountInfo)
        setFriendLoad(false)
      }
    })
    .catch(err => console.log(err))
  }

  function removeFriend() {
    setFriendLoad(true)

    axios.get('/api', { params: { type: 'removeFriend', id: userID } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') { 
        const accountInfo = { ...account }
        accountInfo.friends = res.data.friends

        setAccount(accountInfo)
        setFriendLoad(false)
      }
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getAccount()
  }, [userID])

  return (
    !updateLoading && selfAccount && account ?
    <div className='h-full py-6 bg-[#2d3034] grid grid-rows-[200px,1fr] grid-cols-[800px] justify-center'>
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
      <div className='min-h-0 grid grid-rows-[auto,1fr] border-t-0 border-2 rounded-b-xl'>
        <div className='px-12 pt-24 [&>*]:border-2 [&>*:not(:first-child):not(:last-child)]:border-t-0 [&>*:first-child]:rounded-t-lg [&>*:last-child]:border-t-0 [&>*:last-child]:rounded-b-lg'>
          { selfAccount.id != userID ?
          <div className='p-2 bg-zinc-800 border-zinc-500 flex items-center justify-center gap-2'>
            { account.friends.findIndex(x => x._id == selfAccount.id) == -1 
            ? <button className='px-2 border-2 enabled:border-indigo-500 disabled:border-indigo-900 rounded-lg font-medium transition ease-in-out enabled:hover:bg-indigo-500' disabled={friendLoading} onClick={() => addFriend()}>{ friendLoading ? <Spinner className='w-4 h-4'/> : 'Add as friend' }</button>
            : <button className='px-2 border-2 enabled:border-red-500 disabled:border-red-900 rounded-lg font-medium transition ease-in-out enabled:hover:bg-red-500' disabled={friendLoading} onClick={() => removeFriend()}>{ friendLoading ? <Spinner className='w-4 h-4'/> : 'Reject friendship' }</button>
            }
          </div>
          : null }
          <div className='bg-zinc-800 border-zinc-500'>
            <p className='p-2 font-black text-5xl text-center truncate break-words'>{account.nickname}</p>
            <OnlineText className='pb-1 text-center text-lg' id={account._id} socket={socket} onlineText='Online' onlineStyle='text-green-500' offlineText={`Was online: ${ DateTime.local().toUTC().plus({ days: -DateTime.local().toUTC().diff(DateTime.fromISO(account.lastLogin), 'days').days}).toRelativeCalendar() }`} offlineStyle='text-gray-500'/>
          </div>
          <div className='bg-zinc-800 border-zinc-500'>
            <p className='py-1 font-medium text-center'>Started the journey: { account.dateCreated ? DateTime.fromISO(account.dateCreated).toFormat('MMM dd') : '' }</p>
          </div>
        </div>
        <div className='min-h-0 grid grid-rows-[auto,1fr] px-12 py-6 [&>*]:border-2 [&>*:not(:first-child):not(:last-child)]:border-t-0 [&>*:first-child]:rounded-t-lg [&>*:last-child]:border-t-0 [&>*:last-child]:rounded-b-lg'>
          <div className='bg-zinc-800 border-zinc-500 grid grid-cols-2 [&>*]:py-2 [&>*]:border-r-zinc-500 [&>*]:border-b-blue-500 [&>*]:border-r-2 [&>*:last-child]:border-r-0'>
            { tabMenus.map((item, index) => {
              return <button key={index} className={`${tabIndex == index ? 'border-b-4' : 'border-b-0'} text-lg font-medium`} onClick={() => setTabIndex(index)}>{item.title}</button>
            })}
          </div>
          <div className='border-zinc-500 px-4 py-2 overflow-auto'>
            { tabMenus[tabIndex].component }
          </div>
        </div>
      </div>
    </div>
    : 
    <Spinner className='w-12 h-12'/>
  )
}