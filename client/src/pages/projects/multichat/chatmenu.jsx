import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import axios from 'axios';

import Avatar from './components/avatar/avatar';

function PeopleCard({ data }) {
  return (
    <div className='p-2 border-2 rounded-xl flex flex-col gap-2'>
      <div className='border-b-2 pb-2 flex items-center gap-2'>
        <Avatar className='w-12 h-12' source={data.avatar}/>
        <p className='text-xl'>{data.nickname}</p>
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Link className='border-2 p-1 border-indigo-400 rounded-lg text-lg text-center font-medium transition ease-in-out hover:bg-indigo-600' to={`../profile/${data._id}`}>View Profile</Link>
        <Link className='border-2 p-1 border-blue-400 rounded-lg text-lg text-center font-medium transition ease-in-out hover:bg-blue-600' to={`../chat/${data._id}`}>Open Chat</Link>
      </div>
    </div>
  )
}

export default function ChatMenu() {
  const [tabIndex, setTabIndex] = useState(0)
  const [peopleList, setPeopleList] = useState([])

  const account = useSelector((state) => state.auth.account)

  async function getPeople() {
    await axios.get('/api', { params: { type: 'getAccs' } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') setPeopleList(result.accounts.filter(x => { return x._id != account.id }))
    })
    .catch(err => console.log(err))
  }

  async function getFriends() {
    await axios.get('/api', { params: { type: 'getFriends', id: account.id }})
    .then(res => {
      const result = res.data
      if (result.code == 'success') setPeopleList(result.friends.friends)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    if (tabIndex == 0) {
      getPeople()
    } else if (tabIndex == 1) {
      getFriends()
    }
  }, [tabIndex])

  return (
    <div className='bg-[#2d3034]'>
      <div className='px-12 py-4 border-b grid grid-cols-2'>
        <button className={`p-2 rounded-t text-xl font-bold text-center hover:bg-zinc-700 ${tabIndex == 0 ? 'border-b-2' : ''}`} onClick={() => setTabIndex(0)}>Find People</button>
        <button className={`p-2 rounded-t text-xl font-bold text-center hover:bg-zinc-700 ${tabIndex == 1 ? 'border-b-2' : ''}`} onClick={() => setTabIndex(1)}>Friends</button>
      </div>
      <div className='px-24 p-6 flex flex-col gap-4'>
        { peopleList.map((people, index) => {
          return <PeopleCard key={index} data={people}/>
        })}
      </div>
    </div>
  )
}