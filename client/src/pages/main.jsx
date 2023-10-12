import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { login } from '../redux/accountSlice'

import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import Input from '../components/input/input.jsx';
import Tabs from '../components/tabs/tabs.jsx'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//import Tab from 'react-bootstrap/Tab';
//import Tabs from 'react-bootstrap/Tabs';

import Spinner from 'react-bootstrap/Spinner';

import VisitCard from './visitcard';
import Projects from './projects';

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
    
    const result = await axios.get({
      url: '/api',
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
    const result = await axios.get({
      url: '/api',
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

      <Tabs components={[<VisitCard title='About'/>, <Projects title='Projects'/>]}/>

      <Footer/>

      {/* <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
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
      </Modal> */}
    </>
  )
}