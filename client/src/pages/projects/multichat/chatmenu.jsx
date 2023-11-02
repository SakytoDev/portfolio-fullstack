import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import axios from 'axios';

import Avatar from './components/avatar/avatar';
import accIcon from './assets/images/defaultAcc.png';

function PeopleCard({ data }) {
  return (
    <div className='px-3 py-3 border-2 rounded-lg flex flex-col items-stretch justify-center gap-2'>
      <Avatar className='mx-8 w-24 h-24' id={data._id}/>
      <p className='text-2xl text-center font-bold'>{data.nickname}</p>
      <div className='flex flex-col gap-1'>
        <Link className='border-2 p-1 border-indigo-400 rounded-lg text-lg text-center font-medium transition ease-in-out hover:bg-indigo-600' to={`../profile/${data._id}`}>Profile</Link>
        <Link className='border-2 p-1 border-blue-400 rounded-lg text-lg text-center font-medium transition ease-in-out hover:bg-blue-600' to={`../chat/${data._id}`}>Chat</Link>
      </div>
    </div>
  )
}

export default function ChatMenu() {
  const [tabIndex, setTabIndex] = useState(0)
  const [peopleList, setPeopleList] = useState([[],[]])

  const account = useSelector((state) => state.auth.account)

  async function getContacts() {
    axios.get('/api', { params: { type: 'getContacts', id: account.id } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') setPeopleList(result.people)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    if (tabIndex == 0) {
      getContacts()
    } else if (tabIndex == 1) {

    }
  }, [tabIndex])

  return (
    <div className='bg-[#2d3034] overflow-auto'>
      <div className='px-12 py-4 border-b grid grid-cols-2'>
        <button className={`p-2 rounded-t text-xl font-bold text-center hover:bg-zinc-700 ${tabIndex == 0 ? 'border-b-2' : ''}`} onClick={() => setTabIndex(0)}>Contacts</button>
        <button className={`p-2 rounded-t text-xl font-bold text-center hover:bg-zinc-700 ${tabIndex == 1 ? 'border-b-2' : ''}`} onClick={() => setTabIndex(1)}>Conversations</button>
      </div>
      <div className='py-10 flex flex-col gap-5'>
        <div className='bg-[#212529] rounded-2xl mx-12 p-3'>
          <p className='py-2 text-4xl text-center font-bold'>Find People:</p>
          <div className='mt-4 flex overflow-auto gap-2'>
            { peopleList[0].map((people, index) => {
              return <PeopleCard key={index} data={people}/>
            })}
          </div>
        </div>
        <div className='bg-[#212529] rounded-2xl mx-12 p-3'>
          <p className='py-2 text-4xl text-center font-bold'>Friends:</p>
          <div className={`mt-4 flex overflow-auto ${peopleList[1]?.length > 0 ? 'justify-start' : 'justify-center'}`}>
            { peopleList[1].length > 0 
              ? peopleList.map((people, index) => { return <PeopleCard key={index} data={people}/> })
              : <p className='mb-4 text-4xl font-black'>Hmm. No one.</p> 
            }
          </div>
        </div>
      </div>
    </div>
  )
}