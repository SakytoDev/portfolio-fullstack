import { useState, useEffect } from 'react';

import axios from 'axios';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import io from 'socket.io-client'
let socket = io()

import Header from '../../components/header/header.jsx';
import Footer from '../../components/footer/footer.jsx';
import Input from '../../components/input/input.jsx'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Spinner from 'react-bootstrap/Spinner'

function MainMenu() {
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

  useEffect(() => {
    getAccount()
  }, [])

  async function AuthToAccount() {
    setAuthLoading(true)
    
    const result = await axios({
      url: '/request',
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
      url: '/request',
      method: 'GET',
      params: { type: 'getAcc' }
    })

    if (result.data.code == 'success') {
      setAccount(result.data.account)
    }
  }

  return (
    <>
      <Header showModal={() => setModalShow(true)} account={account}/>

      <div className='rounded-4 border-2 border-gray-300 ms-16 me-16 mt-10'>
        <div className='flex items-center border-b-2 border-gray-300 p-10'>
          <div>
            <img className='w-24 h-24 rounded-2xl' src="../media/images/chatLogo.png"/>
          </div>
          <div className='ms-5'>
            <p className='text-5xl fw-bold'>MultiChat</p>
            <p className='text-3xl mt-2'>Общайтесь с друзьями и находите новых</p>
          </div>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            <div className='border-r border-gray-300 col p-7 me-2'>
              <h2 className='text-3xl font-bold fs-5'>Windows</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div>
            <div className='border-gray-300 col p-7 ms-2'>
              <h2 className='text-3xl font-bold fs-5'>Android</h2>
              <ButtonGroup className='mt-3'>
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div> 

      <div className='rounded-4 border-2 border-gray-300 ms-16 me-16 mt-10'>
        <div className='border-b-2 border-gray-300 p-10'>
          <h1 className='display-5 fw-bold'>EvaPost</h1>
          <h2 className='text-3xl mt-2'>Поделитесь вашими мыслями о сегодняшнем дне, или расскажите, сколько кофе Вы сегодня выпили</h2>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            <div className='border-r border-gray-300 col p-7 me-2'>
              <h2 className='text-3xl font-bold fs-5'>Windows</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div>
            <div className='border-gray-300 col p-7 ms-2'>
              <h2 className='text-3xl font-bold fs-5'>Android</h2>
              <ButtonGroup className='mt-3'>
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-4 border-2 border-gray-300 ms-16 me-16 mt-10 mb-32'>
        <div className='border-b-2 border-gray-300 p-10'>
          <h1 className='display-5 fw-bold'>Trackify</h1>
          <h2 className='text-3xl mt-2'>Слушайте, делитесь или опубликуйте музыку</h2>
        </div>

        <div className='border-gray-300'>
          <div className='flex'>
            <div className='border-r border-gray-300 col p-7 me-2'>
              <h2 className='text-3xl font-bold fs-5'>Windows</h2>
              <ButtonGroup className="mt-3">
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div>
            <div className='border-gray-300 col p-7 ms-2'>
              <h2 className='text-3xl font-bold fs-5'>Android</h2>
              <ButtonGroup className='mt-3'>
                <Button variant="outline-light" disabled>В разработке</Button>
              </ButtonGroup>
            </div>
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

export default MainMenu