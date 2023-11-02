import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import axios from 'axios';

import Avatar from './components/avatar/avatar';

function PeopleCard({ data }) {
  return (
    <div className='p-3 border-2 rounded-lg flex flex-col items-stretch justify-center gap-2'>
      <Avatar className='mx-8 w-24 h-24' source={data.avatar}/>
      <p className='text-2xl text-center font-bold'>{data.nickname}</p>
      <div className='flex flex-col gap-1'>
        <Link className='border-2 p-1 border-indigo-400 rounded-lg text-lg text-center font-medium transition ease-in-out hover:bg-indigo-600' to={`../profile/${data._id}`}>Profile</Link>
        <Link className='border-2 p-1 border-blue-400 rounded-lg text-lg text-center font-medium transition ease-in-out hover:bg-blue-600' to={`../chat/${data._id}`}>Chat</Link>
      </div>
    </div>
  )
}

function ConversationCard({ data }) {
  const account = useSelector((state) => state.auth.account)

  return (
    <div className='border-2 flex flex-col rounded-lg'>
      <div className='p-3 border-b-2 flex items-center gap-3'>
        <Avatar className='w-24 h-24' source={data.participants.find(x => x._id != account.id)?.avatar}/>
        <div className='flex flex-col gap-1'>
          <p className='text-4xl font-bold'>{data.participants.find(x => x._id != account.id)?.nickname}'s chat</p>
          <p className='text-xl'>Participants Count: {data.participants.length}</p>
        </div>
      </div>
      <Link className='border-2 p-1 m-3 border-blue-400 rounded-lg text-lg text-center font-medium transition ease-in-out hover:bg-blue-600' to={`../chat/${data._id}`}>Open Conversation</Link>
    </div>
  )
}

export default function ChatMenu() {
  const [tabIndex, setTabIndex] = useState(0)
  
  const [peopleList, setPeopleList] = useState([[],[]])
  const [conversationList, setConversationList] = useState([])

  const account = useSelector((state) => state.auth.account)

  function getContacts() {
    axios.get('/api', { params: { type: 'getContacts', id: account.id } })
    .then(res => {
      const result = res.data
      console.log(result.people)
      if (result.code == 'success') setPeopleList(result.people)
    })
    .catch(err => console.log(err))
  }

  function getConversations() {
    axios.get('/api', { params: { type: 'getConversations', id: account.id } })
    .then(res => {
      const result = res.data
      if (result.code = 'success') setConversationList(result.conversations)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    if (tabIndex == 0) {
      getContacts()
    } else if (tabIndex == 1) {
      getConversations()
    }
  }, [tabIndex])

  return (
    <div className='bg-[#2d3034] grid grid-rows-[auto,1fr]'>
      <div className='px-12 py-4 border-b grid grid-cols-2'>
        <button className={`p-2 rounded-t text-xl font-bold text-center hover:bg-zinc-700 ${tabIndex == 0 ? 'border-b-2' : ''}`} onClick={() => setTabIndex(0)}>Contacts</button>
        <button className={`p-2 rounded-t text-xl font-bold text-center hover:bg-zinc-700 ${tabIndex == 1 ? 'border-b-2' : ''}`} onClick={() => setTabIndex(1)}>Conversations</button>
      </div>
      { tabIndex == 0 
      ?
      <div className='py-10 flex flex-col gap-2'>
        <div className='bg-[#212529] rounded-2xl mx-12 p-3'>
          <p className='py-2 text-4xl text-center font-black'>Friends:</p>
          <div className={`mt-4 flex overflow-auto ${peopleList[1].length > 0 ? 'justify-start' : 'justify-center'}`}>
            { peopleList[1].length > 0 
              ? peopleList.map((people, index) => { return <PeopleCard key={index} data={people}/> })
              : <p className='mb-4 text-3xl font-medium'>Hmm. No one.</p> 
            }
          </div>
        </div>
        <div className='bg-[#212529] rounded-2xl mx-12 p-3'>
          <p className='py-2 text-4xl text-center font-black'>Find People:</p>
          <div className='mt-4 flex overflow-auto gap-2'>
            { peopleList[0].map((people, index) => {
              return <PeopleCard key={index} data={people}/>
            })}
          </div>
        </div>
      </div>
      :
      <div className='my-12 bg-[#212529] grid grid-rows-[auto,1fr] min-h-0 rounded-2xl mx-12 p-3'>
        <p className='py-2 text-4xl text-center font-black'>Recent Conversations:</p>
        <div className={`mt-4 flex flex-col ${conversationList.length > 0 ? 'items-stretch justify-start' : 'items-center justify-center'} overflow-auto gap-3`}>
          { conversationList.length > 0 
            ? conversationList.map((conversation, index) => { return <ConversationCard key={index} data={conversation}/> })
            : <p className='mb-4 text-2xl font-medium'>No recent conversations. Maybe you need to start chatting</p> 
          }
        </div>
      </div> }
    </div>
  )
}