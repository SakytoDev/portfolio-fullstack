import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import Input from '../components/input/input.jsx'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Spinner from 'react-bootstrap/Spinner';

import chatLogo from '../assets/images/chatLogo.png'

export default function MainMenu({ sockets }) {
  const [account, setAccount] = useState(null)
  const [modalShow, setModalShow] = useState(false)
  const [authForm, setForm] = useState({})
  const [authMode, setAuthMode] = useState('accLogin')
  const [authLoading, setAuthLoading] = useState(false)

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
    
    if (result.data.code == 'success') {
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
      setAccount(result.account)
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  return (
    <>
      <title>Portfolio</title>

      <Header showModal={() => setModalShow(true)} account={account}/>

      <h1 className='mt-5 text-center font-bold text-4xl md:text-5xl'>Проекты:</h1>

      <div className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mt-10'>
        <div className='flex items-center border-b-2 border-gray-300 p-5 md:p-10'>
          <img className='self-baseline w-16 h-16 md:w-24 md:h-24 rounded-2xl' src={chatLogo}/>
          <div className='ms-5'>
            <p className='text-3xl md:text-5xl font-bold'>MultiChat</p>
            <p className='text-xl md:text-3xl mt-2'>Общайтесь с друзьями или находите новых</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            { !isMobile ? <div className='grid border-r border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Веб-версия</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" href="/multichat">Войти</Button>
              </ButtonGroup>
            </div> : null }
            { !isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Windows</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div> : null }
            { isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Android</h2>
              <ButtonGroup className='mt-3'>
                <Button variant="outline-light" href="/download/android">В разработке</Button>
              </ButtonGroup>
            </div> : null }
          </div>
        </div>
      </div> 

      <div className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mt-10'>
        <div className='flex items-center border-b-2 border-gray-300 p-10'>
          <div className='ms-5'>
            <p className='text-3xl md:text-5xl font-bold'>EvaPost</p>
            <p className='text-xl md:text-3xl mt-2'>Поделитесь вашими мыслями о сегодняшнем дне, или расскажите, сколько кофе Вы сегодня выпили</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            { !isMobile ? <div className='grid border-r border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Веб-версия</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div> : null }
            { !isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Windows</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div> : null }
            { isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Android</h2>
              <ButtonGroup className='mt-3'>
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div> : null }
          </div>
        </div>
      </div>

      <div className='rounded-3xl border-2 md:border-3 border-gray-300 mx-8 md:mx-16 mt-10 mb-32'>
        <div className='flex items-center border-b-2 border-gray-300 p-10'>
          <div className='ms-5'>
            <p className='text-3xl md:text-5xl font-bold'>Trackify</p>
            <p className='text-xl md:text-3xl mt-2'>Слушайте, делитесь или опубликуйте музыку</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            { !isMobile ? <div className='grid border-r border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Веб-версия</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div> : null }
            { !isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Windows</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div> : null }
            { isMobile ? <div className='grid border-gray-300 col p-7'>
              <h2 className='text-3xl text-center font-bold'>Android</h2>
              <ButtonGroup className='mt-3'>
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div> : null }
          </div>
        </div>
      </div>

      <Footer/>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header className="justify-center">
          <Modal.Title>Авторизация</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-1">
          <Tabs variant="underline" className="mt-1 justify-center" onSelect={handleTabChange}>
            <Tab eventKey="accLogin" title="Логин">
              <div className="mt-3">
                <Input type="text" name="nickname" placeholder="Никнейм" onChange={handleFormChange}/>
                <Input className="mt-2" type="password" name="password" placeholder="Пароль" onChange={handleFormChange}/>
              </div>
            </Tab>
            <Tab eventKey="accReg" title="Регистрация">
              <div className="mt-3">
                <Input type="text" name="email" placeholder="Почта" onChange={handleFormChange}/>
                <Input className="mt-2" type="text" name="nickname" placeholder="Никнейм" onChange={handleFormChange}/>
                <Input className="mt-2" type="password" name="password" placeholder="Пароль" onChange={handleFormChange}/>
              </div>
            </Tab>
          </Tabs>
          <Button variant="outline-primary" className="flex justify-center items-center w-100 mt-3" onClick={() => AuthToAccount()} disabled={authLoading}>
            { authLoading ? <Spinner className='me-2' animation="border" size="sm" /> : null }
            { authMode == 'accLogin' ? 'Войти' : 'Регистрация' }
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100" variant="secondary" onClick={() => setModalShow(false)}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}