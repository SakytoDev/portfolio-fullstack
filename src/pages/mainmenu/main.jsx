import { useState, useEffect } from 'react';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import io from 'socket.io-client'
let socket = io()

import Header from '../../components/header/header.jsx';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Input from '../../components/input/input.jsx'

function MainMenu() {
  const [modalShow, setModalShow] = useState(false)
  const [authForm, setForm] = useState({email: '', nickname: '', password: ''})

  const handleFormChange = (e) => {
    setForm({
      ...authForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Header showModal={() => setModalShow(true)}/>

      <div className="rounded-4 ms-16 me-16 bg-gray mt-10 p-10">
        <h1 className="display-5 fw-bold">MultiChat</h1>
        <h2 className="text-3xl mt-2">Кросс-платформенный чат</h2>
      </div>

      <div className="rounded-4 ms-16 me-16 bg-gray mt-5">
        <h1 className="display-5 pt-7 pb-5 fw-bold text-center">Доступные платформы:</h1>
        <div className="flex p-5">
          <div className="col p-7 bg-dark rounded-2xl me-2">
            <h2 className="text-3xl font-bold fs-5">Windows</h2>
            <p className="fs-5 mt-2">Версия: 1.0.0</p>
            <ButtonGroup className="mt-3">
              <Button variant="outline-light">Установить</Button>
              <Button variant="outline-light">Список изменений</Button>
            </ButtonGroup>
          </div>
          <div className="col p-7 bg-dark rounded-2xl ms-2">
            <h2 className="text-3xl font-bold fs-5">Android</h2>
            <ButtonGroup className="mt-3">
              <Button variant="outline-light" disabled>В разработке</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header className="justify-center">
          <Modal.Title>Авторизация</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-1">
          <Tabs variant="underline" className="mt-1 justify-center">
            <Tab eventKey="loginTab" title="Логин">
              <div className="mt-3">
                <Input type="text" name="nickname" placeholder="Никнейм" onChange={handleFormChange}/>
                <Input className="mt-2" type="password" name="password" placeholder="Пароль" onChange={handleFormChange}/>
              </div>
              <Button variant="outline-primary" className="flex justify-center items-center w-100 mt-3">Войти</Button>
            </Tab>
            <Tab eventKey="regTab" title="Регистрация">
              <div className="mt-3">
                <Input type="text" name="email" placeholder="Почта" onChange={handleFormChange}/>
                <Input className="mt-2" type="text" name="nickname" placeholder="Никнейм" onChange={handleFormChange}/>
                <Input className="mt-2" type="password" name="password" placeholder="Пароль" onChange={handleFormChange}/>
              </div>
              <Button variant="outline-primary" className="w-100 mt-3">Регистрация</Button>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100" variant="secondary" onClick={() => setModalShow(false)}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MainMenu