import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { login } from '../redux/accountSlice'

import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import Input from '../components/input/input.jsx'
import Typewriter from '../components/typewriter/typewriter';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Spinner from 'react-bootstrap/Spinner';

import chatLogo from '../assets/images/chatLogo.png';

import websitelogo from '../assets/images/website.png';
import androidlogo from '../assets/images/android.png';
import windowslogo from '../assets/images/windows.png';

export default function MainMenu({ sockets }) {
  const [modalShow, setModalShow] = useState(false)
  const [authForm, setForm] = useState({})
  const [authMode, setAuthMode] = useState('accLogin')
  const [authLoading, setAuthLoading] = useState(false)

  const dispatch = useDispatch()

  const handleTabChange = (tab) => { setAuthMode(tab) }

  const handleFormChange = (e) => {
    setForm({
      ...authForm,
      [e.target.name]: e.target.value
    })
  }

  async function AuthToAccount() {
    setAuthLoading(true)
    
    const result = await axios({
      url: '/api',
      method: 'GET',
      params: { type: authMode, form: authForm }
    })
    .then(res => { return res.data })
    .catch(err => { console.log(err) })
    
    if (result.code == 'success') {
      await getAccount()

      setModalShow(false)
    }

    setAuthLoading(false)
  }

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
      dispatch(login({ "account": result.account }))
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  return (
    <>
      <title>Portfolio</title>

      <Header showModal={() => setModalShow(true)}/>

      <div className='mx-8 md:mx-16 my-10'>
        <div className='bg-gradient-to-br from-indigo-600 to-violet-900 flex flex-col md:grid md:grid-cols-[1fr,0.3fr] items-center rounded-3xl p-5'>
          <div className='grid md:grid-rows-[1.1fr,1fr] md:p-5'>
            <div className='flex justify-center md:justify-start gap-1 md:gap-3 text-[1.8rem] md:text-[4rem] font-black'>
              <p>I'm</p>
              <Typewriter delay={70} startDelay={200} infinite={true} text={['Frontend', 'Backend', 'Fullstack']}/>
              <p>developer</p>
            </div>
            <div className='whitespace-pre-line'>
              <Typewriter className='md:text-xl text-center md:text-left' startDelay={500} text={['I develop a variety of websites, including both single-page applications and multi-page websites, as well as integrating various APIs and databases.', '\nProgramming is my hobby. I am constantly looking for ways to improve my skills.']}/>
            </div>
          </div>
          <div>
            <img className='rounded-full w-64 h-64 mt-5 md:mt-0' src='https://avatars.githubusercontent.com/u/21197535?v=4'/>
            <div className='p-2 mt-3 gap-2 border rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center'>
              <img className='w-8 rounded transition-all ease-in-out hover:scale-125 hover:mx-1' src='https://www.mongodb.com/assets/images/global/favicon.ico'/>
              <img className='rounded transition-all ease-in-out hover:scale-125 hover:mx-1' src='https://expressjs.com/images/favicon.png'/>
              <img className='rounded transition-all ease-in-out hover:scale-125 hover:mx-1' src='https://react.dev/favicon.ico'/>
              <img className='rounded transition-all ease-in-out hover:scale-125 hover:mx-1' src='https://nodejs.org/static/images/favicons/favicon.png'/>
            </div>
          </div>
        </div>
      </div>

      <h1 className='mt-5 text-center font-bold text-4xl md:text-5xl'>Projects:</h1>

      <div className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mt-10'>
        <div className='flex items-center border-b-2 border-gray-300 p-5 md:p-10'>
          <img className='self-baseline w-16 h-16 md:w-24 md:h-24 rounded-2xl' src={chatLogo}/>
          <div className='ms-3 md:ms-5'>
            <div className='flex gap-3'>
              <p className='text-3xl md:text-5xl font-bold'>MultiChat</p>
              <div className='flex gap-2 items-center'>
                <img className='w-4 md:w-6' src={websitelogo}/>
                <img className='w-4 md:w-6' src={windowslogo}/>
                <img className='w-4 md:w-6' src={androidlogo}/>
              </div>
            </div>
            <p className='text-xl md:text-3xl mt-2'>Chat with friends or find new ones</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            { !isMobile ? <div className='grid border-r border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Web-version</h2>
              <Link className='rounded-md border border-white flex items-center justify-center transition ease-in-out hover:bg-gray-300 hover:text-black' to='/multichat'>Enter</Link>
            </div> : null }
            { !isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Windows</h2>
              <Button className='mt-3' variant="outline-light" disabled>Coming soon</Button>
            </div> : null }
            { isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Android</h2>
              <Button className='mt-3' variant="outline-light" href="/download/android">Download</Button>
            </div> : null }
          </div>
        </div>
      </div> 

      <div className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mt-10'>
        <div className='flex items-center border-b-2 border-gray-300 p-10'>
          <div className='ms-5'>
            <p className='text-3xl md:text-5xl font-bold'>EvaPost</p>
            <p className='text-xl md:text-3xl mt-2'>Share your thoughts on public, or tell us how much coffee you drank today</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            { !isMobile ? <div className='grid border-r border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Web-version</h2>
              <Button className='mt-3' variant="outline-light" disabled>Coming soon</Button>
            </div> : null }
            { !isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Windows</h2>
              <Button className='mt-3' variant="outline-light" disabled>Coming soon</Button>
            </div> : null }
            { isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Android</h2>
              <Button className='mt-3' variant="outline-light" disabled>Coming soon</Button>
            </div> : null }
          </div>
        </div>
      </div>

      <div className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mt-10 mb-32'>
        <div className='flex items-center border-b-2 border-gray-300 p-10'>
          <div className='ms-5'>
            <p className='text-3xl md:text-5xl font-bold'>Trackify</p>
            <p className='text-xl md:text-3xl mt-2'>Listen, share or post music</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            { !isMobile ? <div className='grid border-r border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Web-version</h2>
              <Button className='mt-3' variant="outline-light" disabled>Coming soom</Button>
            </div> : null }
            { !isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Windows</h2>
              <Button className='mt-3' variant="outline-light" disabled>Coming soon</Button>
            </div> : null }
            { isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Android</h2>
              <Button className='mt-3' variant="outline-light" disabled>Coming soon</Button>
            </div> : null }
          </div>
        </div>
      </div>

      <Footer/>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header className="justify-center">
          <Modal.Title>Authorization</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-1">
          <Tabs variant="underline" className="mt-1 justify-center" onSelect={handleTabChange}>
            <Tab eventKey="accLogin" title="Login">
              <div className="mt-3">
                <Input type="text" name="nickname" placeholder="Nickname" onChange={handleFormChange}/>
                <Input className="mt-2" type="password" name="password" placeholder="Password" onChange={handleFormChange}/>
              </div>
            </Tab>
            <Tab eventKey="accReg" title="Register">
              <div className="mt-3">
                <Input type="text" name="email" placeholder="Email" onChange={handleFormChange}/>
                <Input className="mt-2" type="text" name="nickname" placeholder="Nickname" onChange={handleFormChange}/>
                <Input className="mt-2" type="password" name="password" placeholder="Password" onChange={handleFormChange}/>
              </div>
            </Tab>
          </Tabs>
          <Button variant="outline-primary" className="flex justify-center items-center w-100 mt-3" onClick={() => AuthToAccount()} disabled={authLoading}>
            { authLoading ? <Spinner className='me-2' animation="border" size="sm" /> : null }
            { authMode == 'accLogin' ? 'Sign in' : 'Sign up' }
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100" variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}