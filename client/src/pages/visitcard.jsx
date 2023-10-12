import Typewriter from '../components/typewriter/typewriter';

import multipage from '../assets/images/multipage.png';
import crossplatform from '../assets/images/crossplatform.png';
import backend from '../assets/images/backend.png';

export default function VisitCard() {
  return (
    <>
      <div className='mx-8 md:mx-16 mb-10 animate-card-appear'>
        <div className='bg-gradient-to-br from-indigo-600 to-violet-900 flex flex-col md:grid md:grid-cols-[1fr,0.3fr] items-center rounded-3xl p-5'>
          <div className='grid md:grid-rows-[1.1fr,1fr] md:p-5'>
            <div className='flex justify-center md:justify-start gap-1 md:gap-3 text-[1.8rem] md:text-[4rem] font-black'>
              <p>I'm</p>
              <Typewriter delay={70} startDelay={1000} infinite={true} text={['Frontend', 'Backend', 'Fullstack']}/>
              <p>developer</p>
            </div>
            <div className='whitespace-pre-line'>
              <Typewriter className='md:text-xl text-center md:text-left' startDelay={1500} text={['I develop a variety of websites, including both single-page applications and multi-page websites, as well as integrating various APIs and databases.', '\nProgramming is my hobby. I am constantly looking for ways to improve my skills.']}/>
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

      <h1 className='text-6xl font-black text-center'>My skills:</h1>

      <div className='relative'>
        <hr className='border-3 absolute w-50'/>
        <div className='grid grid-cols-3 gap-20 mx-32 mt-16 mb-10'>
          <div className='border-3 border-gray-500 rounded-xl p-5 flex flex-col items-center gap-3'>
            <img className='h-16' src={multipage}/>
            <p className='text-center font-medium'>Development of single-page and multi-page websites of any subject, landing page or simple online store. I also design websites using layouts from Figma or similar ones.</p>
          </div>
          <div className='border-3 border-gray-500 rounded-xl p-5 flex flex-col items-center gap-3'>
            <img className='h-16' src={crossplatform}/>
            <p className='text-center font-medium'>Adaptation and cross-platforming for any device and screen size.</p>
          </div>
          <div className='border-3 border-gray-500 rounded-xl p-5 flex flex-col items-center gap-3'>
            <img className='h-16' src={backend}/>
            <p className='text-center font-medium'>In addition to website layout, I develop server code and also connect databases.</p>
          </div>
        </div>
      </div>
    </>
  )
}