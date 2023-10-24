import './app.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import Main from './pages/main.jsx';
import MultiChat from './pages/projects/multichat/multichat.jsx';
import NoizeMC from './pages/projects/noizemc/src/noizemc.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/multichat/*' element={<MultiChat/>}/>
        <Route path='/noizemc' element={<NoizeMC/>}/>
      </Routes>
    </BrowserRouter>
  </Provider>
)