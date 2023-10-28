import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';

import axios from 'axios';

import accIcon from './assets/images/defaultAcc.png';
import sendIcon from './assets/images/send.png';

import Nickname from './components/nickname/nicknametext';
import OnlineText from './components/online/onlinetext';

function MessageObj({ message }) {
  return (
    <div className='border-b px-2 py-2 flex items-center gap-2'>
      <img className='bg-black rounded-full w-16 h-16' src={accIcon}/>
      <div>
        <p className='font-bold'>{message.sender}</p>
        <p>{message.message}</p>
        <p className='text-gray-500'>{DateTime.fromISO(message.sendDate).toFormat('MMM dd, HH:mm')}</p>
      </div>
    </div>
  )
}

export default function MessengerMenu({ socket }) {
  const { chatId } = useParams()

  const [conversation, setConversation] = useState({})
  const [messageInput, setMessageInput] = useState('')

  const account = useSelector((state) => state.auth.account)

  const location = useLocation()

  async function getConversation() {
    const result = await axios({ url: '/api', method: 'GET', params: { type: 'getConversation', id: chatId }})
    .then(res => { return res.data })
    .catch(err => { console.log(err) })

    if (result.code == 'success') {
      setConversation(result.conversation)
    }
  }

  function sendMessage() {
    if (messageInput != '') {
      const message = { sender: account.id, conversation: chatId, message: messageInput }
      socket.emit('chatMessage', message)

      setMessageInput('')
    }
  }

  useEffect(() => {
    getConversation()
  }, [chatId])

  useEffect(() => {
    socket.on('chatMessage', (data) => {
      const newConversation = { ...conversation }
      newConversation.messages.push(data)

      setConversation(newConversation)
    })

    return () => { socket.off('chatMessage') }
  }, [conversation])

  return (
    <div className='bg-[#2d3034] grid grid-rows-[auto,1fr,auto]'>
      <div className='bg-[#212529] border-b-2 border-gray-500 p-2 flex items-center gap-2'>
        <img className='bg-black rounded-full w-14 h-14' src={accIcon}/>
        <div>
          <Nickname className='font-bold' id={chatId}/>
          <OnlineText className='font-medium' socket={socket} id={chatId}/>
        </div>
      </div>
      <div className='min-h-0 overflow-auto'>
        <div className='border-b px-2 py-4 flex flex-col items-center justify-center gap-2'>
          <img className='bg-black rounded-full w-20 h-20' src={accIcon}/>
          <Nickname className='text-4xl font-bold' id={chatId}/>
          <p className='text-2xl'>This is the start of conversation, sir.</p>
        </div>
        { conversation.messages?.map((message, index) => {
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