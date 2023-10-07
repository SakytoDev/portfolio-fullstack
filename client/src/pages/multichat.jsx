import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './multichat.css';

import MemberObj from '../components/member/member.jsx';
import MessageObj from '../components/message/message.jsx';

import accIcon from '../assets/images/defaultAcc.png';
import sendIcon from '../assets/images/send.png';

export default function MultiChat({ sockets }) {
  const [account, setAccount] = useState(null)
  const [nickname, setNickname] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [messagesList, setMessagesList] = useState([])
  const [membersList, setMembersList] = useState([])

  const handleInputChange = (e) => {
    setMessageInput(e.target.value)
  }

  function SendMessage() {
    if (account && messageInput && messageInput != '') {
        sockets.emit('chatMessage', { "id": account.id, "message": messageInput })
        setMessageInput('')
    }
  }

  useEffect(() => {
    async function getAccount() {
      const result = await axios({
        url: '/api',
        method: 'GET',
        params: { type: 'getAcc' }
      })
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  
      if (result.code == 'success') {
        sockets.emit('authUpdate', { "id": result.account.id })
        setAccount(result.account)
      }
    }

    getAccount()
  }, [])

  useEffect(() => {
    async function getNickname() {
      const result = await axios({
        url: '/api',
        method: 'GET',
        params: { type: 'getNickname' }
      })
      .then(res => { return res.data })
      .catch(err => { console.log(err) })

      setNickname(result.nickname)
    }
    getNickname()
  }, [])

  useEffect(() => {
    sockets.on('onlineList', function(data) {
      setMembersList(current => { current = []; return [...current, ...data] })
    })

    sockets.on('chatMessage', function(data) {
      setMessagesList(current => [...current, data])
    })
  }, [])

  return (
    <>
      <title>MultiChat</title>
      <div className='bg-black'>
        <div className='grid grid-cols-[1fr,2fr,1fr] grid-rows-[97vh] p-3'>
          <div className='border-2 border-gray-500 rounded-s-xl'>
            <div className='flex items-center bg-profile p-2 rounded-tl-xl'>
              <img className='w-12 h-12' src={accIcon}/>
              <p className='ms-2 text-xl font-semibold'>{nickname}</p>
            </div>
          </div>

          <div className='border-t-2 grid grid-rows-[1fr,0.05fr] border-gray-500 border-b-2'>
            <div className='grid auto-rows-min overflow-auto'>
              { messagesList.map((message, index) => {
                return ( <MessageObj key={index} message={message}/> )
              }) }
            </div>
            <div className='border-t-2 border-gray-500'>
              <div className='flex items-center p-3'>
                <input className='flex-fill me-2 p-2' placeholder='Сообщение...' onChange={handleInputChange} value={messageInput}/>
                <button onClick={() => SendMessage()}><img className='w-8 h-8' src={sendIcon}/></button>
              </div>
            </div>
          </div>

          <div className='border-2 border-gray-500 rounded-e-xl gap-2 p-3'>
            { membersList.map((name, index) => {
              return ( <MemberObj key={index} nickname={name}/> )
            }) }
          </div>
        </div>
      </div>
    </>
  )
}