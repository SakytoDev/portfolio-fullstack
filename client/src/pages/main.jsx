import './main.css';

import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import Tabs from '../components/tabs/tabs.jsx';

import VisitCard from './visitcard';
import Projects from './projects';

export default function MainMenu() {
  return (
    <>
      <title>Portfolio</title>
      
      <div className='min-h-screen bg-gradient-to-t from-zinc-950 from-90% to-indigo-950 to-100% text-white'>
        <Header/>
        <Tabs className='flex justify-center gap-6 p-8' components={[<VisitCard title='About'/>, <Projects title='Projects'/>]}/>
        <Footer/>
      </div>
    </>
  )
}