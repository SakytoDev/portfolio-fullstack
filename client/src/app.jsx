import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './app.css';

import Main from './pages/main.jsx';
import MultiChat from './pages/multichat.jsx';

import io from 'socket.io-client';
const socket = io();

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main sockets={socket}/>}/>
      <Route path='/multichat' element={<MultiChat sockets={socket}/>}/>
    </Routes>
  </BrowserRouter>
)