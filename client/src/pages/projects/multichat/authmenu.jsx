import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/accountSlice';

import axios from 'axios';

import Input from './components/input/input';
import Tabs from './../../../components/tabs/tabs';

import chatLogo from '../../../assets/images/chatLogo.png'

function LoginTab() {
  const [authForm, setForm] = useState({})
  const [authLoading, setAuthLoading] = useState(false)

  const dispatch = useDispatch()

  const handleFormChange = (e) => {
    setForm({
      ...authForm,
      [e.target.name]: e.target.value
    })
  }

  function loginAccount() {
    setAuthLoading(true)

    axios.get('/api', { params: { type: 'accLogin', form: authForm } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') dispatch(login({ account: result.account }))
    })
    .catch(err => console.log(err))
    .finally(() => setAuthLoading(false))
  }

  return (
    <div>
      <div className="flex flex-col w-[30vw] gap-2">
        <Input type="text" name="nickname" placeholder="Nickname" onChange={handleFormChange}/>
        <Input type="password" name="password" placeholder="Password" onChange={handleFormChange}/>
        <button className='border-2 disabled:border-gray-500 disabled:text-gray-500 rounded p-1 transition ease-in-out enabled:hover:text-black enabled:hover:bg-white' disabled={authLoading} onClick={() => loginAccount()}>
          <p className='text-xl'>{ authLoading ? 'Signing in' : 'Sign in' }</p>
        </button>
      </div>
    </div>
  )
}

function RegTab() {
  const [authForm, setForm] = useState({})
  const [authLoading, setAuthLoading] = useState(false)

  const dispatch = useDispatch()

  function regAccount() {
    setAuthLoading(true)
  
    axios.get('/api', { params: { type: 'accReg', form: authForm } })
    .then(res => {
      const result = res.data
      if (result.code == 'success') dispatch(login({ account: result.account }))
    })
    .catch(err => console.log(err))
    .finally(() => setAuthLoading(false))
  }

  const handleFormChange = (e) => {
    setForm({
      ...authForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <div className="flex flex-col w-[30vw] gap-2">
        <Input type="text" name="email" placeholder="Email" onChange={handleFormChange}/>
        <Input type="text" name="nickname" placeholder="Nickname" onChange={handleFormChange}/>
        <Input type="password" name="password" placeholder="Password" onChange={handleFormChange}/>
        <button className='border-2 disabled:border-gray-500 disabled:text-gray-500 rounded p-1 transition ease-in-out enabled:hover:text-black enabled:hover:bg-white' disabled={authLoading} onClick={() => regAccount()}>
          <p className='text-xl'>{ authLoading ? 'Signing up' : 'Sign up' }</p>
        </button>
      </div>
    </div>
  )
}

export default function AuthMenu() {
  return (
    <div className='bg-[#2d3034] text-white h-[100vh] flex flex-col items-center pt-16'>
      <img className='w-48 h-48 rounded-xl' src={chatLogo}/>
      <p className='font-bold text-5xl mt-6'>MultiChat</p>
      <Tabs className='flex justify-center gap-5 p-5 mt-6' components={[<LoginTab title='Sign in'/>, <RegTab title='Sign up'/>]}/>
    </div>
  )
}