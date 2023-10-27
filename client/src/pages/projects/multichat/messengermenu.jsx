import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';

import axios from 'axios';

import accIcon from './assets/images/defaultAcc.png';
import sendIcon from './assets/images/send.png';

function MessageObj({ message }) {
  return (
    <div className='border-b px-2 py-2 flex items-center gap-2'>
      <img className='bg-black rounded-full w-16 h-16' src={accIcon}/>
      <div>
        <p className='font-bold'>{message.sender[1]}</p>
        <p>{message.message}</p>
        <p className='text-gray-500'>{DateTime.fromISO(message.sendDate).toFormat('MMM dd, HH:mm')}</p>
      </div>
    </div>
  )
}

export default function MessengerMenu({ socket }) {
  const { userId } = useParams()

  const [recipientInfo, setRecipientInfo] = useState([])
  const [messagesList, setMessagesList] = useState([])
  const [messageInput, setMessageInput] = useState('')

  const account = useSelector((state) => state.auth.account)

  const location = useLocation()

  async function getRecipient() {
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'getAccInfo', id: userId }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })

    if (result.code == 'success') {
      setRecipientInfo(result.account)
      socket.emit('isOnline', { id: userId })
    }
  }

  async function getMessages() {
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'getConversation', sender: account.id, recipient: userId }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })

    if (result.code == 'success') {
      setMessagesList(result.messages)
    }
  }

  function sendMessage() {
    if (messageInput != '') {
      const message = { sender: account.id, recipient: userId, message: messageInput }
      socket.emit('chatMessage', message)

      setMessageInput('')
    }
  }

  useEffect(() => {
    socket.on('chatMessage', (data) => {
      setMessagesList(messagesList => [...messagesList, data])
    })

    socket.on('isOnline', (data) => { 
      setRecipientInfo(recipientInfo => ({...recipientInfo, isOnline: data}))
    })

    return () => { 
      socket.off('chatMessage')
      socket.off('isOnline')
    }
  }, [])

  useEffect(() => {
    getRecipient()
    getMessages()
  }, [userId])

  return (
    <div className='bg-[#2d3034] grid grid-rows-[auto,1fr,auto]'>
      <div className='bg-[#212529] border-b-2 border-gray-500 p-2 flex items-center gap-2'>
        <img className='bg-black rounded-full w-14 h-14' src={accIcon}/>
        <div>
          <p className='font-bold'>{recipientInfo.nickname}</p>
          <p className={`font-medium ${recipientInfo.isOnline ? 'text-green-500' : 'text-gray-500'}`}>{recipientInfo.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div className='min-h-0 overflow-auto'>
        <div className='border-b px-2 py-4 flex flex-col items-center justify-center gap-2'>
          <img className='bg-black rounded-full w-20 h-20' src={accIcon}/>
          <p className='text-4xl font-bold'>{recipientInfo.nickname}</p>
          <p className='text-2xl'>This is the start of conversation, sir.</p>
        </div>
        { messagesList.map((message, index) => {
          return <MessageObj key={index} message={message}/>
        })}
      </div>
      <div className='border-t-2 border-gray-500 p-4 grid grid-cols-[1fr,auto]'>
        <input className='border-s-2 border-t-2 border-b-2 border-r rounded-s-lg px-2 py-2 text-xl outline-none' value={messageInput} onChange={e => setMessageInput(e.target.value)}/>
        <button className='border-e-2 border-t-2 border-b-2 border-l rounded-e-lg px-2 text-lg'><img className='h-8' src={sendIcon} onClick={() => sendMessage()}/></button>
      </div>
    </div>
  )
}