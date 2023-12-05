import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';

import axios from 'axios';

import editIcon from './assets/images/edit2.png';
import deleteIcon from './assets/images/delete.png';
import sendIcon from './assets/images/send.png';

import Avatar from './components/avatar/avatar';
import OnlineText from './components/online/onlinetext';

function MessageObj({ socket, message, chatID }) {
  const [isEdit, setEditMode] = useState(false)
  const [editInput, setEditInput] = useState(message.message)

  const [isDeleting, setDeleting] = useState(false)

  const account = useSelector((state) => state.auth.account)

  function editMessage() {
    setEditMode(false)
    if (editInput == message.message) return

    socket.emit('editMessage', { conversationID: chatID, messageID: message.id, edit: editInput })
  }

  function deleteMessage() {
    setDeleting(true)

    socket.emit('deleteMessage', { conversationID: chatID, messageID: message.id })
  }

  return (
    <motion.div transition={{ ease: 'easeInOut', duration: 0.5 }} initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className='border-b p-2 flex items-center gap-2'>
      <Avatar className='w-16 h-16' source={message.avatar} socket={socket}/>
      <div>
        <p className='font-bold'>{message.sender[0]}</p>
        { isEdit 
          ? 
          <div>
            <textarea className='p-2 bg-transparent border border-gray-500 rounded-md outline-none' value={editInput} onChange={e => setEditInput(e.target.value)}/>
            <div className='grid grid-cols-2 gap-1'>
              <button className='p-1 border-2 border-indigo-500 rounded-l-lg font-medium transition-all ease-in-out hover:bg-indigo-600' onClick={() => editMessage()}>Save</button>
              <button className='p-1 border-2 border-red-500 rounded-r-lg font-medium transition-all ease-in-out hover:bg-red-600' onClick={() => setEditMode(false)}>Discard</button>
            </div>
          </div>
          : <p>{message.message}</p>
        }
        <div className='flex gap-1'>
          <p className='text-gray-500'>{DateTime.fromISO(message.sendDate).toFormat('MMM dd, HH:mm')}</p>
          { message.edited[0] ? <p className='text-gray-500 italic'>(Edited)</p> : '' }
        </div>
      </div>
      { account.id == message.sender[1] && !isDeleting && !isEdit
      ?
      <div className='m-2 grid grid-cols-2 gap-2 ml-auto self-start'>
        <button className='transition ease-in-out hover:scale-110' onClick={() => setEditMode(true)}>
          <img className='w-5 h-5' src={editIcon}/>
        </button>
        <button className='transition ease-in-out hover:scale-110' onClick={() => deleteMessage()}>
          <img className='w-5 h-5' src={deleteIcon}/>
        </button>
      </div>
      : null }
    </motion.div>
  )
}

export default function MessengerMenu({ socket }) {
  const { chatID } = useParams()

  const [conversation, setConversation] = useState({})
  const [messageInput, setMessageInput] = useState('')

  const account = useSelector((state) => state.auth.account)

  function getConversation() {
    axios.get('/api', { params: { type: 'getConversation', id: chatID } })
    .then(res => { 
      const result = res.data
      if (result.code == 'success') setConversation(result.conversation)
    })
    .catch(err => console.log(err))
  }

  function sendMessage() {
    if (messageInput != '') {
      const message = { conversationID: conversation._id, message: messageInput }
      socket.emit('chatMessage', message)

      setMessageInput('')
    }
  }

  useEffect(() => {
    getConversation()
  }, [chatID])

  useEffect(() => {
    socket.on('chatMessage', (data) => {
      const newConversation = { ...conversation }
      newConversation.messages.push(data)

      setConversation(newConversation)
    })

    socket.on('editMessage', (data) => {
      const newConversation = { ...conversation }

      newConversation.messages.map((item, index) => {
        if (item._id == data._id) {
          item.message = data.message 
          item.edited = data.edited
        }
        return item
      })

      setConversation(newConversation)
    })

    socket.on('deleteMessage', (data) => {
      const newConversation = { ...conversation }

      let index = newConversation.messages.findIndex(x => x._id == data)

      if (index !== -1) {
        newConversation.messages.splice(index, 1)
        setConversation(newConversation)
      }
    })

    return () => { 
      socket.off('chatMessage')
      socket.off('editMessage')
      socket.off('deleteMessage')
    }
  }, [conversation])

  return (
    conversation.participants && account ?
    <div className='bg-[#2d3034] grid grid-rows-[auto,1fr,auto]'>
      <div className='bg-[#212529] border-b-2 border-gray-500 p-2 flex items-center gap-2'>
        <Avatar className='w-14 h-14' source={conversation.participants.find(x => x._id != account.id).avatar} socket={socket}/>
        <div>
          <p className='font-bold'>{conversation.participants.find(x => x._id != account.id).nickname}</p>
          <OnlineText className='font-medium' id={conversation.participants.find(x => x._id != account.id)._id} socket={socket} onlineText='Online' onlineStyle='text-green-500' offlineText='Offline' offlineStyle='text-gray-500'/>
        </div>
      </div>
      <div className='min-h-0 overflow-x-hidden overflow-y-auto'>
        <div className='border-b px-2 py-4 flex flex-col items-center justify-center gap-1'>
          <Avatar className='w-28 h-28' source={conversation.participants.find(x => x._id != account.id).avatar}/>
          <p className='text-4xl font-bold'>{conversation.participants.find(x => x._id != account.id).nickname}</p>
          <p className='text-xl font-medium text-gray-500'>This is the start of conversation, sir.</p>
        </div>
        { conversation.messages?.map((message, index) => {
          const newMessage = {
            id: message._id,
            avatar: conversation.participants.find(x => x._id == message.sender).avatar,
            sender: [conversation.participants.find(x => x._id == message.sender).nickname, message.sender],
            message: message.message,
            edited: message.edited,
            sendDate: message.sendDate
          }
          return <MessageObj key={index} socket={socket} message={newMessage} chatID={conversation._id}/>
        })}
      </div>
      <div className='border-t-2 border-gray-500 p-4 grid grid-cols-[1fr,auto]'>
        <input className='border-s-2 border-t-2 border-b-2 border-r rounded-s-lg px-2 py-2 text-xl outline-none' value={messageInput} onChange={e => setMessageInput(e.target.value)}/>
        <button className='border-e-2 border-t-2 border-b-2 border-l rounded-e-lg px-2 text-lg'><img className='h-8' src={sendIcon} onClick={() => sendMessage()}/></button>
      </div>
    </div>
    : null
  )
}