import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import Tabs from '../components/tabs/tabs.jsx'

import VisitCard from './visitcard';
import Projects from './projects';

export default function MainMenu() {
  return (
    <>
      <title>Portfolio</title>

      <Header/>
      <Tabs components={[<VisitCard title='About'/>, <Projects title='Projects'/>]}/>
      <Footer/>
    </>
  )
}